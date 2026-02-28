import { Tile } from './Tile';
import { IServerTile } from '../types/TileTypes';

export class ServerTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    constructor(scene: Phaser.Scene, config: IServerTile) {
        super(scene, config);

         this.icon = this.scene.add.image(0, 15, 'icon_server')
                .setOrigin(0.5)
                .setDisplaySize(60, 60);
        
        this.add(this.icon);
    }
}
