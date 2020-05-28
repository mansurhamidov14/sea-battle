import React from 'react';

import { IFleetCoordinates } from '../../models';

import './styles.scss';

interface IProps {
    coordinates: IFleetCoordinates[];
    hasError?: boolean;
    movable?: boolean;
}

export const Fleet: React.FC<IProps> = ({
    coordinates,
    hasError,
    movable,
}) => {
    const isVertical = coordinates[0].V === coordinates[1]?.V;
    const fleetStartH = coordinates[0].H - 1;
    const fleetStartV = coordinates[0].V - 1;
    const fleetClassnames = ['fleet'];
    const wasDestroyed = coordinates.every(({ wasFired }) => wasFired);

    fleetClassnames.push(`fleet--${isVertical ? 'vertical' : 'horizontal'}`);
    if (hasError) {
        fleetClassnames.push(`fleet--error`);
    } else if (movable) {
        fleetClassnames.push(`fleet--movable`);
    }

    return (
        <div
            className={fleetClassnames.join(' ')}
            style={{
                top: `${64 * fleetStartH}px`,
                left: `${64 * fleetStartV - Number(Boolean(movable || hasError))}px`
            }}
        >
            {coordinates.map((coor, i) => {
                const itemClassnames = ['fleet__item'];
                if (wasDestroyed) {
                    itemClassnames.push('fleet__item--destroyed');
                } else if (coor.wasFired) {
                    itemClassnames.push('fleet__item--fired');
                }
                return (
                    <div className={itemClassnames.join(' ')} key={i} />
                )
            })}
        </div>
    )
}