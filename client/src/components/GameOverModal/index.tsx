import React from 'react';

import { EViewType, EViewSize, EEvents } from '../../enums';
import { IUser, IAwaitingUser } from '../../models';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Modal } from '../Modal';

import './styles.scss';

interface IProps {
    isVisible: boolean;
    isWinner?: boolean;
    lostTimes: number;
    onFinishGame: () => void;
    onRevengeRequest: (roomId: string) => void;
    opponent?: IAwaitingUser;
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
    const [isRevengeAvailable, setRevengeAvailabilty] = React.useState<boolean>(true);
    const opponentBlockClassName =
        ['game-over-modal__content__user', !isRevengeAvailable && 'game-over-modal__content__user--fade-out']
            .filter(Boolean)
            .join(' ');
    const { SUCCESS, DANGER, SECONDARY } = EViewType;
    const scoreView =
        wonTimes > lostTimes ?
            SUCCESS :
        wonTimes < lostTimes ?
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
                        onClick={() => onRevengeRequest(opponent?.roomId as any)}
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