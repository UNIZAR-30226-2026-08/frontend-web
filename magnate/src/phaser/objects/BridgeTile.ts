import { Tile } from './Tile';
import { IBridgeTile } from '../types/TileTypes';

export class BridgeTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    private ownerMarker: Phaser.GameObjects.Polygon | null = null;
    
    constructor(scene: Phaser.Scene, config: IBridgeTile) {
        super(scene, config);
        const w = config.width || 80;
        const h = config.height || 120;

        this.icon = this.scene.add.image(0, 0, 'icon_bridge')
            .setOrigin(0.5, 3)
            .setDisplaySize(60, 60);
        
        this.add(this.icon);
        
        this.nameText.setStyle({ fontSize: `${Math.floor(w * 0.3)}px`, align: 'center', wordWrap: { width: w * 2 }})
            .setOrigin(1, 0.5)
            .setAngle(-90)
            .setPosition(1, -(h * 0.1));
            
        this.add(this.nameText);   

        const priceText = this.scene.add.text(0, 170, `${config.price}M`, {
            fontFamily: 'LTSuperior',
            fontSize: '16px',
            color: '#222222',
            align: 'center',
        }).setOrigin(0.5);
        
        this.add(priceText);
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
        marker.setStrokeStyle(3, 0xffffff);
        
        this.add(marker);
        this.sendToBack(marker);
        
        this.ownerMarker = marker as any;
    }
}
