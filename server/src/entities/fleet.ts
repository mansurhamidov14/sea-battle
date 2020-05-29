export interface ICoordinates {
    H: number;
    V: number;
}

interface IFleetCoordinates extends ICoordinates {
    wasFired: boolean;
}

interface IUserFleet {
    id: number;
    fleet: IFleetCoordinates[];
    wasDestroyed: boolean;
}

interface IUsersFleets {
    userId: string;
    fleets: IUserFleet[];
}

interface IFireResult {
    firedFleetId: number | null;
    fleets: IUserFleet[];
    isGameOver: boolean;
    wasDestroyed: boolean;
    wasFired: boolean;
}

interface IFleets {
    list: IUsersFleets[];
    fire: (coordinates: ICoordinates, userId: string) => IFireResult;
    setUserFleets: (userId: string, fleets: IUserFleet[]) => void;
}

class Fleets implements IFleets {
    public list: IUsersFleets[] = [];

    public fire (coordinates: ICoordinates, userId: string): IFireResult {
        const userFleets = this.list.find(fleets => fleets.userId === userId)?.fleets;
        let firedFleetId: number | null = null;
        let isSuccessful = false;
        let wasDestroyed = false;
        
        if (userFleets) {
            this.list = this.list.map(
                item => {
                    if (item.userId === userId) {
                        return {
                            ...item,
                            fleets: item.fleets.map(
                                fleetItem => {
                                    const updatedFleet: IFleetCoordinates[] = fleetItem.fleet.map(
                                        ({ H, V, wasFired }) => {
                                            if (coordinates.H === H && coordinates.V === V && !wasFired) {
                                                firedFleetId = fleetItem.id;
                                                isSuccessful = true;
                                                return { H, V, wasFired: true };
                                            }
                                            return { H, V, wasFired };
                                        }
                                    );
                                    wasDestroyed = updatedFleet.every(({ wasFired }) => wasFired);
                                    return {
                                        id: fleetItem.id,
                                        fleet: updatedFleet,
                                        wasDestroyed
                                    };
                                }
                            )
                        };
                    }
                    return item;
                }
            );
        }

        return {
            isGameOver: this.list.every(fleets => fleets.fleets.every(fleet => fleet.wasDestroyed)),
            fleets: this.list.find(fleets => fleets.userId === userId)?.fleets as IUserFleet[],
            firedFleetId,
            wasDestroyed,
            wasFired: isSuccessful,
        };
    }

    public setUserFleets (userId: string, fleets: IUserFleet[]): void {
        this.list = [
            ...this.list.filter(item => item.userId !== userId),
            {
                userId,
                fleets: fleets.map((fleet, index) => ({ ...fleet, id: index + 1 }))
            }
        ];
    }
}

export const fleets: IFleets = new Fleets();
