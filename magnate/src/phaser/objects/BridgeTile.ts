import { Tile } from './Tile';
import { IBridgeTile } from '../types/TileTypes';

export class BridgeTile extends Tile {
    constructor(scene: Phaser.Scene, config: IBridgeTile) {
        super(scene, config, 85, 370);
    }
}
