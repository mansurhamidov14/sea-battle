export enum EEvents {
    ACCEPT_JOIN_REQUEST = 'accept_join_request',
    DECLINE_JOIN_REQUEST = 'decline_join_request',
    REVENGE_REQUESTED = 'revenge_requested',
    OPPONENT_REVENGE_REFUSAL = 'opponent_revenge_refusal',
    COMPLETE_FLEETS_LOCATING = 'complete_fleets_locating',
    CREATE_ROOM = 'create_room',
    CREATE_USER = 'create_user',
    FINISH_BATTLE = 'finish_battle',
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
    UNREGISTERED = 'UNREGISTERED',
}
