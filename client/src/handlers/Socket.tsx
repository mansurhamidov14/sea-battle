import React from 'react';

import { EEvents, EViewType, EUserStatus  } from '../enums';
import {
    useGameplay,
    useNotifications,
    usePlayer,
    useSocket,
} from '../hooks';
import { IAwaitingUser, IUser, IFleet, ICoordinates } from '../models';

export const SocketHandler: React.FC = ({ children }) => {
    const socket = useSocket();
    const { pushNotification } = useNotifications();
    const { player } = usePlayer();
    const {
        opponent,
        setAwaitingUsers,
        getFireResultByOpponent,
        startNewGame,
        setUserStatus,
        toggleFiring
    } = useGameplay();

    React.useEffect(
        () => {
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
                        onClick: () => socket.emit(EEvents.ACCEPT_INVITATION, invitation.id)
                    },
                    decline: {
                        label: 'Decline',
                        onClick: () => socket.emit(EEvents.DECLINE_INVITATION, invitation.id)
                    }
                });
            });

            socket.on(EEvents.FIRE, (firedId: number | null, fleets: IFleet[], coords: ICoordinates, gameOver: boolean) => {
                getFireResultByOpponent(firedId, fleets, coords, gameOver)
            });

            socket.on(EEvents.DECLINE_INVITATION, (rejectedUser: IAwaitingUser) => {
                pushNotification({
                    view: EViewType.DANGER,
                    title: 'Your invitation has been declined',
                    message: `${rejectedUser.username} has declined your invitation`
                });
            });

            socket.on(EEvents.START_FLEETS_LOCATING, () => {
                startNewGame();
            });

            socket.on(EEvents.START_GAME, (firstFireUserId: string) => {
                setUserStatus(EUserStatus.ONLINE);
                toggleFiring(firstFireUserId === player.id);
            });

            socket.on(EEvents.OPPONENT_REVENGE_REFUSAL, () => {
                window.dispatchEvent(new CustomEvent(EEvents.OPPONENT_REVENGE_REFUSAL));
            });

            socket.on(EEvents.REVENGE_REQUESTED, () => {
                pushNotification({
                    title: 'Revenge request',
                    message: `${opponent?.username} wants to play again`,
                    view: EViewType.SUCCESS
                });
            });
        },
        [player.id, socket, startNewGame, setAwaitingUsers, pushNotification, opponent, getFireResultByOpponent, toggleFiring, setUserStatus]
    );

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
};

SocketHandler.displayName = 'SocketHandler';
