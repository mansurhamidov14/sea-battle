export interface ICoordinates {
    H: number;
    V: number;
}

export interface IFiredCoordinates extends ICoordinates {
    isSuccessful?: boolean;
    wasDestroyed?: boolean;
}

export interface IFleetCoordinates extends ICoordinates {
    wasFired: boolean;
}
