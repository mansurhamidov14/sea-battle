import * as React from 'react';
import {
    GameGrid,
    Layout,
    Sea,
    Fleet,
    OpponentFleet,
} from './components';

function App() {
    return (
        <Layout>
            <Sea>
                <GameGrid
                    blackBordered
                    firedCoordinates={[
                        {H: 1, V: 8},
                        {H: 2, V: 6},
                        {H: 3, V: 7},
                    ]}
                    onClickItem={console.log}
                >
                    <Fleet
                        coordinates={[
                            {H: 1, V: 2, wasFired: true},
                            {H: 2, V: 2, wasFired: true},
                            {H: 3, V: 2, wasFired: true},
                            {H: 4, V: 2, wasFired: true},
                        ]}
                    />
                    <Fleet
                        coordinates={[
                            {H: 7, V: 4, wasFired: false},
                            {H: 7, V: 5, wasFired: false},
                            {H: 7, V: 6, wasFired: true},
                        ]}
                    />
                    <Fleet
                        coordinates={[
                            {H: 3, V: 9, wasFired: false},
                            {H: 4, V: 9, wasFired: true},
                            {H: 5, V: 9, wasFired: true},
                        ]}
                    />
                    <Fleet
                        coordinates={[
                            {H: 9, V: 9, wasFired: false},
                            {H: 9, V: 10, wasFired: false},
                        ]}
                    />
                    <Fleet
                        coordinates={[
                            {H: 2, V: 7, wasFired: true},
                        ]}
                    />
                    <Fleet
                        coordinates={[
                            {H: 9, V: 2, wasFired: true},
                            {H: 9, V: 3, wasFired: true},
                            {H: 9, V: 4, wasFired: true},
                            {H: 9, V: 5, wasFired: false},
                            {H: 9, V: 6, wasFired: false},
                        ]}
                    />
                    <OpponentFleet
                        wasDestroyed
                        coordinates={[
                            {H: 8, V: 2},
                            {H: 8, V: 3},
                            {H: 8, V: 4},
                            {H: 8, V: 5},
                            {H: 8, V: 6},
                        ]}
                    />
                </GameGrid>
            </Sea>
        </Layout>
    );
}

export default App;
