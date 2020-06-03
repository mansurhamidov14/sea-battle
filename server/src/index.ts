import http from 'http';
import socket from 'socket.io';

import { EEvents, EUserStatus } from './enums';
import { fleets, ICoordinates } from './entities/fleet';
import { Game } from './entities/game';

const server = http.createServer();
const io = socket(server);
const game = new Game(io);
const PORT = process.env.PORT || 8080;

io.on('connection', socket => {
    socket.on(EEvents.CREATE_USER, (user, callback) => {
        callback(socket.id);
        game.createPlayer(user, socket.id)
            .broadcastAwaitingPlayers();
    });

    socket.on(EEvents.FINISH_BATTLE, (callback) => {
        const opponent = game.findPlayerOpponent(socket.id);
        game.setPlayerStatus(socket.id, EUserStatus.ONLINE)
            .broadcastEvent(opponent.id, EEvents.OPPONENT_REVENGE_REFUSAL)
            .broadcastAwaitingPlayers();
        callback();
    });

    socket.on(EEvents.SEND_INVITATION, (userId: string) => {
        const opponent = game.findPlayerById(userId);
        const user = game.findPlayerById(socket.id);
        if (opponent) {
            game.broadcastEvent(opponent.id, EEvents.SEND_INVITATION, user);
        }
    });

    socket.on(EEvents.ACCEPT_INVITATION, (userId: string) => {
        const opponent = game.findPlayerById(userId);
        if (opponent) {
            game.connectPlayers(socket.id, userId)
                .setPlayerStatus(socket.id, EUserStatus.FLEET_LOCATING_IN_PROGRESS)
                .setPlayerStatus(userId, EUserStatus.FLEET_LOCATING_IN_PROGRESS)
                .broadcastEventToMultiplePlayers([socket.id, userId], EEvents.START_FLEETS_LOCATING);
        } else {
            game.broadcastEvent(socket.id, EEvents.NOTIFICATION, { type: 'opponent_left_the_room' });
        }
    });

    socket.on(EEvents.DECLINE_INVITATION, (userId: string) => {
        const user = game.findPlayerById(socket.id);
        game.broadcastEvent(userId, EEvents.DECLINE_INVITATION, user);
    });

    socket.on(EEvents.COMPLETE_FLEETS_LOCATING, (userFleets, callback) => {
        const opponent = game.findPlayerOpponent(socket.id);
        if (opponent) {
            fleets.setUserFleets(socket.id, userFleets);
            callback();
            if (opponent.status !== EUserStatus.FLEET_LOCATING_COMPLETED) {
                game.setPlayerStatus(socket.id, EUserStatus.FLEET_LOCATING_COMPLETED);
            } else {
                game.start(socket.id);
            }
        } else {
            game.broadcastEvent(socket.id, EEvents.NOTIFICATION, { type: 'opponent_left_the_room' });
        }
    });

    socket.on(EEvents.FIRE, (coordinates: ICoordinates, callback) => {
        const opponent = game.findPlayerOpponent(socket.id);
        const { firedFleetId, wasDestroyed, isGameOver, fleets: fleetsList } = fleets.fire(coordinates, opponent.id);
        callback(firedFleetId, wasDestroyed, isGameOver);
        game.broadcastEvent(opponent.id, EEvents.FIRE, firedFleetId, fleetsList, coordinates, isGameOver);
    });

    socket.on(EEvents.REVENGE_REQUESTED, () => {
        const opponent = game.findPlayerOpponent(socket.id);
        if (opponent.status === EUserStatus.REQUESTED_REVENGE) {
            game.broadcastEventToMultiplePlayers([socket.id, opponent.id], EEvents.START_FLEETS_LOCATING);
        } else {
            game.setPlayerStatus(socket.id, EUserStatus.REQUESTED_REVENGE);
            opponent && game.broadcastEvent(opponent.id, EEvents.REVENGE_REQUESTED);
        }
    });

    socket.on(EEvents.DISCONNECT, () => {
        const user = game.findPlayerById(socket.id);
        if (user?.opponentId) {
            game.broadcastEvent(user.opponentId, EEvents.NOTIFICATION, { type: 'opponent_left_the_room' });
        } 
        game.deletePlayer(socket.id);
    });
});

server.listen(PORT);