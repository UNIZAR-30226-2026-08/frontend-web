import { Tile } from './Tile';
import { IStartTile } from '../types/TileTypes';

export class StartTile extends Tile {
    constructor(scene: Phaser.Scene, config: IStartTile) {
        super(scene, config);

        this.nameText.setStyle({
            fontSize: '22px',
            align: 'center'
        });
        this.nameText.setOrigin(0.5, 1.8);
        this.nameText.setAngle(-45);
        this.nameText.setPosition(1, 1);
    }
}
