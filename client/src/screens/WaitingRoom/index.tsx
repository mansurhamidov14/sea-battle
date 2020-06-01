import React from 'react';

import { Avatar, Button, Sea } from '../../components';
import { EViewType, EViewSize } from '../../enums';
import { IAwaitingUser } from '../../models';

import './styles.scss';

interface IProps {
    awaitingUsers: IAwaitingUser[];
    onPlay: (player: IAwaitingUser) => void;
}

export const WaitingRoomScreen: React.FC<IProps> = ({
    awaitingUsers,
    onPlay
}) => (
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
                            onClick={() => onPlay(user)}
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
