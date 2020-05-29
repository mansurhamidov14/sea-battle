import React from 'react';

import { ICoordinates } from '../../models';

import './styles.scss';

interface IProps {
    coordinates: ICoordinates[];
    wasDestroyed?: boolean;
}

export const OpponentFleet: React.FC<IProps> = ({
    coordinates,
    wasDestroyed,
}) => {
    const isVertical = coordinates[0].V === coordinates[1]?.V;
    const fleetStartH = coordinates[0].H - 1;
    const fleetStartV = coordinates[0].V - 1;
    const fleetClassnames = ['opponent-fleet'];

    fleetClassnames.push(`opponent-fleet--${isVertical ? 'vertical' : 'horizontal'}`);

    return (
        <div
            className={fleetClassnames.join(' ')}
            style={{
                top: `${64 * fleetStartH}px`,
                left: `${64 * fleetStartV}px`
            }}
        >
            {coordinates.map((coor, i) => {
                const itemClassnames = ['opponent-fleet__item'];
                if (wasDestroyed) {
                    itemClassnames.push('opponent-fleet__item--destroyed');
                }
                return (
                    <div className={itemClassnames.join(' ')} key={i} />
                );
            })}
        </div>
    )
}