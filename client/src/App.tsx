import * as React from 'react';
import io from 'socket.io-client';

import { Alert, Layout, Modal } from './components';
import { IAlertProps } from './components/Alert';
import {
    EAvatarName,
    EEvents,
    EUserStatus,
    ENotificationType,
    EPlayingMode,
    EViewType,
} from './enums';
import {
    IAwaitingUser,
    ICoordinates,
    IFleet,
    INotification,
    IOpponentFleet,
    IUser,
} from './models';
import { ControlService, IControlService } from './services/Controls';
import { FleetLocatingScreen, WaitingRoomScreen, GameScreen } from './screens';
import { SignUpScreen } from './screens/SignUp';

interface IAppState {
    awaitingUsers: IAwaitingUser[];
    firedCoordinatesOfOpponent: ICoordinates[];
    firedCoordinatesOfUser: ICoordinates[];
    fleets: IFleet[];
    isGameOver: boolean;
    isWinner?: boolean;
    notifications: INotification[];
    opponentFleets: IOpponentFleet[];
    user: IUser;
    userStatus: EUserStatus;
    playingMode?: EPlayingMode;
}

const initailState: IAppState = {
    awaitingUsers: [],
    firedCoordinatesOfOpponent: [],
    firedCoordinatesOfUser: [],
    notifications: [],
    userStatus: EUserStatus.UNREGISTERED,
    fleets: [],
    isGameOver: false,
    opponentFleets: [],
    user: {
        avatar: EAvatarName.BOY_1,
        username: '',
    }
}

class App extends React.Component<{}, IAppState> {
    socket: SocketIOClient.Socket;
    controlService: IControlService;

    constructor (props: {}) {
        super(props);
        this.state = {
            awaitingUsers: [],
            firedCoordinatesOfOpponent: [],
            firedCoordinatesOfUser: [],
            notifications: [],
            userStatus: EUserStatus.UNREGISTERED,
            fleets: [],
            isGameOver: false,
            opponentFleets: [],
            user: {
                avatar: EAvatarName.BOY_1,
                username: '',
            }
        }

        this.socket = io();
        this.controlService = new ControlService();
    }

    setUsername (username: string) {
        this.setState(state => ({
            user: {
                ...state.user,
                username
            }
        }));
    }

    setAvatar (avatar: EAvatarName) {
        this.setState(state => ({
            user: {
                ...state.user,
                avatar
            }
        }));
    }

    submitUser () {
        this.socket.emit(
            EEvents.CREATE_USER, 
            this.state.user,
            (userId: string) => this.setState(state => ({
                user: { ...state.user, id: userId },
                userStatus: EUserStatus.ONLINE
            }))
        )
    }

    getNotificationData (notification: INotification): IAlertProps {
        const { DECLINED_INVITATION, RECEIVED_INVITATION } = ENotificationType;
        const { username, type } = notification
        return {
            actions: type === RECEIVED_INVITATION ? [
                {
                    label: 'Decline',
                    onClick: () => this.reactToInvitation(notification.id as string, EEvents.DECLINE_JOIN_REQUEST)
                },
                {
                    label: 'Accept',
                    onClick: () => this.reactToInvitation(notification.id as string, EEvents.ACCEPT_JOIN_REQUEST)
                }
            ] : undefined,
            avatarName: notification.avatar,
            message: type === DECLINED_INVITATION
                ? `${username} has declined your invitation` : `${username} wants to play with you`,
            title: type === DECLINED_INVITATION ? 'Your invitation has been declined' : 'You have got new invitation',
            view: type === DECLINED_INVITATION ? EViewType.DANGER : EViewType.SUCCESS,
            onClose: type === DECLINED_INVITATION
                ? () => this.removeNotification(notification)
                : () => this.reactToInvitation(notification.id as string, EEvents.DECLINE_JOIN_REQUEST)
        }
    }

    removeNotification (notification: INotification) {
        this.setState(state => ({
            notifications: state.notifications.filter(({ id, type }) => !(notification.type === type && notification.id === id))
        }));
    }

    reactToInvitation (userId: string, reaction: EEvents.ACCEPT_JOIN_REQUEST | EEvents.DECLINE_JOIN_REQUEST) {
        this.setState(state => ({
            notifications: state.notifications.filter(({ id, type }) => !(id === userId && type === ENotificationType.RECEIVED_INVITATION))
        }));
        this.socket.emit(reaction, userId);
    }

    invitePlayer (roomId: string) {
        this.socket.emit(EEvents.SEND_JOIN_REQUEST, roomId);
        this.setState(state => ({
            awaitingUsers: state.awaitingUsers.map(user => ({
                ...user,
                hasBeenInvited: user.roomId === roomId || user.hasBeenInvited
            }))
        }));
    }

    submitFleetLocating (fleets: IFleet[]) {
        this.socket.emit(EEvents.COMPLETE_FLEETS_LOCATING, fleets, () => {
            this.setState({
                fleets,
                userStatus: EUserStatus.FLEET_LOCATING_COMPLETED,
            });
        });
    }

    fireOpponent (V: number, H: number) {
        this.socket.emit(
            EEvents.FIRE,
            { V, H },
            (
                firedFleetId: number | null,
                wasDestroyed: boolean,
                isGameOver: boolean
            ) => {
                const newState = {
                    firedCoordinatesOfOpponent: [...this.state.firedCoordinatesOfOpponent, { V, H }],
                    isGameOver,
                    isWinner: isGameOver ? true : undefined
                };
                if (firedFleetId) {
                    if (this.state.opponentFleets.some(fleet => fleet.id === firedFleetId)) {
                        this.setState(state => ({
                            ...newState,
                            opponentFleets: state.opponentFleets.map(
                                fleet => {
                                    if (fleet.id === firedFleetId) {
                                        return {
                                            ...fleet,
                                            wasDestroyed,
                                            coordinates: [...fleet.coordinates, { V, H }]
                                        };
                                    }
                                    return fleet;
                                }
                            ),
                        }))
                    } else {
                        this.setState(state => ({
                            ...newState,
                            opponentFleets: [...state.opponentFleets, {
                                id: firedFleetId,
                                wasDestroyed,
                                coordinates: [{ H, V}]
                            }],
                        }));
                    }
                } else {
                    this.setState({ ...newState, playingMode: EPlayingMode.WATCHING });
                }
            }
        );
    }

    finishBattle () {
        this.socket.emit(EEvents.FINISH_BATTLE, () => {
            this.setState(state => ({
                ...initailState,
                awaitingUsers: state.awaitingUsers,
                user: state.user,
                userStatus: EUserStatus.ONLINE,
                notifications: state.notifications
            }));
        });
    }

    componentDidMount () {
        this.controlService.init();
        this.socket.on(EEvents.GET_AWAITING_USERS_LIST, (users: IAwaitingUser[]) => {
            this.setState({
                awaitingUsers: users.filter(({ id }) => id !== this.state.user.id)
            });
        });
        this.socket.on(EEvents.SEND_JOIN_REQUEST, (invitation: IUser) => {
            this.setState(state => ({
                notifications: [
                    ...state.notifications,
                    { ...invitation, type: ENotificationType.RECEIVED_INVITATION }
                ]
            }));
        });
        this.socket.on(
            EEvents.FIRE,
            (
                firedFleetId: string | null,
                fleets: IFleet[], coordinates: ICoordinates,
                isGameOver: boolean
            ) => {
                this.setState(state => ({
                    playingMode: firedFleetId ? EPlayingMode.WATCHING : EPlayingMode.FIRING,
                    firedCoordinatesOfUser: [...state.firedCoordinatesOfUser, coordinates],
                    fleets: firedFleetId ? fleets : state.fleets,
                    isGameOver,
                    isWinner: isGameOver ? false : undefined
                }));
            }
        );
        this.socket.on(EEvents.DECLINE_JOIN_REQUEST, (rejectedUser: IAwaitingUser) => {
            this.setState(state => ({
                awaitingUsers: state.awaitingUsers.map(user => ({
                    ...user,
                    hasBeenInvited: user.roomId === rejectedUser.roomId ? false : user.hasBeenInvited,
                })),
                notifications: [
                    ...state.notifications,
                    { ...rejectedUser, type: ENotificationType.DECLINED_INVITATION }
                ]
            }));
        });
        this.socket.on(EEvents.START_FLEETS_LOCATING, () => {
            this.setState({ userStatus: EUserStatus.FLEET_LOCATING_IN_PROGRESS });
        });
        this.socket.on(EEvents.START_GAME, (firstFireUserId: string) => {
            this.setState(state => ({
                playingMode: Number(firstFireUserId === state.user.id),
                userStatus: EUserStatus.PLAYING
            }));
        });
    }

    render () {
        return (
            <Layout>
                {EUserStatus.ONLINE === this.state.userStatus && (
                    <WaitingRoomScreen
                        awaitingUsers={this.state.awaitingUsers}
                        onPlay={this.invitePlayer.bind(this)}
                    />
                )}
                {(
                    EUserStatus.FLEET_LOCATING_IN_PROGRESS === this.state.userStatus ||
                    EUserStatus.FLEET_LOCATING_COMPLETED === this.state.userStatus
                ) && (
                    <FleetLocatingScreen
                        onSubmit={this.submitFleetLocating.bind(this)}
                        submitted={this.state.userStatus === EUserStatus.FLEET_LOCATING_COMPLETED}
                    />
                )}
                {(EUserStatus.UNREGISTERED === this.state.userStatus) && (
                    <SignUpScreen
                        {...this.state.user}
                        onChangeUsername={this.setUsername.bind(this)}
                        onSelectAvatar={this.setAvatar.bind(this)}
                        onStartGame={this.submitUser.bind(this)}
                    />
                )}
                {EUserStatus.PLAYING === this.state.userStatus && (
                    <GameScreen
                        firedCoordinatesOfOpponent={this.state.firedCoordinatesOfOpponent}
                        firedCoordinatesOfUser={this.state.firedCoordinatesOfUser}
                        playingMode={this.state.playingMode as any}
                        userFleets={this.state.fleets}
                        opponentFleets={this.state.opponentFleets}
                        onFire={this.fireOpponent.bind(this)}
                    />
                )}
                {Boolean(this.state.notifications.length) && this.state.notifications.map((notification, index) => (
                    <Alert key={index} {...this.getNotificationData(notification)} />
                ))}
                <Modal
                    isVisible={this.state.isGameOver}
                    onClose={this.finishBattle.bind(this)}
                >
                    {this.state.isWinner ? 'WON' : 'LOST'}
                </Modal>
            </Layout>
        );
    }
}

export default App;
