import { Tile } from './Tile';
import { IJailTile } from '../types/TileTypes';

export class JailTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    
    constructor(scene: Phaser.Scene, config: IJailTile) {
        super(scene, config);

        const width = config.width || 80;
        const height = config.height || 120;

        const bg = this.scene.add.rectangle(-20, -20, width - 40, height - 40, 0xe3f2fd)
            .setStrokeStyle(2, 0x000000)
        
        this.add(bg);

        this.icon = this.scene.add.image(0, 15, 'icon_jail')
            .setOrigin(0.5, 1.4)
            .setDisplaySize(100, 60)
            .setAngle(-45)
            .setPosition(1, 1);
        
        this.add(this.icon);

        this.nameText.setStyle({ fontSize: '22px', align: 'center'})
            .setOrigin(0.5, 0.7)
            .setAngle(-45)
            .setPosition(1, 1);
        this.add(this.nameText);
        
        const subTextv = this.scene.add.text(0, 15, "Espere en", {
            fontFamily: 'LTSuperior',
            fontSize: '18px',
            color: '#242424',
            fontStyle: 'bold'
        })
            .setOrigin(0.7, -2.3)
            .setAngle(0)
            .setPosition(1, 1);
        
        this.add(subTextv);

        const subTexth = this.scene.add.text(0, 15, "el pasillo", {
            fontFamily: 'LTSuperior',
            fontSize: '18px',
            color: '#242424',
            fontStyle: 'bold'
        })
            .setOrigin(0.2, -2.3)
            .setAngle(-90)
            .setPosition(1, 1);
        
        this.add(subTexth);

        this.sendToBack(bg);
        this.sendToBack(this.background);
    }
}
