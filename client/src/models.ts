import {
    EAvatarName,
    ENotificationType
} from './enums';

export interface ICoordinates {
    H: number;
    V: number;
}

export interface IFleetCoordinates extends ICoordinates {
    wasFired?: boolean;
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

export interface IMovableFleet extends IFleet {
    hasError?: boolean;
}

export interface IUser {
    id?: string;
    avatar: EAvatarName;
    username: string;
}

export interface IAwaitingUser extends IUser {
    hasBeenInvited?: boolean;
    roomId: string;
}

export interface INotification extends IUser {
    type: ENotificationType
}

interface IFireResult {
    firedFleetId: number | null;
    fleets: IUserFleet[];
    isGameOver: boolean;
    wasDestroyed: boolean;
    wasFired: boolean;
}
