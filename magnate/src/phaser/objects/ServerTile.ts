import { Tile } from './Tile';
import { IServerTile } from '../types/TileTypes';

export class ServerTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    private ownerMarker: Phaser.GameObjects.Polygon | null = null;

    constructor(scene: Phaser.Scene, config: IServerTile) {
        super(scene, config);

         this.icon = this.scene.add.image(0, 15, 'icon_server')
                .setOrigin(0.5)
                .setDisplaySize(60, 60);
        
        this.add(this.icon);
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
