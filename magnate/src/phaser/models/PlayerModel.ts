import { EventBus } from '@/EventBus';

export class PlayerModel {
    public id: string;
    public name: string;
    public color: number;
    public balance: number = 0; // TODO: No se yo lo de hardcodear este número
    public properties: string[] = [];
    public currentTileId: string = "000"; 
    public jailRemainingTurns: number = 0;

    constructor(id: string, name: string, color: number) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public move(targetTileId: string) {
        this.currentTileId = targetTileId;
        this.emitUpdate(); // TODO: Todavía hay que ver si lo vamos a hacer así
    }

    public emitUpdate() {
        EventBus.emit('player-updated', {
            id: this.id,
            balance: this.balance,
            properties: [...this.properties],
            jailTurnCount: this.jailRemainingTurns
        });
    }

}
