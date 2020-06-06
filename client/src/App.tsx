import * as React from 'react';

import { Layout, GameOverModal } from './components';
import { EUserStatus } from './enums';
import { SocketHandler } from './handlers/Socket';
import { useGameplay } from './hooks';
import { IControlService, ControlService } from './services/Control';
import {
    FleetLocatingScreen,
    WaitingRoomScreen,
    GameScreen,
    SignUpScreen
} from './screens';

const App: React.FC = () => {
    const { userStatus, submitPlayerFleets } = useGameplay();
    const [controlService] = React.useState<IControlService>(new ControlService());
    controlService.init();

    return (
        <SocketHandler>
            <Layout>
                {EUserStatus.ONLINE === userStatus && (
                    <WaitingRoomScreen />
                )}
                {(
                    EUserStatus.FLEET_LOCATING_IN_PROGRESS === userStatus ||
                    EUserStatus.FLEET_LOCATING_COMPLETED === userStatus
                ) && (
                    <FleetLocatingScreen
                        onSubmit={submitPlayerFleets}
                        submitted={userStatus === EUserStatus.FLEET_LOCATING_COMPLETED}
                    />
                )}
                {(EUserStatus.UNREGISTERED === userStatus) && (
                    <SignUpScreen />
                )}
                {EUserStatus.PLAYING === userStatus && (
                    <GameScreen />
                )}
                <GameOverModal />
            </Layout>
        </SocketHandler>
        
    );
};

export default App;
