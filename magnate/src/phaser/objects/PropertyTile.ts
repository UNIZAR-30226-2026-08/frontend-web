import { Tile } from './Tile';
import { IPropertyTile } from '../types/TileTypes';

export class PropertyTile extends Tile {
    constructor(scene: Phaser.Scene, config: IPropertyTile) {
        super(scene, config);

        const colorBarHeight = 30;
        const width = config.width || 80;
        const height = config.height || 120;

        const colorBar = this.scene.add.rectangle(0, - (height / 2), width - 3, colorBarHeight, 
            Phaser.Display.Color.HexStringToColor(config.color).color
        ).setOrigin(0.5, 0); 
        
        this.add(colorBar);

        this.nameText.setStyle({ fontSize: '16px', align: 'center' })
            .setOrigin(0.5, 0)
            .setPosition(0, -20);

        this.add(this.nameText);

        // const priceText = this.scene.add.text(0, 40, `${config.price}€`, {
        //     fontSize: '12px',
        //     color: '#888888',
        //     align: 'center',
        // }).setOrigin(0.5);
        
        // this.add(priceText);
    }
}
