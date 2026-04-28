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
    updateFrom(data) {
        this.name = data.name ?? this.name;
        this.balance = data.balance ?? this.balance;
        this.properties = data.properties ? [...data.properties] : this.properties;
        this.currentTileId = data.currentTileId ?? this.currentTileId;
        this.jailRemainingTurns = data.jailRemainingTurns ?? this.jailRemainingTurns;
        this.emitUpdate();
    }
    emitUpdate() {
        const hexColor = `#${this.color.toString(16).padStart(6, '0')}`;
        EventBus.emit('player-updated', {
            id: this.id,
            name: this.name,
            balance: this.balance,
            properties: [...this.properties],
            color: hexColor,
            jailTurnCount: this.jailRemainingTurns
        });
    }
}
