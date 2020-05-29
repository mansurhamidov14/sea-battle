import React from 'react';

import { Sea } from '../../components';

import './styles.scss';

interface IProps {
    onStartGame: () => void;
}

export const HomeScreen: React.FC<IProps> = ({ onStartGame }) => (
    <Sea>
        <div className="home-screen">
            <button onClick={onStartGame} className="start-game-btn">
                <img src={require('../../assets/images/play.png')} alt="Play" />
            </button>
        </div>
    </Sea>
)