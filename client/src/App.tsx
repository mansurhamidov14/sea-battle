import * as React from 'react';
import io from 'socket.io-client';

import { Alert, Layout } from './components';
import { IAlertProps } from './components/Alert';
import {
    EAvatarName,
    EEvents,
    EUserStatus,
    ENotificationType,
    EViewType
} from './enums';
import {
    IAwaitingUser,
    IFleetCoordinates,
    INotification,
    IOpponentFleet,
    IUser,
} from './models';
import { ControlService, IControlService } from './services/Controls';
import { FleetLocatingScreen, WaitingRoomScreen } from './screens';
import { SignUpScreen } from './screens/SignUp';

interface IAppState {
    awaitingUsers: IAwaitingUser[];
    fleets: IFleetCoordinates[];
    notifications: INotification[];
    opponentFleets: IOpponentFleet[];
    user: IUser;
    userStatus: EUserStatus,
}

class App extends React.Component<{}, IAppState> {
    socket: SocketIOClient.Socket;
    controlService: IControlService;

    constructor (props: {}) {
        super(props);
        this.state = {
            awaitingUsers: [],
            notifications: [],
            userStatus: EUserStatus.UNREGISTERED,
            fleets: [],
            opponentFleets: [],
            user: {
                avatar: EAvatarName.BOY_1,
                username: '',
            }
        }

        const socketUrl = 'http://192.168.1.108:8080';
        this.socket = io(socketUrl);
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
            (userId: string) => this.setState(state =>({
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
            view: type === DECLINED_INVITATION ? EViewType.DANGER : EViewType.SECONDARY,
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
        }))
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
            this.setState({ userStatus: EUserStatus.FLEET_LOCATING_IN_PROGRESS});
        })
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
                {EUserStatus.FLEET_LOCATING_IN_PROGRESS === this.state.userStatus && (
                    <FleetLocatingScreen />
                )}
                {(EUserStatus.UNREGISTERED === this.state.userStatus) && (
                    <SignUpScreen
                        {...this.state.user}
                        onChangeUsername={this.setUsername.bind(this)}
                        onSelectAvatar={this.setAvatar.bind(this)}
                        onStartGame={this.submitUser.bind(this)}
                    />
                )}
                {Boolean(this.state.notifications.length) && this.state.notifications.map((notification, index) => (
                    <Alert key={index} {...this.getNotificationData(notification)} />
                ))}
            </Layout>
        );
    }
}

export default App;
