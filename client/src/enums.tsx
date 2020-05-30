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
    ONLINE = 'ONLINE',
    WAITING_FOR_OPPONENT = 'WAITING_FOR_OPPONENT',
    REQUESTING_TO_JOIN_ROOM = 'REQUESTING_TO_JOIN_ROOM',
    FLEET_LOCATING_COMPLETED = 'FLEET_LOCATING_COMPLETED',
    FLEET_LOCATING_IN_PROGRESS = 'FLEET_LOCATING_IN_PROGRESS',
    PLAYING = 'PLAYING',
}

export enum EKeyboardKeyCodes {
    SPACE = 32,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    ROTATION = 82,
    UNDO = 85
}

export enum EMovingDirection {
    LEFT = 'LEFT',
    UP = 'UP',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN'
}

export enum EGameEvents {
    LOCATE_FLEET = 'LOCATE_FLEET',
    MOVE_FLEET = 'MOVE_FLEET',
    ROTATE_FLEET = 'ROTATE_FLEET',
    UNDO = 'UNDO',
}
