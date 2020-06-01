import React from 'react';

import { EViewType, EViewSize } from '../../enums';
import { IUser } from '../../models';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Modal } from '../Modal';

import './styles.scss';

interface IProps {
    isVisible: boolean;
    isWinner?: boolean;
    lostTimes: number;
    onFinishGame?: () => void;
    onRevengeRequest?: () => void;
    opponent?: IUser;
    user: IUser;
    wonTimes: number;
}

export const GameOverModal: React.FC<IProps> = ({
    isVisible,
    isWinner,
    lostTimes,
    onFinishGame,
    onRevengeRequest,
    opponent,
    user,
    wonTimes
}) => {
    const { SUCCESS, DANGER, SECONDARY } = EViewType;
    const scoreView =
        wonTimes > lostTimes ?
            SUCCESS :
        wonTimes < lostTimes ?
            DANGER :
            SECONDARY;
    return (
        <Modal isVisible={isVisible} onClose={onFinishGame} height="max-content">
            <div className="game-over-modal">
                <div className={`game-over-modal__result game-over-modal__result--${isWinner ? 'winner' : 'loser'}`}>
                    {isWinner ? 'VICTORY!' : 'DEFEAT'}
                </div>
                <div className="game-over-modal__content">
                    <div className="game-over-modal__content__user">
                        <Avatar name={user.avatar} size={128} />
                        <div className="game-over-modal__content__user__name">
                            {user.username}
                        </div>
                    </div>
                    <div className={`game-over-modal__content__score game-over-modal__content__score--${scoreView}`}>
                        {wonTimes} - {lostTimes}
                    </div>
                    <div className="game-over-modal__content__user">
                        {opponent && (
                            <>
                                <Avatar name={opponent.avatar} size={128} />
                                <div className="game-over-modal__content__user__name">
                                    {opponent.username}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="game-over-modal__actions">
                    <Button
                        block
                        view={EViewType.PRIMARY}
                        onClick={onRevengeRequest}
                        size={EViewSize.MD}
                        width="45%"
                    >
                        Play Revenge
                    </Button>
                    <Button
                        block
                        view={EViewType.DANGER}
                        onClick={onFinishGame}
                        size={EViewSize.MD}
                        width="45%"
                    >
                        Leave Battle
                    </Button>
                </div>
            </div>
            
        </Modal>
    )
};