import { uuid } from 'uuidv4';

import { EUserStatus } from '../enums';

/** Model */
export interface IUser {
    id: string;
    username: string;
    avatar: string;
    status: EUserStatus;
    roomId?: string;
}

interface IUsers {
    list: IUser[];
    create: (user: IUser, socketId: string) => IUsers;
    exists: (username: string) => boolean;
    getAwaitingUsers: () => IUser[];
    findById: (id: string) => IUser | undefined;
    setStatus: (id: string, status: EUserStatus) => IUsers;
    startBattle: (roomId: string) => void; 
    getOpponent: (userId: string, roomId: string) => IUser | undefined;
    getByRoom: (roomId: string) => IUser | undefined;
    joinToRoom: (userId: string, roomId: string, updatedStatus?: EUserStatus) => void;
    leaveRoom: (id: string) => void;
    delete: (id: string) => void;
}

class Users implements IUsers {
    public list: IUser[] = [];

    public create (user: IUser, socketId: string): IUsers {
        const newUser = {
            ...user,
            id: socketId,
            status: EUserStatus.ONLINE
        }
        this.list.push(newUser);
        return this;
    }

    public exists (username: string): boolean {
        return this.list.some(user => username === user.username);
    }

    public getAwaitingUsers (): IUser[] {
        return this.list.filter(({ status }) => status === EUserStatus.ONLINE);
    }

    public findById (id: string): IUser | undefined {
        return this.list.find(user => user.id === id);
    }

    public startBattle (roomId: string) {
        return this.list.map(user => user.roomId === roomId ? { ...user, status: EUserStatus.PLAYING } : user);
    }

    public setStatus (id: string, status: EUserStatus): IUsers {
        this.list = this.list.map(user => (
            user.id === id ? { ...user, status } : user
        ));
        return this;
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
        this.list = this.list.map(({ avatar, id: userId, username, roomId, status }) => (
            id === userId 
                ? { avatar, id, username, status: EUserStatus.ONLINE }
                : { avatar, id, username, roomId, status }
        ));
    }

    public delete (id: string): void {
        this.list = this.list.filter(({ id: userId }) => userId !== id);
    }
}

export const users = new Users();
