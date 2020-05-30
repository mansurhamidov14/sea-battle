import React from 'react';

import { EViewType } from '../../enums';

import './styles.scss';

interface IProps {
    block?: boolean;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    view: EViewType;
    width?: number | string
}

export const Button: React.FC<IProps> = ({
    block,
    className,
    children,
    disabled,
    onClick,
    view,
    width
}) => {
    const classNames = ['button', `button--${view}`];
    if (block) {
        classNames.push('button--block');
    }
    if (disabled) {
        classNames.push('button--disabled');
    }
    if (className) {
        classNames.push(className);
    }

    const style =
        typeof width === 'number'
            ? { width: `${width}px` }
        : typeof width === 'string'
            ? { width }
        : {}

    return (
        <button
            className={classNames.join(' ')}
            onClick={onClick}
            style={style}
            disabled={disabled}
        >
            {children}
        </button>
    )
};