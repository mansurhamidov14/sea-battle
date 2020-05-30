import * as React from 'react';
import io from 'socket.io-client';

import { Layout } from './components';
import { EUserStatus, EAvatarName } from './enums';
import { IOpponentFleet, IFleetCoordinates, IUser } from './models';
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
            userStatus: EUserStatus.SIGN_UP,
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
                {EUserStatus.SIGN_UP && (
                    <SignUpScreen
                        {...this.state.user}
                        onChangeUsername={this.setUsername.bind(this)}
                        onSelectAvatar={this.setAvatar.bind(this)}
                        onStartGame={console.log}
                    />
                )}
            </Layout>
        );
    }
}

export default App;
