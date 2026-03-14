import { IPlayer } from '../interfaces/IPlayer';
import { EventBus } from '@/EventBus';

export class PlayerModel implements IPlayer {
    public id: string;
    public name: string;
    public color: number;
    public balance: number = 200;
    public properties: string[] = [];
    public currentTileId: string = "000"; 

    constructor(id: string, name: string, color: number) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public move(targetTileId: string) {
        this.currentTileId = targetTileId;
    }

    private emitUpdate() {
        EventBus.emit('player-updated', {
            id: this.id,
            balance: this.balance,
            properties: [...this.properties]
        });
    }
}
