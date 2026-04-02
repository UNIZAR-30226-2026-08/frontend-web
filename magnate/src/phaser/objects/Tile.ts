import * as Phaser from 'phaser';
import { ITile } from '../types/TileTypes';

export class Tile extends Phaser.GameObjects.Container {
    public tileConfig: ITile;
    protected nameText: Phaser.GameObjects.Text;
    protected background: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image;
    public overlay: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, config: ITile) {
        super(scene, config.x, config.y);
        
        this.tileConfig = config;

        const width = config.width || 80;
        const height = config.height || 120;
		this.setSize(width,height);

        if (config.rotation) {
            this.setAngle(config.rotation);
        }

        this.background = this.scene.add.rectangle(0, 0, width, height, 0xffffff)
            .setStrokeStyle(3, 0x000000); 
        
        this.background.setOrigin(0.5); 
        this.add(this.background);

        this.nameText = this.scene.add.text(0, -height / 2 + 10, config.name, {
            fontFamily: 'LTSuperior',
            fontStyle: 'bold',
            fontSize: '16px',
            color: '#242424',
            align: 'center',
            wordWrap: { width: width - 10 }
        }).setOrigin(0.5, 0);
        this.add(this.nameText);

        this.scene.add.existing(this);

        this.overlay = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.9);
        this.overlay.setVisible(false);
        this.overlay.setOrigin(0.5);
        this.add(this.overlay);
    }
}
