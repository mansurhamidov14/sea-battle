import {
    EAvatarName,
    EViewType
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
    id: string;
    hasBeenInvited?: boolean;
}

export interface INotification {
    id?: string;
    view: EViewType;
    title: string;
    message: string;
    accept?: INotificationAction;
    decline?: INotificationAction;
}

export interface INotificationAction {
    label: string;
    onClick: () => void;
}

export interface IScore {
    won: number;
    lost: number;
}
