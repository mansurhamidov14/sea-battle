import http from 'http';
import socket from 'socket.io';
import { uuid } from 'uuidv4';

import { EEvents, EUserStatus } from './enums';
import { fleets, ICoordinates } from './entities/fleet';
import { users } from './entities/user';

const server = http.createServer();
const io = socket(server);
const PORT = process.env.PORT || 8080;

io.on('connection', socket => {
    console.log('New connection', socket.id);

    socket.on(EEvents.CREATE_USER, (user, callback) => {
        users.create(user, socket.id);

        callback(socket.id);
        io.emit(EEvents.GET_AWAITING_USERS_LIST, users.getAwaitingUsers());
    });

    socket.on(EEvents.FINISH_BATTLE, (callback) => {
        const user = users.findById(socket.id);
        const opponent = user?.opponentId && users.getOpponent(socket.id);
        opponent && io.to(opponent.id).emit(EEvents.OPPONENT_REVENGE_REFUSAL);

        io.emit(EEvents.GET_AWAITING_USERS_LIST, users.getAwaitingUsers());
        callback();
    });

    socket.on(EEvents.SEND_INVITATION, (userId: string) => {
        const opponent = users.findById(userId);
        const user = users.findById(socket.id);
        if (opponent) {
            io.to(opponent.id).emit(EEvents.SEND_INVITATION, user);
        }
    });

    socket.on(EEvents.ACCEPT_INVITATION, (userId: string) => {
        const user = users.findById(socket.id);
        const opponent = users.findById(userId);

        if (opponent && user) {
            opponent.opponentId = user.id;
            user.opponentId = opponent.id;
            users.setStatus(socket.id, EUserStatus.FLEET_LOCATING_IN_PROGRESS);
            io.to(user.id).emit(EEvents.START_FLEETS_LOCATING);
            io.to(opponent.id).emit(EEvents.START_FLEETS_LOCATING);
        } else {
            io.to(socket.id).emit(EEvents.NOTIFICATION, { type: 'opponent_left_the_room' });
        }
    });

    socket.on(EEvents.DECLINE_INVITATION, (userId: string) => {
        const user = users.findById(socket.id);
        io.to(userId).emit(EEvents.DECLINE_INVITATION, user);
    });

    socket.on(EEvents.COMPLETE_FLEETS_LOCATING, (userFleets, callback) => {
        const opponent = users.getOpponent(socket.id);
        if (opponent) {
            fleets.setUserFleets(socket.id, userFleets);
            callback();
            if (opponent.status !== EUserStatus.FLEET_LOCATING_COMPLETED) {
                users.setStatus(socket.id, EUserStatus.FLEET_LOCATING_COMPLETED);
            } else {
                users.startBattle(socket.id);
                io.to(socket.id).emit(EEvents.START_GAME, opponent.id);
                io.to(opponent.id).emit(EEvents.START_GAME, opponent.id);
            }
        }
    });

    socket.on(EEvents.FIRE, (coordinates: ICoordinates, callback) => {
        const opponent = users.getOpponent(socket.id);
        if (opponent) {
            const fireResult = fleets.fire(coordinates, opponent.id);
            callback(fireResult.firedFleetId, fireResult.wasDestroyed, fireResult.isGameOver);
            io.to(opponent.id).emit(EEvents.FIRE, fireResult.firedFleetId, fireResult.fleets, coordinates, fireResult.isGameOver);
        }
    });

    socket.on(EEvents.REVENGE_REQUESTED, () => {
        const opponent = users.getOpponent(socket.id);
        if (opponent.status === EUserStatus.REQUESTED_REVENGE) {
            io.to(socket.id).emit(EEvents.START_FLEETS_LOCATING);
            io.to(opponent.id).emit(EEvents.START_FLEETS_LOCATING);
        } else {
            users.setStatus(socket.id, EUserStatus.REQUESTED_REVENGE);
            opponent && io.to(opponent.id).emit(EEvents.REVENGE_REQUESTED);
        }
    });

    socket.on(EEvents.DISCONNECT, () => {
        const user = users.findById(socket.id);
        if (user?.opponentId) {
            io.to(user.opponentId).emit(EEvents.NOTIFICATION, { type: 'opponent_left_the_room' })
        } 
        users.delete(socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});