import { uuid } from 'uuidv4';

import { EUserStatus } from '../enums';

/** Model */
export interface IUser {
    id: string;
    username: string;
    status: EUserStatus;
    roomId?: string;
}

interface IUsers {
    list: IUser[];
    create: (username: string, socketId: string) => IUser;
    exists: (username: string) => boolean;
    findById: (id: string) => IUser | undefined;
    setStatus: (id: string, status: EUserStatus) => void;
    startBattle: (roomId: string) => void; 
    getOpponent: (userId: string, roomId: string) => IUser | undefined;
    getByRoom: (roomId: string) => IUser | undefined;
    joinToRoom: (userId: string, roomId: string, updatedStatus?: EUserStatus) => void;
    leaveRoom: (id: string) => void;
    delete: (id: string) => void;
}

class Users implements IUsers {
    public list: IUser[] = [];

    public create (username: string, socketId: string): IUser {
        const user = {
            id: socketId,
            username,
            status: EUserStatus.ONLINE
        }
        this.list.push(user);
        return user;
    }

    public exists (username: string): boolean {
        return this.list.some(user => username === user.username);
    }

    public findById (id: string): IUser | undefined {
        return this.list.find(user => user.id === id);
    }

    public startBattle (roomId: string) {
        return this.list.map(user => user.roomId === roomId ? { ...user, status: EUserStatus.PLAYING } : user);
    }

    public setStatus (id: string, status: EUserStatus): void {
        this.list = this.list.map(user => (
            user.id === id ? { ...user, status } : user
        ));
    }

    public getByRoom (roomId: string): IUser | undefined {
        return this.list.find(user => user.roomId === roomId);
    }

    public getOpponent (userId: string, roomId: string): IUser | undefined {
        return this.list.find(user => user.roomId === roomId && user.id !== userId);
    }

    public joinToRoom (userId: string, roomId: string, updatedStatus?: EUserStatus): void {
        this.list = this.list.map(user => (
            user.id === userId
                ? { ...user, roomId, status: updatedStatus || EUserStatus.WAITING_FOR_OPPONENT }
                : user
        ));
    }

    public leaveRoom (id: string): void {
        this.list = this.list.map(({ id: userId, username, roomId, status }) => (
            id === userId 
                ? { id, username, status: EUserStatus.ONLINE }
                : { id, username, roomId, status }
        ));
    }

    public delete (id: string): void {
        this.list = this.list.filter(({ id: userId }) => userId !== id);
    }
}

export const users = new Users();
