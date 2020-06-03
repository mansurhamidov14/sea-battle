import * as React from 'react';
import io from 'socket.io-client';

import { Alert, Layout, GameOverModal } from './components';
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
    lostTimes: number;
    notifications: INotification[];
    opponentFleets: IOpponentFleet[];
    user: IUser;
    opponent?: IUser;
    userStatus: EUserStatus;
    playingMode?: EPlayingMode;
    wonTimes: number;
}

const initailState: IAppState = {
    awaitingUsers: [],
    firedCoordinatesOfOpponent: [],
    firedCoordinatesOfUser: [],
    lostTimes: 0,
    notifications: [],
    userStatus: EUserStatus.UNREGISTERED,
    fleets: [],
    isGameOver: false,
    opponentFleets: [],
    user: {
        avatar: EAvatarName.BOY_1,
        username: '',
    },
    wonTimes: 0
}

class App extends React.Component<{}, IAppState> {
    socket: SocketIOClient.Socket;
    controlService: IControlService;

    constructor (props: {}) {
        super(props);
        this.state = initailState

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
        const { DECLINED_INVITATION } = ENotificationType;
        const [handleAccept, handleClose] = this.getNotificationActionsCallback(notification)
        const { username, type } = notification
        return {
            actions: handleAccept && handleClose ? [
                {
                    label: 'Decline',
                    onClick: handleClose
                },
                {
                    label: 'Accept',
                    onClick: handleAccept
                }
            ] : undefined,
            avatarName: notification.avatar,
            message: this.getNotificationMessage(type, username),
            title: this.getNotificationTitle(type),
            view: type === DECLINED_INVITATION ? EViewType.DANGER : EViewType.SUCCESS,
            onClose: handleClose
        }
    }

    getNotificationTitle (type: ENotificationType) {
        switch (type) {
            case ENotificationType.REVENGE_REQUESTED:
                return 'Revenge request';
            case ENotificationType.RECEIVED_INVITATION: 
                return 'You have got new invitation';
            case ENotificationType.DECLINED_INVITATION:
                return 'Your invitation has been declined';
        }
    }

    getNotificationMessage (type: ENotificationType, username?: string) {
        switch (type) {
            case ENotificationType.REVENGE_REQUESTED:
                return `${username} wants to play again`;
            case ENotificationType.RECEIVED_INVITATION: 
                return `${username} wants to play with you`;
            case ENotificationType.DECLINED_INVITATION:
                return `${username} has declined your invitation`;
        }
    }

    getNotificationActionsCallback (notification: INotification): ((() => void) | undefined)[] {
        let acceptCallback: (() => void) | undefined;
        let closeCallback: (() => void) | undefined;
        switch (notification.type) {
            case ENotificationType.REVENGE_REQUESTED:
                acceptCallback = () => this.requestRevenge();
                closeCallback = () => this.finishBattle();
                break;
            case ENotificationType.RECEIVED_INVITATION:
                acceptCallback = () => {
                    this.reactToInvitation(notification.id as string, EEvents.ACCEPT_INVITATION);
                    this.setState({ opponent: notification });
                };
                closeCallback = () => this.reactToInvitation(notification.id as string, EEvents.DECLINE_INVITATION);
                break;
            case ENotificationType.DECLINED_INVITATION:
            default:
        }
        return [acceptCallback, closeCallback]
    }

    removeNotification (notification: INotification) {
        this.setState(state => ({
            notifications: state.notifications.filter(({ id, type }) => !(notification.type === type && notification.id === id))
        }));
    }

    reactToInvitation (userId: string, reaction: EEvents.ACCEPT_INVITATION | EEvents.DECLINE_INVITATION) {
        this.setState(state => ({
            notifications: state.notifications.filter(({ id, type }) => !(id === userId && (type === ENotificationType.RECEIVED_INVITATION || type === ENotificationType.REVENGE_REQUESTED))),
        }));
        this.socket.emit(reaction, userId);
    }

    invitePlayer (player: IAwaitingUser) {
        this.socket.emit(EEvents.SEND_INVITATION, player.id);
        this.setState(state => ({
            awaitingUsers: state.awaitingUsers.map(user => ({
                ...user,
                hasBeenInvited: user.id === player.id || user.hasBeenInvited
            })),
            opponent: player
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
                    isWinner: isGameOver ? true : undefined,
                    wonTimes: isGameOver ? this.state.wonTimes + 1 : this.state.wonTimes
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

    requestRevenge () {
        this.socket.emit(EEvents.REVENGE_REQUESTED);
    }

    componentDidMount () {
        this.controlService.init();
        this.socket.on(EEvents.GET_AWAITING_USERS_LIST, (users: IAwaitingUser[]) => {
            this.setState({
                awaitingUsers: users.filter(({ id }) => id !== this.state.user.id)
            });
        });
        this.socket.on(EEvents.SEND_INVITATION, (invitation: IUser) => {
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
                    isWinner: isGameOver ? false : undefined,
                    lostTimes: isGameOver ? state.lostTimes + 1 : state.lostTimes
                }));
            }
        );
        this.socket.on(EEvents.DECLINE_INVITATION, (rejectedUser: IAwaitingUser) => {
            this.setState(state => ({
                awaitingUsers: state.awaitingUsers.map(user => ({
                    ...user,
                    hasBeenInvited: user.id === rejectedUser.id ? false : user.hasBeenInvited,
                })),
                notifications: [
                    ...state.notifications,
                    { ...rejectedUser, type: ENotificationType.DECLINED_INVITATION }
                ],
                opponent: undefined
            }));
        });
        this.socket.on(EEvents.START_FLEETS_LOCATING, () => {
            this.setState({
                userStatus: EUserStatus.FLEET_LOCATING_IN_PROGRESS,
                fleets: [],
                opponentFleets: [],
                firedCoordinatesOfOpponent: [],
                firedCoordinatesOfUser: [],
                isGameOver: false,
                notifications: [],
            });
        });
        this.socket.on(EEvents.START_GAME, (firstFireUserId: string) => {
            this.setState(state => ({
                playingMode: Number(firstFireUserId === state.user.id),
                userStatus: EUserStatus.PLAYING
            }));
        });
        this.socket.on(EEvents.OPPONENT_REVENGE_REFUSAL, () => {
            window.dispatchEvent(new CustomEvent(EEvents.OPPONENT_REVENGE_REFUSAL));
        });
        this.socket.on(EEvents.REVENGE_REQUESTED, () => {
            this.setState(state => ({
                notifications: [
                    ...state.notifications,
                    { ...state.opponent as IUser, type: ENotificationType.REVENGE_REQUESTED }
                ]
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
                <GameOverModal
                    isVisible={this.state.isGameOver}
                    onFinishGame={this.finishBattle.bind(this)}
                    onRevengeRequest={this.requestRevenge.bind(this)}
                    user={this.state.user}
                    opponent={this.state.opponent as any}
                    isWinner={this.state.isWinner}
                    wonTimes={this.state.wonTimes}
                    lostTimes={this.state.lostTimes}
                />
            </Layout>
        );
    }
}

export default App;
