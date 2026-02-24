import { Tile } from './Tile';
import { ITramTile } from '../types/TileTypes';

export class TramTile extends Tile {
    private icon: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, config: ITramTile) {
        super(scene, config);

        this.nameText.setStyle({
            fontSize: '22px',
            align: 'center'
        });

        this.icon = this.scene.add.image(0, 15, 'tram')
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
