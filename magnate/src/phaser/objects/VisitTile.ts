import { Tile } from './Tile';
import { IVisitTile } from '../types/TileTypes';

export class VisitTile extends Tile {
    
    constructor(scene: Phaser.Scene, config: IVisitTile) {
        super(scene, config);

        this.setVisible(false);

    }   
}
