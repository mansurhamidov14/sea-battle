import React from 'react';

import {
    Sea, GameGrid, Fleet, OpponentFleet
} from '../../components';
import { EPlayingMode } from '../../enums';
import { IFleet, IOpponentFleet, ICoordinates } from '../../models';

interface IProps {
    onFire: (V: number, H: number) => void;
    opponentFleets: IOpponentFleet[];
    playingMode: EPlayingMode
    userFleets: IFleet[];
}

export const GameScreen: React.FC<IProps> = ({
    onFire,
    opponentFleets,
    playingMode,
    userFleets
}) => {
    const [firedCoordinates, setFiredCoordinates] = React.useState<ICoordinates[]>([]);

    const handleFire = React.useCallback(
        (V: number, H: number) => {
            onFire(V, H);
            setFiredCoordinates(state => [...state, { V, H }]);
        },
        [onFire]
    )

    if (playingMode === EPlayingMode.WATCHING) {
        return (
            <Sea>
                <GameGrid>
                    {userFleets.map(fleet => (
                        <Fleet key={fleet.id} coordinates={fleet.coordinates} />
                    ))}
                </GameGrid>
            </Sea>
        );
    } else {
        return (
            <GameGrid
                blackBordered
                onClickItem={handleFire}
                firedCoordinates={firedCoordinates}
            >
                {opponentFleets.map(fleet => (
                    <OpponentFleet key={fleet.id} {...fleet} />
                ))}
            </GameGrid>
        )
    }
}