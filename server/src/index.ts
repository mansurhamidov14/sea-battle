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
        const roomId = uuid();
    
        users
            .create(user, socket.id)
            .joinToRoom(socket.id, roomId, EUserStatus.ONLINE);
        socket.join(roomId);

        callback(socket.id);
        io.emit(EEvents.GET_AWAITING_USERS_LIST, users.getAwaitingUsers());
    });

    socket.on(EEvents.SEND_JOIN_REQUEST, (roomId) => {
        const roomHost = users.getByRoom(roomId);
        const user = users.findById(socket.id);
        if (roomHost) {
            io.to(roomHost.id).emit(EEvents.SEND_JOIN_REQUEST, user);
        } else {
            socket.join(roomId);
            users.joinToRoom(socket.id, roomId);
            io.to(socket.id).emit(EEvents.CREATE_ROOM, roomId);
        }
    });

    socket.on(EEvents.ACCEPT_JOIN_REQUEST, (userId: string) => {
        const user = users.findById(userId);

        if (user && user.roomId) {
            socket.join(user.roomId);
            users.joinToRoom(socket.id, user.roomId, EUserStatus.FLEET_LOCATING_IN_PROGRESS);
            users.setStatus(socket.id, EUserStatus.FLEET_LOCATING_IN_PROGRESS);
            io.to(user.roomId).emit(EEvents.START_FLEETS_LOCATING);
        } else {
            io.to(socket.id).emit(EEvents.NOTIFICATION, { type: 'opponent_left_the_room' });
        }
    });

    socket.on(EEvents.DECLINE_JOIN_REQUEST, (userId: string) => {
        const user = users.findById(socket.id);
        io.to(userId).emit(EEvents.DECLINE_JOIN_REQUEST, user);
    });

    socket.on(EEvents.COMPLETE_FLEETS_LOCATING, (userFleets, callback) => {
        const roomId = users.findById(socket.id)?.roomId;
        if (roomId) {
            const opponent = users.getOpponent(socket.id, roomId);
            fleets.setUserFleets(socket.id, userFleets);
            callback();
            if (opponent?.status !== EUserStatus.FLEET_LOCATING_COMPLETED) {
                users.setStatus(socket.id, EUserStatus.FLEET_LOCATING_COMPLETED);
            } else {
                users.startBattle(roomId);
                io.to(roomId).emit(EEvents.START_GAME, opponent.id);
            }
        }
    });

    socket.on(EEvents.FIRE, (coordinates: ICoordinates, callback) => {
        const roomId = users.findById(socket.id)?.roomId;
        if (roomId) {
            const opponent = users.getOpponent(socket.id, roomId);
            if (opponent) {
                const fireResult = fleets.fire(coordinates, opponent.id);
                callback(fireResult.firedFleetId, fireResult.wasDestroyed);
                io.to(opponent.id).emit(EEvents.FIRE, fireResult.firedFleetId, fireResult.fleets, coordinates);
            }
        }
    });

    socket.on(EEvents.DISCONNECT, () => {
        const user = users.findById(socket.id);
        if (
            user?.status &&
            [EUserStatus.FLEET_LOCATING_COMPLETED, EUserStatus.FLEET_LOCATING_IN_PROGRESS, EUserStatus.PLAYING]
                .includes(user?.status) &&
            user.roomId
        ) {
            io.to(user.roomId).emit(EEvents.NOTIFICATION, { type: 'opponent_left_the_room' })
        } 
        users.delete(socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});