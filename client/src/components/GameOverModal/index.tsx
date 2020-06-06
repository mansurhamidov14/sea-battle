import React from 'react';

import { EViewType, EViewSize, EEvents } from '../../enums';
import { useGameplay, usePlayer } from '../../hooks';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Modal } from '../Modal';

import './styles.scss';

export const GameOverModal: React.FC = () => {
    const { player } = usePlayer();
    const {
        isGameOver,
        isWinner,
        score: { won, lost },
        requestRevenge,
        finishBattle,
        opponent
    } = useGameplay();
    const [isRevengeAvailable, setRevengeAvailabilty] = React.useState<boolean>(true);
    const opponentBlockClassName =
        ['game-over-modal__content__user', !isRevengeAvailable && 'game-over-modal__content__user--fade-out']
            .filter(Boolean)
            .join(' ');
    const { SUCCESS, DANGER, SECONDARY } = EViewType;
    const scoreView =
        won > lost ?
            SUCCESS :
        won < lost ?
            DANGER :
            SECONDARY;

    React.useEffect(
        () => {
            window.addEventListener(EEvents.OPPONENT_REVENGE_REFUSAL, () => {
                setRevengeAvailabilty(false);
            });
        },
        []
    );

    React.useEffect(
        () => {
            setRevengeAvailabilty(true);
        },
        [opponent]
    )

    return (
        <Modal isVisible={isGameOver} onClose={finishBattle} height="max-content">
            <div className="game-over-modal">
                <div className={`game-over-modal__result game-over-modal__result--${isWinner ? 'winner' : 'loser'}`}>
                    {isWinner ? 'VICTORY!' : 'DEFEAT'}
                </div>
                <div className="game-over-modal__content">
                    <div className="game-over-modal__content__user">
                        <Avatar name={player.avatar} size={128} />
                        <div className="game-over-modal__content__user__name">
                            {player.username}
                        </div>
                    </div>
                    <div className={`game-over-modal__content__score game-over-modal__content__score--${scoreView}`}>
                        {won} - {lost}
                    </div>
                    <div className={opponentBlockClassName}>
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
                        view={isRevengeAvailable ? EViewType.PRIMARY : EViewType.SECONDARY}
                        disabled={!isRevengeAvailable}
                        onClick={requestRevenge}
                        size={EViewSize.MD}
                        width="45%"
                    >
                        Play Revenge
                    </Button>
                    <Button
                        block
                        view={EViewType.DANGER}
                        onClick={finishBattle}
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