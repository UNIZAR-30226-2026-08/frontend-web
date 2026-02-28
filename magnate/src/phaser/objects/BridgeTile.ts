import { Tile } from './Tile';
import { IBridgeTile } from '../types/TileTypes';

export class BridgeTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    
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
    
        
    }
}
