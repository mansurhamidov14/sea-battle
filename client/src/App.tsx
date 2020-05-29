import * as React from 'react';
import io from 'socket.io-client';

import {
    Layout,
} from './components';
import { EUserStatus } from './enums';
import { IOpponentFleet, IFleetCoordinates } from './models';
import { HomeScreen } from './screens';

interface IAppState {
    userStatus: EUserStatus,
    fleets: IFleetCoordinates[]
    opponentFleets: IOpponentFleet[];
}

class App extends React.Component<{}, IAppState> {
    socket: SocketIOClient.Socket;

    constructor (props: {}) {
        super(props);
        this.state = {
            userStatus: EUserStatus.ONLINE,
            fleets: [],
            opponentFleets: []
        }

        const socketUrl = 'http://192.168.1.108:8080';
        this.socket = io(socketUrl);
    }

    render () {
        return (
            <Layout>
                {EUserStatus.ONLINE === this.state.userStatus && (
                    <HomeScreen onStartGame={() => console.log('playing')} />
                )}
            </Layout>
        );
    }
}

export default App;
