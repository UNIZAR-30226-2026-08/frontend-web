import { IPlayer } from '../interfaces/IPlayer';
import { EventBus } from '@/EventBus'

export class PlayerModel implements IPlayer {
    public id: string;
    public name: string;
    public color: number;
    public balance: number = 200;
    public properties: string[] = [];
    public currentTileIndex: number = 0;

    constructor(id: string, name: string, color: number) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public move(steps: number, totalTiles: number) {
        this.currentTileIndex = (this.currentTileIndex + steps) % totalTiles;
    }

    private emitUpdate() {
        EventBus.emit('player-updated', {
            id: this.id,
            balance: this.balance,
            properties: [...this.properties]
        });
    }
}
