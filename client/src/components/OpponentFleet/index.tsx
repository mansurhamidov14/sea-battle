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
    const fleetClassnames = ['opponent-fleet'];

    return (
        <div className={fleetClassnames.join(' ')}>
            {coordinates.map((coor, i) => {
                const itemClassnames = ['opponent-fleet__item'];
                if (wasDestroyed) {
                    itemClassnames.push('opponent-fleet__item--destroyed');
                }
                return (
                    <div
                        style={{
                            top: `${64 * (coor.H - 1)}px`,
                            left: `${64 * (coor.V - 1)}px`
                        }}
                        className={itemClassnames.join(' ')}
                        key={i}
                    />
                );
            })}
        </div>
    )
}