import React from 'react';

import { EViewType, EAvatarName } from '../../enums';

import './styles.scss';
import { Avatar } from '../Avatar';

interface IAction {
    label: string;
    onClick: () => void;
}

export interface IAlertProps {
    actions?: IAction[];
    avatarName?: EAvatarName;
    message?: string;
    onClose?: () => void;
    title: string;
    view: EViewType;
}

export const Alert: React.FC<IAlertProps> = ({
    actions,
    avatarName,
    message,
    onClose,
    title,
    view,
}) => {
    const classNames = ['alert', `alert--${view}`];

    return (
        <div className={classNames.join(" ")}>
            <button type="button" onClick={onClose} className="alert__close_btn">
                X
            </button>
            {avatarName && (
                <Avatar name={avatarName} size={64} className="alert__avatar" />
            )}
            <div className="alert__content">
                <h4 className="alert__content__title">
                    {title}
                </h4>
                {message && (
                    <p className="alert__content__message">
                        {message}
                    </p>
                )}
                {actions && Boolean(actions.length) && actions.map((action, index) => (
                    <button className="alert__content__action-btn" type="button" key={index} onClick={action.onClick}>
                        {action.label}
                    </button>
                ))}
            </div>
            
        </div>
    )
}
