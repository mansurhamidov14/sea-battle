import React from 'react';

import './styles.scss';

interface IProps {
    isVisible: boolean;
    onClose?: () => void;
    width?: number | string;
    height?: number | string;

}

export const Modal: React.FC<IProps> = ({
    children,
    isVisible,
    onClose,
    width = 480,
    height = 480
}) => {
    if (!isVisible) {
        return null;
    }
    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof width === 'number' ? `${height}px` : height
    }
    return (
        <div className="modal">
            <div className="modal__body" style={style}>
                {onClose && (
                    <button className="modal__body__close-btn" onClick={onClose}>
                        &times;
                    </button>
                )}
                {children}
            </div>
        </div>
    )
}