export enum EEvents {
    ACCEPT_JOIN_REQUEST = 'accept_join_request',
    COMPLETE_FLEETS_LOCATING = 'complete_fleets_locating',
    CREATE_ROOM = 'create_room',
    CREATE_USER = 'create_user',
    DISCONNECT = 'disconnect',
    FIRE = 'fire',
    MESSAGE = 'message',
    NOTIFICATION = 'notification',
    SEND_JOIN_REQUEST = 'send_join_request',
    START_GAME = 'start_game',
    START_FLEETS_LOCATING = 'start_fleets_locating',
}

export enum EUserStatus {
    ONLINE,
    WAITING_FOR_OPPONENT,
    REQUESTING_TO_JOIN_ROOM,
    FLEET_LOCATING_COMPLETED,
    FLEET_LOCATING_IN_PROGRESS,
    PLAYING,
}
