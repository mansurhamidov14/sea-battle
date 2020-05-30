import React from 'react';

import { Avatar, Sea, Button } from '../../components';
import { EAvatarName, EViewType } from '../../enums';
import { IUser } from '../../models';
import { assets } from '../../assets';

import './styles.scss';

interface IProps extends IUser {
    onChangeUsername: (value: string) => void;
    onSelectAvatar: (avatar: EAvatarName) => void;
    onStartGame: () => void;
}

export const SignUpScreen: React.FC<IProps> = ({
    avatar,
    onChangeUsername,
    onSelectAvatar,
    onStartGame,
    username
}) => {
    return (
        <Sea>
            <div className="user">
                <div className="user__avatar">
                    <Avatar size={128} name={avatar} />
                </div>
                <div className="user__name">
                    <input
                        type="text"
                        value={username}
                        placeholder="Enter username"
                        onChange={e => onChangeUsername(e.target.value)}
                    />
                </div>
                <div className="user__avatars-list">
                    {Object.keys(assets.avatars).map((avatarName) => (
                        <div key={avatarName} className="user__avatars-list__item">
                            <Avatar
                                name={avatarName as any}
                                selected={avatarName === avatar}
                                size={96}
                                onClick={() => onSelectAvatar(avatarName as any)}
                            />
                        </div>
                    ))}
                </div>
                <Button
                    block
                    disabled={!username.length}
                    onClick={onStartGame}
                    view={EViewType.SUCCESS}
                    width="70%"
                >
                    Start Game
                </Button>
            </div>
        </Sea>
        
    )
} 