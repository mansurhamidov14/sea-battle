import { EUserStatus } from '../enums';

/** Model */
export interface IUser {
    id: string;
    username: string;
    avatar: string;
    status: EUserStatus;
    opponentId?: string;
}

interface IUsers {
    list: { [id: string]: IUser };
    create: (user: IUser, socketId: string) => IUsers;
    getAwaitingUsers: () => IUser[];
    findById: (id: string) => IUser | undefined;
    setStatus: (id: string, status: EUserStatus) => IUsers;
    startBattle: (userId: string) => IUsers; 
    getOpponent: (userId: string) => IUser | undefined;
    delete: (id: string) => void;
}

class Users implements IUsers {
    public list: { [id: string]: IUser } = {};

    public create (user: IUser, socketId: string): IUsers {
        const newUser = {
            ...user,
            id: socketId,
            status: EUserStatus.ONLINE
        }
        this.list[socketId] = newUser;
        return this;
    }

    public getAwaitingUsers (): IUser[] {
        const awaitingUsers: IUser[] = [];
        Object.keys(this.list).forEach(userId => {
            if (this.list[userId].status === EUserStatus.ONLINE) {
                awaitingUsers.push(this.list[userId]);
            }
        });
        return awaitingUsers;
    }

    public findById (id: string): IUser {
        return this.list[id];
    }

    public startBattle (userId: string) {
        const opponentId = this.list[userId].opponentId as string;
        this.list[userId].status = EUserStatus.PLAYING;
        this.list[opponentId].status = EUserStatus.PLAYING;
        return this;
    }

    public setStatus (id: string, status: EUserStatus): IUsers {
        this.list[id].status = status
        return this;
    }

    public getOpponent (userId: string): IUser {
        return this.list[this.list[userId].opponentId as string];
    }

    public delete (id: string): void {
        delete this.list[id];
    }
}

export const users = new Users();
