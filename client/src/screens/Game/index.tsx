import React from 'react';

import {
    Fleet,
    GameGrid,
    OpponentFleet,
    Sea,
} from '../../components';
import { EPlayingMode } from '../../enums';
import { useGameplay } from '../../hooks';

export const GameScreen: React.FC = () => {
    const {
        playerFleets,
        opponentFleets,
        fireOpponent,
        playingMode,
        firedCoordinatesOfOpponent,
        firedCoordinatesOfPlayer
    } = useGameplay();

    if (playingMode === EPlayingMode.WATCHING) {
        return (
            <Sea>
                <GameGrid firedCoordinates={firedCoordinatesOfPlayer}>
                    {playerFleets.map(fleet => (
                        <Fleet key={fleet.id} coordinates={fleet.coordinates} />
                    ))}
                </GameGrid>
            </Sea>
        );
    } else {
        return (
            <GameGrid
                blackBordered
                onClickItem={fireOpponent}
                firedCoordinates={firedCoordinatesOfOpponent}
            >
                {opponentFleets.map(fleet => (
                    <OpponentFleet key={fleet.id} {...fleet} />
                ))}
            </GameGrid>
        );
    }
}