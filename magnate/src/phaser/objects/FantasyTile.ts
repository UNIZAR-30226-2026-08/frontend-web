import { Tile } from './Tile';
import { IFantasyTile } from '../types/TileTypes';

export class FantasyTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    
    constructor(scene: Phaser.Scene, config: IFantasyTile) {
        super(scene, config);
        
        this.icon = this.scene.add.image(0, 15, 'question_mark')
                .setOrigin(0.5)
                .setDisplaySize(80, 80);
        
        this.add(this.icon);
    }
}
