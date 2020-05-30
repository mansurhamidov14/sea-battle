import React from 'react';

import { Fleet, GameGrid, Sea } from '../../components';
import { EGameEvents, EMovingDirection } from '../../enums';
import { IFleet, IMovableFleet } from '../../models';
import { FleetService, IFleetService } from '../../services/Fleet';

interface IState {
    locatedFleets: IFleet[];
    currentFleet: IMovableFleet;
}

export class FleetLocatingScreen extends React.Component<{}, IState> {
    fleetService: IFleetService;
    constructor (props: {}) {
        super(props);
        this.fleetService = new FleetService();

        this.state = {
            locatedFleets: [],
            currentFleet: this.fleetService.generateFleet()
        };
    }

    componentDidMount () {
        window.addEventListener(EGameEvents.MOVE_FLEET, (event: any) => {
            this.setCurrentFleetCoordinates(this.fleetService.moveFleet(this.state.currentFleet, event.detail.direction));
        });
        window.addEventListener(EGameEvents.ROTATE_FLEET, () => {
            this.setCurrentFleetCoordinates(this.fleetService.rotateFleet(this.state.currentFleet));
        });
        window.addEventListener(EGameEvents.UNDO, () => {
            this.setState({
                locatedFleets: this.state.locatedFleets.slice(0, -1)
            });
        });
        window.addEventListener(EGameEvents.LOCATE_FLEET, () => {
            if (!this.state.currentFleet || this.state.currentFleet.hasError) return false;
            this.setState(state => ({
                locatedFleets: [
                    ...state.locatedFleets,
                    state.currentFleet
                ]
            }));
        });
    }

    componentDidUpdate (_: {}, prevState: IState) {
        const { locatedFleets } = this.state;
        if (locatedFleets.length === prevState.locatedFleets.length) {
            return false;
        }

        if (locatedFleets.length < 10) {
            this.setCurrentFleetCoordinates(this.fleetService.generateFleet(locatedFleets.length))
        } else {
            this.setState({ currentFleet: null as any });
        }
    }

    setCurrentFleetCoordinates (newCoordinates: IState['currentFleet']) {
        this.setState(state => ({
            currentFleet: {
                ...newCoordinates,
                /** new fleet can not be even next door any already placed one */
                hasError: newCoordinates.coordinates.some(
                    coordinate => state.locatedFleets.some(
                        fleet => fleet.coordinates.some(
                            locatedFleetCoordinate => (
                                (
                                    Math.abs(locatedFleetCoordinate.H - coordinate.H) <= 1 &&
                                    Math.abs(locatedFleetCoordinate.V - coordinate.V) <= 1
                                )
                            )
                        )
                    )
                )
            }
        }));
    }

    render () {
        return (
            <Sea>
                <GameGrid>
                    {this.state.locatedFleets.map(fleet => (
                        <Fleet key={fleet.id} coordinates={fleet.coordinates} />
                    ))}
                    {Boolean(this.state.currentFleet) && (
                        <Fleet
                            movable
                            hasError={this.state.currentFleet.hasError}
                            coordinates={this.state.currentFleet.coordinates}
                        />
                    )}
                </GameGrid>
            </Sea>
        )  
    }
}
