import { Tile } from './Tile';
import { IServerTile } from '../types/TileTypes';

export class ServerTile extends Tile {
    constructor(scene: Phaser.Scene, config: IServerTile) {
        super(scene, config);
    }
}
