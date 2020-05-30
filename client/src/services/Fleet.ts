import { range } from 'lodash';

import { IFleet } from '../models';
import { EMovingDirection } from '../enums';

export interface IFleetService {
    generateFleet: (locatedCount?: number) => IFleet;
    moveFleet: (fleet: IFleet, direction: EMovingDirection) => IFleet;
    rotateFleet: (fleet: IFleet) => IFleet;
}

export class FleetService implements IFleetService {
    public generateFleet (locatedCount: number = 0): IFleet {
        const size = this.getNextFleetSize(locatedCount);
        const id = locatedCount + 1;
        const coordinates: IFleet['coordinates'] = range(1, size + 1).map(verticalCoordinate => (
            { H: 1, V: verticalCoordinate }
        ));

        return { id, coordinates };
    }

    private getNextFleetSize (locatedCount: number): number {
        return (
            !locatedCount ? 4 :
            locatedCount < 3 ? 3 :
            locatedCount < 6 ? 2 :
            locatedCount < 10 ? 1 : 0
        );
    }

    public moveFleet (fleet: IFleet, direction: EMovingDirection): IFleet {
        if (!fleet) return fleet;
        let movedFleetCoordinates: IFleet['coordinates'] = fleet.coordinates;
        switch (direction) {
            case EMovingDirection.LEFT:
                if (fleet.coordinates[0].V !== 1) {
                    movedFleetCoordinates = fleet.coordinates.map(coord => ({ ...coord, V: coord.V - 1 }));
                }
                break;
            case EMovingDirection.UP:
                if (fleet.coordinates[0].H !== 1) {
                    movedFleetCoordinates = fleet.coordinates.map(coord => ({ ...coord, H: coord.H - 1 }));
                }
                break;
            case EMovingDirection.RIGHT:
                if (fleet.coordinates[fleet.coordinates.length - 1].V !== 10) {
                    movedFleetCoordinates = fleet.coordinates.map(coord => ({ ...coord, V: coord.V + 1 }));
                }
                break;
            case EMovingDirection.DOWN:
                if (fleet.coordinates[fleet.coordinates.length - 1].H !== 10) {
                    movedFleetCoordinates = fleet.coordinates.map(coord => ({ ...coord, H: coord.H + 1 }));
                }
                break;
        }
        return {
            id: fleet.id,
            coordinates: movedFleetCoordinates
        };
    }

    rotateFleet (fleet: IFleet): IFleet {
        if (!fleet || fleet.coordinates.length === 1) {
            return fleet;
        }
        let newCoordinates = fleet.coordinates;
        const isHorizontal = fleet.coordinates[0].H === fleet.coordinates[1].H;
        if (isHorizontal) {
            newCoordinates = fleet.coordinates.map((coor, i) => ({ H: coor.H + i, V: coor.V - i }));
        } else {
            newCoordinates = fleet.coordinates.map((coor, i) => ({ H: coor.H - i, V: coor.V + i }));
        }

        return {
            id: fleet.id,
            coordinates:
                newCoordinates[fleet.coordinates.length - 1].H <= 10 &&
                newCoordinates[fleet.coordinates.length - 1].V <= 10
                    ? newCoordinates
                    : fleet.coordinates
        };
    }
}
