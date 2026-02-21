import { Tile } from './Tile';
import { IPropertyInTile } from '../types/TileTypes';

export class PropertyInTile extends Tile {
    constructor(scene: Phaser.Scene, config: IPropertyInTile) {
        super(scene, config, 80, 160);

        // const priceText = this.scene.add.text(0, 20, `Price: $${config.price}`, {
        //     fontSize: '10px',
        //     color: '#888888',
        //     align: 'center'
        // }).setOrigin(0.5);
        // this.add(priceText);
    }
}
