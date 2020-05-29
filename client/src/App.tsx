import * as React from 'react';
import io from 'socket.io-client';

import { Layout } from './components';
import { EUserStatus } from './enums';
import { IOpponentFleet, IFleetCoordinates } from './models';
import { ControlService, IControlService } from './services/Controls';
import { HomeScreen, FleetLocatingScreen } from './screens';

interface IAppState {
    userStatus: EUserStatus,
    fleets: IFleetCoordinates[]
    opponentFleets: IOpponentFleet[];
}

class App extends React.Component<{}, IAppState> {
    socket: SocketIOClient.Socket;
    controlService: IControlService;

    constructor (props: {}) {
        super(props);
        this.state = {
            userStatus: EUserStatus.FLEET_LOCATING_IN_PROGRESS,
            fleets: [],
            opponentFleets: []
        }

        const socketUrl = 'http://192.168.1.108:8080';
        this.socket = io(socketUrl);
        this.controlService = new ControlService();
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
            </Layout>
        );
    }
}

export default App;
