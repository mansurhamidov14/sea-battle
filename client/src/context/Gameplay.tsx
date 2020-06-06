import React from 'react';

import { useSocket } from '../hooks';
import {
    EEvents,
    EPlayingMode,
    EUserStatus,
} from '../enums';
import {
    IAwaitingUser,
    ICoordinates,
    IFleet,
    IOpponentFleet,
    IScore,
    IUser
} from '../models';
import {
    initialAwaitingUsers,
    initialFiredCoordinates,
    initialOpponent,
    initialOpponentFleets,
    initialPlayerFleets,
    initialScore,
    initialUserStatus,
} from './consts';

export interface IGameplayContext {
    awaitingUsers: IAwaitingUser[];
    firedCoordinatesOfOpponent: ICoordinates[];
    firedCoordinatesOfPlayer: ICoordinates[];
    playerFleets: IFleet[];
    isGameOver: boolean;
    isWinner?: boolean;
    opponent?: IUser;
    opponentFleets: IOpponentFleet[];
    userStatus: EUserStatus;
    playingMode?: EPlayingMode;
    score: IScore;
    
    /** methods */
    setAwaitingUsers: (users: IAwaitingUser[]) => void;
    toggleUserInvited: (userId: string, invited: boolean) => void;
    fireOpponent: (V: number, H: number) => void;
    finishBattle: () => void;
    getFireResultByOpponent: (firedFleetId: number | null, fleets: IFleet[], coordinates: ICoordinates, gameOver: boolean) => void;
    toggleFiring: (isFiring: boolean) => void;
    setOpponent: (player: IUser) => void;
    requestRevenge: () => void;
    setPlayerFleets: (fleets: IFleet[]) => void;
    submitPlayerFleets: (fleets: IFleet[]) => void;
    setUserStatus: (status: EUserStatus) => void;
    startNewGame: () => void;
    startRevengeBattle: () => void;
}

export const GameplayContext = React.createContext<IGameplayContext>({
    awaitingUsers: null as any,
    firedCoordinatesOfOpponent: null as any,
    firedCoordinatesOfPlayer: null as any,
    playerFleets: null as any,
    isGameOver: null as any,
    isWinner: null as any,
    opponentFleets: null as any,
    userStatus: null as any,
    playingMode: null as any,
    score: null as any,

    /** methods */
    setAwaitingUsers: null as any,
    toggleUserInvited: null as any,
    fireOpponent: null as any,
    finishBattle: null as any,
    getFireResultByOpponent: null as any,
    setOpponent: null as any,
    toggleFiring: null as any,
    requestRevenge: null as any,
    setUserStatus: null as any,
    startNewGame: null as any,
    startRevengeBattle: null as any,
    setPlayerFleets: null as any,
    submitPlayerFleets: null as any
});

export const GameplayProvider: React.FC = ({
    children
}) => {
    const socket = useSocket();
    const [awaitingUsers, setAwaitingUsers] = React.useState<IAwaitingUser[]>(initialAwaitingUsers);
    const [firedCoordinatesOfPlayer, setFiredCoordinatesOfPlayer] = React.useState<ICoordinates[]>(initialFiredCoordinates);
    const [firedCoordinatesOfOpponent, setFiredCoordinatesOfOpponent] = React.useState<ICoordinates[]>(initialFiredCoordinates);
    const [playerFleets, setPlayerFleets] = React.useState<IFleet[]>(initialPlayerFleets);
    const [opponentFleets, setFiredOpponentFleets] = React.useState<IOpponentFleet[]>(initialOpponentFleets);
    const [isGameOver, setGameOver] = React.useState<boolean>(false);
    const [isWinner, setWinning] = React.useState<boolean | undefined>();
    const [score, setScore] = React.useState<IScore>(initialScore);
    const [playingMode, setPlayingMode] = React.useState<EPlayingMode>(EPlayingMode.WATCHING);
    const [userStatus, setUserStatus] = React.useState<EUserStatus>(initialUserStatus);
    const [opponent, setOpponentData] = React.useState<IUser | undefined>(initialOpponent);

    const toggleUserInvited = (userId: string, hasBeenInvited: boolean) => {
        setAwaitingUsers(state => {
            return state.map(_player => {
                if (_player.id === userId) {
                    return {
                        ..._player,
                        hasBeenInvited
                    };
                }
                return _player
            })
        }); 
    };

    const setOpponent = (player: IUser) => setOpponentData(player);

    const toggleFiring = (isFiring: boolean) => setPlayingMode(isFiring ? EPlayingMode.FIRING : EPlayingMode.WATCHING);

    const getFireResultByPlayer = (
        coordinates: ICoordinates,
        firedFleetId: number | null,
        wasDestroyed: boolean,
        gameOver: boolean
    ) => {
        toggleFiring(Boolean(firedFleetId));
        if (firedFleetId) {
            setFiredOpponentFleets(state => state.map(
                fleet => {
                    if (fleet.id === firedFleetId) {
                        return {
                            ...fleet,
                            wasDestroyed,
                            coordinates: [...fleet.coordinates, coordinates]
                        };
                    }
                    return fleet;
                }
            ));
            setGameOver(gameOver);
            setWinning(gameOver || undefined);
            setScore(state => ({ ...state, won: state.won + Number(gameOver) }));
        } else {
            setFiredCoordinatesOfOpponent(state => [...state, coordinates]);
        }
    };

    const getFireResultByOpponent = (
        firedFleetId: number | null,
        updatedFleets: IFleet[],
        coordinates: ICoordinates,
        gameOver: boolean
    ) => {
        toggleFiring(!firedFleetId);
        setPlayerFleets(state => firedFleetId ? updatedFleets : state);
        setWinning(gameOver ? false : undefined);
        setScore(state => ({ ...state, lost: state.lost + Number(gameOver) }));
        if (!firedFleetId) {
            setFiredCoordinatesOfPlayer(state => [...state, coordinates]);
        }
    };

    const fireOpponent = (V: number, H: number) => {
        socket.emit(EEvents.FIRE, { V, H }, getFireResultByPlayer);
    } 

    const submitPlayerFleets = (fleets: IFleet[]) => {
        socket.emit(EEvents.COMPLETE_FLEETS_LOCATING, fleets, () => {
            setPlayerFleets(fleets);
            setUserStatus(EUserStatus.FLEET_LOCATING_COMPLETED);
        });
    };

    const startNewGame = () => {
        setFiredCoordinatesOfOpponent(initialFiredCoordinates);
        setFiredCoordinatesOfPlayer(initialFiredCoordinates);
        setUserStatus(EUserStatus.FLEET_LOCATING_IN_PROGRESS);
        setPlayerFleets(initialPlayerFleets);
        setFiredOpponentFleets(initialOpponentFleets);
    };

    const startRevengeBattle = () => {
        setFiredCoordinatesOfOpponent(initialFiredCoordinates);
        setFiredCoordinatesOfPlayer(initialFiredCoordinates);
        setUserStatus(EUserStatus.FLEET_LOCATING_IN_PROGRESS);
        setPlayerFleets(initialPlayerFleets);
        setFiredOpponentFleets(initialOpponentFleets);
    };

    const finishBattle = () => {
        socket.emit(EEvents.FINISH_BATTLE, () => {
            setUserStatus(EUserStatus.ONLINE);
            setOpponentData(initialOpponent);
            setScore(initialScore);
        });
    };

    const requestRevenge = () => {
        socket.emit(EEvents.REVENGE_REQUESTED);
    };

    return (
        <GameplayContext.Provider value={{
            awaitingUsers,
            score,
            opponentFleets,
            setAwaitingUsers,
            toggleUserInvited,
            firedCoordinatesOfOpponent,
            fireOpponent,
            getFireResultByOpponent,
            toggleFiring,
            playingMode,
            isGameOver,
            isWinner,
            playerFleets,
            firedCoordinatesOfPlayer,
            userStatus,
            requestRevenge,
            setUserStatus,
            startNewGame,
            startRevengeBattle,
            setPlayerFleets,
            opponent,
            finishBattle,
            setOpponent,
            submitPlayerFleets
        }}>
            {children}
        </GameplayContext.Provider>
    );
};

GameplayProvider.displayName = 'GameplayProvider';
