import { EGameEvents, EKeyboardKeyCodes, EMovingDirection } from '../enums';

export interface IControlService {
    init: () => void;
}

export class ControlService implements IControlService {
    private initKeyboard (): void {
        window.onkeydown = (e:  KeyboardEvent) => {
            let event: any;
            if (e.keyCode === EKeyboardKeyCodes.LEFT) {
                event = new CustomEvent(EGameEvents.MOVE_FLEET, { detail: { direction: EMovingDirection.LEFT }});
            } else if (e.keyCode === EKeyboardKeyCodes.UP) {
                event = new CustomEvent(EGameEvents.MOVE_FLEET, { detail: { direction: EMovingDirection.UP }});
            } else if (e.keyCode === EKeyboardKeyCodes.RIGHT) {
                event = new CustomEvent(EGameEvents.MOVE_FLEET, { detail: { direction: EMovingDirection.RIGHT }});
            } else if (e.keyCode === EKeyboardKeyCodes.DOWN) {
                event = new CustomEvent(EGameEvents.MOVE_FLEET, { detail: { direction: EMovingDirection.DOWN }});
            } else if (e.keyCode === EKeyboardKeyCodes.ROTATION) {
                event = new CustomEvent(EGameEvents.ROTATE_FLEET);
            } else if (e.keyCode === EKeyboardKeyCodes.SPACE) {
                event = new CustomEvent(EGameEvents.LOCATE_FLEET);
            } else if (e.keyCode === EKeyboardKeyCodes.UNDO) {
                event = new CustomEvent(EGameEvents.UNDO);
            }

            event && window.dispatchEvent(event);
        }
    }

    public init (): void {
        this.initKeyboard();
    }
}
