import React from 'react';

import { Avatar, Button, Sea } from '../../components';
import { EViewType, EViewSize } from '../../enums';
import { useGameplay } from '../../hooks';

import './styles.scss';

export const WaitingRoomScreen: React.FC = () => {
    const { awaitingUsers, toggleUserInvited } = useGameplay();

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
                                onClick={() => toggleUserInvited(user.id, true)}
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
