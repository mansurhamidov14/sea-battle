export interface ICoordinates {
    H: number;
    V: number;
}

export interface IFleetCoordinates extends ICoordinates {
    wasFired: boolean;
}
