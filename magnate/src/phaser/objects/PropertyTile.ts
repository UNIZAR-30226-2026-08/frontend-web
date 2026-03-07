import { Tile } from './Tile';
import { IPropertyTile } from '../types/TileTypes';

export class PropertyTile extends Tile {
    private ownerMarker: Phaser.GameObjects.Polygon | null = null;

    constructor(scene: Phaser.Scene, config: IPropertyTile) {
        super(scene, config);

        const colorBarHeight = 30;
        const width = config.width || 80;
        const height = config.height || 120;

        const colorBar = this.scene.add.rectangle(0, - (height / 2), width - 3, colorBarHeight, 
            Phaser.Display.Color.HexStringToColor(config.color).color
        ).setOrigin(0.5, 0); 
        
        this.add(colorBar);

        this.nameText.setStyle({ fontSize: '14px', align: 'center' })
            .setOrigin(0.5, 0)
            .setPosition(0, -20);

        this.add(this.nameText);

        // TODO: falta precio de las property tiles, lo pasa el backend?
        // const priceText = this.scene.add.text(0, 40, `${config.price}€`, {
        //     fontSize: '12px',
        //     color: '#888888',
        //     align: 'center',
        // }).setOrigin(0.5);
        
        // this.add(priceText);
    }

    public setOwnerMarker(playerColor: number) {
        if (this.ownerMarker) {
            this.ownerMarker.destroy();
        }
    
        const tileWidth = this.tileConfig.width || 80;
        const tileHeight = this.tileConfig.height || 120;
        
        const w = tileWidth / 2;
        const h = 25; // Height
        const cut = 10; // Depth of the triangle cut
    
        const points = [
            -w, 0,
             w, 0,
             w, h,
             0, h - cut,
            -w, h
        ];
    
        const marker = this.scene.add.polygon(
            0, 
            tileHeight / 2, 
            points, 
            playerColor
        );
    
        marker.setOrigin(0, 0); 
        marker.setStrokeStyle(1, 0x000000);
        
        this.add(marker);
        this.sendToBack(marker);
        
        this.ownerMarker = marker as any;
    }

    
}
