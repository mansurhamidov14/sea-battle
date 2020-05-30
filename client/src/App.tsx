import * as React from 'react';
import io from 'socket.io-client';

import { Layout } from './components';
import {
    EAvatarName,
    EEvents,
    EUserStatus
} from './enums';
import {
    IFleetCoordinates,
    IOpponentFleet,
    IUser
} from './models';
import { ControlService, IControlService } from './services/Controls';
import { HomeScreen, FleetLocatingScreen } from './screens';
import { SignUpScreen } from './screens/SignUp';

interface IAppState {
    userStatus: EUserStatus,
    fleets: IFleetCoordinates[]
    opponentFleets: IOpponentFleet[];
    user: IUser;
}

class App extends React.Component<{}, IAppState> {
    socket: SocketIOClient.Socket;
    controlService: IControlService;

    constructor (props: {}) {
        super(props);
        this.state = {
            userStatus: EUserStatus.UNREGISTERED,
            fleets: [],
            opponentFleets: [],
            user: {
                avatar: EAvatarName.BOY_1,
                username: '',
            }
        }

        const socketUrl = 'http://192.168.1.106:8080';
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
            () => this.setState({ userStatus: EUserStatus.ONLINE })
        )
    }

    componentDidMount () {
        this.controlService.init();
    }

    render () {
        return (
            <Layout>
                {EUserStatus.ONLINE === this.state.userStatus && (
                    <HomeScreen onStartGame={() => console.log('playing')} />
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
            </Layout>
        );
    }
}

export default App;
