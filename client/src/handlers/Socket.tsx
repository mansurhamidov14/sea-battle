import React from 'react';

import { EEvents, EViewType, EUserStatus  } from '../enums';
import {
    useGameplay,
    useNotifications,
    usePlayer,
    useSocket,
} from '../hooks';
import {
    IAwaitingUser,
    ICoordinates,
    IFleet,
    INotification,
    IUser,
} from '../models';

interface IProps {
    getFireResultByOpponent: (firedFleetId: number | null, fleets: IFleet[], coordinates: ICoordinates, gameOver: boolean) => void;
    opponent: IUser | undefined;
    player: IUser;
    pushNotification: (notification: INotification) => void;
    setAwaitingUsers: (users: IAwaitingUser[]) => void;
    setOpponent: (player: IUser) => void;
    setUserStatus: (status: EUserStatus) => void;
    startNewGame: () => void;
    socket: SocketIOClient.Socket;
    toggleFiring: (isFiring: boolean) => void;
}

class SocketHandlerDumb extends React.Component<IProps> {
    componentDidUpdate () {
        const {
            getFireResultByOpponent,
            opponent,
            player,
            pushNotification,
            setAwaitingUsers,
            setOpponent,
            setUserStatus,
            socket,
            startNewGame,
            toggleFiring,
        } = this.props;
        socket.off(EEvents.GET_AWAITING_USERS_LIST);
        socket.off(EEvents.REVENGE_REQUESTED);
        socket.off(EEvents.SEND_INVITATION);
        socket.off(EEvents.DECLINE_INVITATION);
        socket.off(EEvents.REVENGE_REQUESTED);
        socket.off(EEvents.FIRE);
        socket.off(EEvents.START_FLEETS_LOCATING);
        socket.off(EEvents.START_GAME);
        socket.off(EEvents.OPPONENT_REVENGE_REFUSAL);

        socket.on(EEvents.GET_AWAITING_USERS_LIST, (players: IAwaitingUser[]) => {
            setAwaitingUsers(players.filter(({ id }) => id !== player.id));
        });

        socket.on(EEvents.SEND_INVITATION, (invitation: IUser) => {
            pushNotification({
                view: EViewType.SUCCESS,
                title: 'You have got new invitation',
                message: `${invitation.username} wants to play with you`,
                accept: {
                    label: 'Accept',
                    onClick: () => {
                        socket.emit(EEvents.ACCEPT_INVITATION, invitation.id);
                        setOpponent(invitation);
                    }
                },
                decline: {
                    label: 'Decline',
                    onClick: () => socket.emit(EEvents.DECLINE_INVITATION, invitation.id)
                }
            });
        });

        socket.on(EEvents.DECLINE_INVITATION, (rejectedUser: IAwaitingUser) => {
            pushNotification({
                view: EViewType.DANGER,
                title: 'Your invitation has been declined',
                message: `${rejectedUser.username} has declined your invitation`
            });
        });

        socket.on(EEvents.REVENGE_REQUESTED, () => {
            pushNotification({
                title: 'Revenge request',
                message: `${opponent?.username} wants to play again`,
                view: EViewType.SUCCESS
            });
        });

        socket.on(EEvents.FIRE, (firedId: number | null, fleets: IFleet[], coords: ICoordinates, gameOver: boolean) => {
            getFireResultByOpponent(firedId, fleets, coords, gameOver);
        });

        socket.on(EEvents.START_FLEETS_LOCATING, () => {
            startNewGame();
        });

        socket.on(EEvents.START_GAME, (firstFireUserId: string) => {
            setUserStatus(EUserStatus.PLAYING);
            toggleFiring(firstFireUserId === player.id);
        });

        socket.on(EEvents.OPPONENT_REVENGE_REFUSAL, () => {
            window.dispatchEvent(new CustomEvent(EEvents.OPPONENT_REVENGE_REFUSAL));
        });
    }

    render () {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}

export const SocketHandler: React.FC = ({ children }) => {
    const socket = useSocket();
    const { pushNotification } = useNotifications();
    const { player } = usePlayer();
    const {
        getFireResultByOpponent,
        opponent,
        setAwaitingUsers,
        setOpponent,
        setUserStatus,
        startNewGame,
        toggleFiring,
    } = useGameplay();

    return (
        <SocketHandlerDumb
            getFireResultByOpponent={getFireResultByOpponent}
            opponent={opponent}
            player={player}
            pushNotification={pushNotification}
            setAwaitingUsers={setAwaitingUsers}
            setOpponent={setOpponent}
            setUserStatus={setUserStatus}
            socket={socket}
            startNewGame={startNewGame}
            toggleFiring={toggleFiring}
        >
            {children}
        </SocketHandlerDumb>
    );
};

SocketHandler.displayName = 'SocketHandler';
