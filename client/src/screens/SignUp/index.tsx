import React from 'react';

import { assets } from '../../assets';
import { Avatar, Button, Sea } from '../../components';
import { EViewType } from '../../enums';
import { usePlayer } from '../../hooks';

import './styles.scss';

export const SignUpScreen: React.FC = () => {
    const {
        createPlayer,
        player,
        setPlayerAvatar,
        setPlayerName,
    } = usePlayer();

    return (
        <Sea>
            <div className="user">
                <div className="user__avatar">
                    <Avatar size={128} name={player.avatar} />
                </div>
                <div className="user__name">
                    <input
                        type="text"
                        value={player.username}
                        placeholder="Enter username"
                        onChange={e => setPlayerName(e.target.value)}
                    />
                </div>
                <div className="user__avatars-list">
                    {Object.keys(assets.avatars).map((avatarName) => (
                        <div key={avatarName} className="user__avatars-list__item">
                            <Avatar
                                name={avatarName as any}
                                selected={avatarName === player.avatar}
                                size={96}
                                onClick={() => setPlayerAvatar(avatarName as any)}
                            />
                        </div>
                    ))}
                </div>
                <Button
                    block
                    disabled={!player.username}
                    onClick={createPlayer}
                    view={EViewType.SUCCESS}
                    width="70%"
                >
                    Start Game
                </Button>
            </div>
        </Sea>
        
    )
} 