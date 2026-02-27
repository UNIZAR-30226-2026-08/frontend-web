import { Tile } from './Tile';
import { ITramTile } from '../types/TileTypes';

export class TramTile extends Tile {
    private icon: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, config: ITramTile) {
        super(scene, config);

        this.nameText.setStyle({ fontSize: '22px', align: 'center'})
            .setOrigin(0.5, 2)
            .setAngle(45)
            .setPosition(1, 1);
        this.add(this.nameText);

        this.icon = this.scene.add.image(0, 10, 'tram')
                .setOrigin(0.5, 0.4)
                .setAngle(45)
                .setPosition(1, 1)
                .setDisplaySize(210, 100);
                
        this.add(this.icon);
        

    }
}
