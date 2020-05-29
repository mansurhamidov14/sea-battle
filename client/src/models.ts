export interface ICoordinates {
    H: number;
    V: number;
}

export interface IFleetCoordinates extends ICoordinates {
    wasFired: boolean;
}

export interface IOpponentFleet {
    id: number;
    coordinates: ICoordinates[];
    wasDestroyed: boolean;
}

export interface IFleet {
    id: number;
    coordinates: IFleetCoordinates[];
}
