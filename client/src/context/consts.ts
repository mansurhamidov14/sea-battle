import { EAvatarName, EUserStatus } from '../enums';

import { IGameplayContext } from './Gameplay';
import { IPlayerContext } from './Player';

export const initialPlayerData: IPlayerContext['player'] = { username: `Mansur${new Date().getSeconds()}`, avatar: EAvatarName.BOY_1 };
export const initialAwaitingUsers: IGameplayContext['awaitingUsers'] = [];
export const initialOpponent: IGameplayContext['opponent'] = undefined;
export const initialOpponentFleets: IGameplayContext['opponentFleets'] = [];
export const initialPlayerFleets: IGameplayContext['playerFleets'] = [];
export const initialScore: IGameplayContext['score'] = { won: 0, lost: 0 };
export const initialUserStatus: IGameplayContext['userStatus'] = EUserStatus.UNREGISTERED;
export const initialFiredCoordinates: IGameplayContext['firedCoordinatesOfPlayer'] = [];
