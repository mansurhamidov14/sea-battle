import React from 'react';

import { assets } from '../../assets';
import { EAvatarName } from '../../enums';

import './styles.scss';

interface IProps {
    className?: string;
    name: EAvatarName;
    onClick?: () => void;
    selected?: boolean;
    size?: number;
}

export const Avatar: React.FC<IProps> = ({
    className,
    name,
    onClick,
    selected,
    size = 64,
}) => {
    const classNames = ['avatar'];
    if (selected) {
        classNames.push('avatar--selected');
    }
    if (Boolean(onClick)) classNames.push('avatar--hover');
    if (className) classNames.push(className);

    return (
        <div onClick={onClick} className={classNames.join(' ')} style={{ width: `${size}px`, height: `${size}px` }}>
            <img src={assets.avatars[name]} alt={name} />
        </div>
    )
}