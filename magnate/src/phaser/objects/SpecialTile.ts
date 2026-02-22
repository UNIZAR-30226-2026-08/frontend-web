import { Tile } from './Tile';
import { ISpecialTile } from '../types/TileTypes';

export class SpecialTile extends Tile {
    constructor(scene: Phaser.Scene, config: ISpecialTile) {
        super(scene, config);
    }
}
