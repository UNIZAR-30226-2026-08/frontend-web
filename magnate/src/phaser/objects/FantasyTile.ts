import { Tile } from './Tile';
import { IFantasyTile } from '../types/TileTypes';

export class FantasyTile extends Tile {
    constructor(scene: Phaser.Scene, config: IFantasyTile) {
        super(scene, config);
    }
}
