import { Tile } from './Tile';
import { IJailTile } from '../types/TileTypes';

export class JailTile extends Tile {
    constructor(scene: Phaser.Scene, config: IJailTile) {
        super(scene, config);

        this.nameText.setStyle({
            fontSize: '22px',
            align: 'center'
        });
         
        this.nameText.setOrigin(0.5, 1.8);
        this.nameText.setAngle(45);
        this.nameText.setPosition(1, 1);
    }
}
