import { EventBus } from '@/EventBus';

export class PlayerModel {
    public id: string;
    public name: string;
    public color: number;
    public balance: number;
    public properties: string[] = [];
    public currentTileId: string = "000"; 
    public jailRemainingTurns: number = 0;

    constructor(id: string, name: string, color: number, balance: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.balance = balance;
    }

    public move(targetTileId: string) {
        this.currentTileId = targetTileId;
        this.emitUpdate(); // TODO: Todavía hay que ver si lo vamos a hacer así
    }

    public updateFrom(data: any) {
        this.name = data.name ?? this.name;
        this.balance = data.balance ?? this.balance;
        this.properties = data.properties ? [...data.properties] : this.properties;
        this.currentTileId = data.currentTileId ?? this.currentTileId;
        this.jailRemainingTurns = data.jailRemainingTurns ?? this.jailRemainingTurns;
        
        this.emitUpdate();
    }

    public emitUpdate() {
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
