import socket from 'socket.io';

import { EEvents, EUserStatus } from '../enums';

/** Model */
export interface IUser {
    id: string;
    username: string;
    avatar: string;
    status: EUserStatus;
    opponentId?: string;
}

interface IGame {
    players: { [id: string]: IUser };
    createPlayer: (user: IUser, socketId: string) => IGame;
    connectPlayers: (userId: string, opponentId: string) => IGame;
    broadcastEvent: (connection: string, event: EEvents, ...args: any[]) => IGame;
    broadcastEventToMultiplePlayers: (connections: string[], event: EEvents, ...args: any[]) => IGame;
    broadcastAwaitingPlayers: () => void;
    findPlayerById: (id: string) => IUser;
    setPlayerStatus: (id: string, status: EUserStatus) => IGame;
    start: (userId: string) => IGame; 
    findPlayerOpponent: (userId: string) => IUser | undefined;
    deletePlayer: (id: string) => void;
}

export class Game implements IGame {
    public players: { [id: string]: IUser } = {};

    constructor (private io: socket.Server) {}

    public createPlayer (user: IUser, socketId: string): IGame {
        const newUser = {
            ...user,
            id: socketId,
            status: EUserStatus.ONLINE
        }
        this.players[socketId] = newUser;
        return this;
    }

    public broadcastEvent (connection: string, event: EEvents, ...args: any[]): IGame {
        this.io.to(connection).emit(event, ...args);
        return this;
    }

    public broadcastEventToMultiplePlayers (connections: string[], event: EEvents, ...args: any[]): IGame {
        connections.forEach(connection => this.broadcastEvent(connection, event, ...args));
        return this;
    }

    public connectPlayers (userId: string, opponentId: string): IGame {
        this.players[userId].opponentId = opponentId;
        this.players[opponentId].opponentId = userId;
        
        return this;
    }

    public broadcastAwaitingPlayers (): void {
        const awaitingUsers: IUser[] = [];
        Object.keys(this.players).forEach(userId => {
            if (this.players[userId].status === EUserStatus.ONLINE) {
                awaitingUsers.push(this.players[userId]);
            }
        });
        this.io.emit(EEvents.GET_AWAITING_USERS_LIST, awaitingUsers);
    }

    public findPlayerById (id: string): IUser {
        return this.players[id];
    }

    public start (userId: string): IGame {
        const opponentId = this.players[userId].opponentId as string;
        this.players[userId].status = EUserStatus.PLAYING;
        this.players[opponentId].status = EUserStatus.PLAYING;
        this.broadcastEventToMultiplePlayers([userId, opponentId], EEvents.START_GAME, opponentId);
        return this;
    }

    public setPlayerStatus (id: string, status: EUserStatus): IGame {
        this.players[id].status = status
        return this;
    }

    public findPlayerOpponent (userId: string): IUser {
        return this.players[this.players[userId].opponentId as string];
    }

    public deletePlayer (id: string): void {
        delete this.players[id];
    }
}
