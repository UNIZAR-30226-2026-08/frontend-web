import { EventBus } from '@/EventBus';
export class PlayerModel {
    id;
    name;
    color;
    balance;
    properties = [];
    currentTileId = "000";
    jailRemainingTurns = 0;
    constructor(id, name, color, balance) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.balance = balance;
    }
    move(targetTileId) {
        this.currentTileId = targetTileId;
        this.emitUpdate(); // TODO: Todavía hay que ver si lo vamos a hacer así
    }
    emitUpdate() {
        EventBus.emit('player-updated', {
            id: this.id,
            balance: this.balance,
            properties: [...this.properties],
            jailTurnCount: this.jailRemainingTurns
        });
    }
}
