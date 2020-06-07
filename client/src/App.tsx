import * as React from 'react';

import { Layout, GameOverModal } from './components';
import { EUserStatus } from './enums';
import { SocketHandler } from './handlers/Socket';
import { useGameplay } from './hooks';
import { ControlService, IControlService } from './services/Control';
import {
    FleetLocatingScreen,
    GameScreen,
    SignUpScreen,
    WaitingRoomScreen,
} from './screens';

const App: React.FC = () => {
    const { userStatus, submitPlayerFleets } = useGameplay();
    const [controlService] = React.useState<IControlService>(new ControlService());
    const { FLEET_LOCATING_COMPLETED, FLEET_LOCATING_IN_PROGRESS, ONLINE, PLAYING, UNREGISTERED } = EUserStatus;
    controlService.init();

    return (
        <SocketHandler>
            <Layout>
                {ONLINE === userStatus && <WaitingRoomScreen />}
                {[FLEET_LOCATING_IN_PROGRESS, FLEET_LOCATING_COMPLETED].includes(userStatus) && (
                    <FleetLocatingScreen
                        onSubmit={submitPlayerFleets}
                        submitted={userStatus === EUserStatus.FLEET_LOCATING_COMPLETED}
                    />
                )}
                {UNREGISTERED === userStatus && <SignUpScreen />}
                {PLAYING === userStatus && <GameScreen />}
                <GameOverModal />
            </Layout>
        </SocketHandler>
        
    );
};

export default App;
