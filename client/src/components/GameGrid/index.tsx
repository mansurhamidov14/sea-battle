import { range } from 'lodash';
import React from 'react';

import { ICoordinates } from '../../models';

import './styles.scss';

interface IProps {
    firedCoordinates?: ICoordinates[]
    onClickItem?: (V: number, H: number) => void;
}

export const GameGrid: React.FC<IProps> = ({
    children,
    firedCoordinates,
    onClickItem
}) => {
    return (
        <div className="grid">
            {range(1, 11).map(row => (
                <div className="grid__row" key={row}>
                    {range(1, 11).map(col => {
                        const gridCellClassNames = ['cell'];
                        const wasFired = firedCoordinates?.some(coor => coor.V === col && coor.H === row);
                        if (onClickItem && !wasFired) {
                            gridCellClassNames.push('cell--hover')
                        }
                        if (wasFired) {
                            console.log(row, col);
                            gridCellClassNames.push('cell--fired');
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