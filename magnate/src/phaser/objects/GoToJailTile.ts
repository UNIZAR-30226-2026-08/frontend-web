import { Tile } from './Tile';
import { IGoToJailTile } from '../types/TileTypes';

export class GoToJailTile extends Tile {
    constructor(scene: Phaser.Scene, config: IGoToJailTile) {
        super(scene, config);

        this.nameText.setStyle({
            fontSize: '22px',
            align: 'center'
        });
         
        this.nameText.setOrigin(0.5, 1);
        this.nameText.setAngle(-45);
        this.nameText.setPosition(1, 1);
        
    }
}
