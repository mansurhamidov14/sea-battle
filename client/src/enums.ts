export enum EEvents {
    ACCEPT_JOIN_REQUEST = 'accept_join_request',
    DECLINE_JOIN_REQUEST = 'decline_join_request',
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
    GET_AWAITING_USERS_LIST = 'get_awaiting_users_list'
}

export enum EUserStatus {
    ONLINE = 'ONLINE',
    WAITING_FOR_OPPONENT = 'WAITING_FOR_OPPONENT',
    REQUESTING_TO_JOIN_ROOM = 'REQUESTING_TO_JOIN_ROOM',
    FLEET_LOCATING_COMPLETED = 'FLEET_LOCATING_COMPLETED',
    FLEET_LOCATING_IN_PROGRESS = 'FLEET_LOCATING_IN_PROGRESS',
    PLAYING = 'PLAYING',
    UNREGISTERED = 'UNREGISTERED'
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

export enum EViewType {
    DANGER = 'danger',
    PRIMARY = 'primary',
    SUCCESS = 'success',
    WARNING = 'warning',
    SECONDARY = 'secondary'
}

export enum EViewSize {
    SM = 'sm',
    MD = 'md',
    LG = 'lg'
}

export enum ENotificationType {
    DECLINED_INVITATION = 'DECLINED_INVITATION',
    RECEIVED_INVITATION = 'RECEIVED_INVITATION',
}

export enum EPlayingMode {
    WATCHING,
    FIRING
}

export enum EAvatarName {
    BOY_1 = 'boy-1',
    BOY_2 = 'boy-2',
    BOY_3 = 'boy-3',
    BOY_4 = 'boy-4',
    BOY_5 = 'boy-5',
    BOY_6 = 'boy-6',
    BOY_7 = 'boy-7',
    BOY_8 = 'boy-8',
    BOY_9 = 'boy-9',
    BOY_10 = 'boy-10',
    BOY_11 = 'boy-11',
    BOY_12 = 'boy-12',
    BOY_13 = 'boy-13',
    BOY_14 = 'boy-14',
    BOY_15 = 'boy-15',
    BOY_16 = 'boy-16',
    BOY_17 = 'boy-17',
    BOY_18 = 'boy-18',
    BOY_19 = 'boy-19',
    BOY_20 = 'boy-20',
    BOY_21 = 'boy-21',
    BOY_22 = 'boy-22',
    BOY_23 = 'boy-23',
	GIRL_1 = 'girl-1',
    GIRL_2 = 'girl-2',
    GIRL_3 = 'girl-3',
    GIRL_4 = 'girl-4',
    GIRL_5 = 'girl-5',
    GIRL_6 = 'girl-6',
    GIRL_7 = 'girl-7',
    GIRL_8 = 'girl-8',
    GIRL_9 = 'girl-9',
    GIRL_10 = 'girl-10',
    GIRL_11 = 'girl-11',
    GIRL_12 = 'girl-12',
    GIRL_13 = 'girl-13',
    GIRL_14 = 'girl-14',
    GIRL_15 = 'girl-15',
    GIRL_16 = 'girl-16',
    GIRL_17 = 'girl-17',
    GIRL_18 = 'girl-18',
    GIRL_19 = 'girl-19',
    GIRL_20 = 'girl-20',
    GIRL_21 = 'girl-21',
    GIRL_22 = 'girl-22',
    GIRL_23 = 'girl-23',
    GIRL_24 = 'girl-24',
    GIRL_25 = 'girl-25',
    GIRL_26 = 'girl-26',
    GIRL_27 = 'girl-27',
}
