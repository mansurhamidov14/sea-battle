import { range } from 'lodash';
import React from 'react';

import { IFiredCoordinates } from '../../models';

import './styles.scss';

interface IProps {
    blackBordered?: boolean;
    firedCoordinates?: IFiredCoordinates[]
    onClickItem?: (V: number, H: number) => void;
}

export const GameGrid: React.FC<IProps> = ({
    blackBordered,
    children,
    firedCoordinates,
    onClickItem
}) => {
    const gridClassnames = ['grid']
    if (blackBordered) {
        gridClassnames.push('grid--black-bordered');
    }

    return (
        <div className={gridClassnames.join(' ')}>
            {range(1, 11).map(row => (
                <div className="grid__row" key={row}>
                    {range(1, 11).map(col => {
                        const gridCellClassNames = ['cell'];
                        const firedCoordinatesData = firedCoordinates?.find(coor => coor.V === col && coor.H === row);
                        const wasFired = Boolean(firedCoordinatesData);
                        if (onClickItem && !wasFired) {
                            gridCellClassNames.push('cell--hover')
                        }
                        if (wasFired) {
                            if (firedCoordinatesData?.wasDestroyed) {
                                gridCellClassNames.push('cell--destroyed');
                            } else if (firedCoordinatesData?.isSuccessful) {
                                gridCellClassNames.push('cell--successfully-fired');
                            } else {
                                gridCellClassNames.push('cell--fired');
                            }
                        }
                        const gridCellClassName = gridCellClassNames.map(className => `grid__row__${className}`).join(' ');
                        return (
                            <div
                                key={`${row}${col}`}
                                className={gridCellClassName}
                                onClick={onClickItem && !wasFired ? (() => onClickItem(row, col)) : undefined}
                            />
                        )
                    })}
                </div>
            ))}
            {children}
        </div>
    )
}