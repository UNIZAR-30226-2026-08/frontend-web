import * as Phaser from 'phaser';
import { ITile } from '../types/TileTypes';

export class Tile extends Phaser.GameObjects.Container {
    protected config: ITile;
    protected background: Phaser.GameObjects.Rectangle; 
    protected tileWidth: number;
    protected tileHeight: number;


    constructor(scene: Phaser.Scene, config: ITile, width: number = 100, height: number = 100) {
        super(scene, config.x, config.y);

        this.config = config;
        this.tileWidth = width;
        this.tileHeight = height;

        this.background = this.scene.add.rectangle(0, 0, width, height, 0xcccccc);
        this.background.setStrokeStyle(4, 0x000000);
        this.add(this.background);

        const text = this.scene.add.text(0, 0, config.name, {
            fontSize: '16px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: width - 10}
        }).setOrigin(0.5);
        this.add(text);
        
        if (config.rotation) {
            this.setAngle(config.rotation);
        }

        this.setSize(width, height);
        this.scene.add.existing(this);
    }

}

//TODO: falta crear clase Fantasy, Server, Player
