import { Tile } from './Tile';
import { IParkingTile } from '../types/TileTypes';

export class ParkingTile extends Tile {
    private icon: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, config: IParkingTile) {
        super(scene, config);

        this.nameText.setStyle({
            fontSize: '22px',
            align: 'center'
        });

        this.icon = this.scene.add.image(0, 15, 'dollar')
                .setOrigin(0.5, 0.5)
                .setDisplaySize(70, 70);
                
        this.add(this.icon);
         
        this.nameText.setOrigin(0.5, 1.8);
        this.nameText.setAngle(45);
        this.nameText.setPosition(1, 1);

        this.icon.setOrigin(0.5, 0.2);
        this.icon.setAngle(45);
        this.icon.setPosition(1, 1);
    }
}
