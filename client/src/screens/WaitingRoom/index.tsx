import React from 'react';

import { Avatar, Button, Sea } from '../../components';
import { EEvents, EViewType, EViewSize } from '../../enums';
import { useGameplay, useSocket } from '../../hooks';
import { IAwaitingUser } from '../../models';

import './styles.scss';

export const WaitingRoomScreen: React.FC = () => {
    const socket = useSocket();
    const { awaitingUsers, toggleUserInvited, setOpponent } = useGameplay();

    const invitePlayer = (player: IAwaitingUser) => {
        socket.emit(EEvents.SEND_INVITATION, player.id);
        toggleUserInvited(player.id, true);
        setOpponent(player);
    };

    return (
        <Sea>
            <div className="waiting-room">
                {awaitingUsers.map(user => (
                    <div className="waiting-room__item" key={user.id}>
                        <div className="waiting-room__item__inner">
                            <div className="waiting-room__item__inner__username">
                                {user.username}
                            </div>
                            <Avatar size={96} name={user.avatar} />
                            <Button
                                disabled={user.hasBeenInvited}
                                onClick={() => invitePlayer(user)}
                                view={user.hasBeenInvited ? EViewType.SECONDARY : EViewType.PRIMARY}
                                size={EViewSize.SM}
                            >
                                {user.hasBeenInvited ? 'Invited' : 'Play'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Sea>
    );  
};
