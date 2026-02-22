import * as Phaser from 'phaser';
import { ITile } from '../types/TileTypes';

export class Tile extends Phaser.GameObjects.Container {
    public tileConfig: ITile;

    constructor(scene: Phaser.Scene, config: ITile) {
        super(scene, config.x, config.y);
        
        this.tileConfig = config;

        const width = config.width || 80;
        const height = config.height || 120;

        if (config.rotation) {
            this.setAngle(config.rotation);
        }

        const bg = this.scene.add.rectangle(0, 0, width, height, 0xffffff)
            .setStrokeStyle(2, 0x000000); 
        
        bg.setOrigin(0.5); 
        this.add(bg);

        const nameText = this.scene.add.text(0, -height / 2 + 10, config.name, {
            fontSize: '14px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: width - 10 }
        }).setOrigin(0.5, 0);
        this.add(nameText);

        this.scene.add.existing(this);
    }
}

//TODO: falta crear clase Fantasy, Server, Player
