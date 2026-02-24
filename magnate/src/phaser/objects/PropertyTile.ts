import { Tile } from './Tile';
import { IPropertyTile } from '../types/TileTypes';

export class PropertyTile extends Tile {
    constructor(scene: Phaser.Scene, config: IPropertyTile) {
        super(scene, config);

        // const priceText = this.scene.add.text(0, 20, `${config.price}€`, {
        //     fontSize: '12px',
        //     color: '#888888',
        //     align: 'center',
        // }).setOrigin(0.5);
        
        // this.add(priceText);
    }
}
