import React from 'react';

import {
    Sea, GameGrid, Fleet, OpponentFleet
} from '../../components';
import { EPlayingMode } from '../../enums';
import { IFleet, IOpponentFleet, ICoordinates } from '../../models';

interface IProps {
    firedCoordinatesOfOpponent: ICoordinates[];
    firedCoordinatesOfUser: ICoordinates[];
    onFire: (V: number, H: number) => void;
    opponentFleets: IOpponentFleet[];
    playingMode: EPlayingMode
    userFleets: IFleet[];
}

export const GameScreen: React.FC<IProps> = ({
    firedCoordinatesOfOpponent,
    firedCoordinatesOfUser,
    onFire,
    opponentFleets,
    playingMode,
    userFleets
}) => {
    if (playingMode === EPlayingMode.WATCHING) {
        return (
            <Sea>
                <GameGrid firedCoordinates={firedCoordinatesOfUser}>
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
                onClickItem={onFire}
                firedCoordinates={firedCoordinatesOfOpponent}
            >
                {opponentFleets.map(fleet => (
                    <OpponentFleet key={fleet.id} {...fleet} />
                ))}
            </GameGrid>
        );
    }
}