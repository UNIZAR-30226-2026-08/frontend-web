import { Tile } from './Tile';
import { ISpecialInTile } from '../types/TileTypes';

export class SpecialInTile extends Tile {
    constructor(scene: Phaser.Scene, config: ISpecialInTile) {
        super(scene, config, 160, 160);
    }
}
