import { Tile } from './Tile';
import { IParkingTile } from '../types/TileTypes';

export class ParkingTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    private subText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, config: IParkingTile) {
        super(scene, config);

        // if (this.background) {
        //     this.background.destroy();
        // }
        
        // this.background = this.scene.add.image(0, 0, 'background_parking')
        //     .setDisplaySize(config.width || 80, config.height || 120)
        //     .setOrigin(0.5); 

        // this.add(this.background);
        
        // const whiteOverlay = this.scene.add.rectangle(0, 0, config.width || 80, config.height || 120, 0xffffff, 0.5);
        // this.add(whiteOverlay);

        // this.sendToBack(whiteOverlay);
        // this.sendToBack(this.background);
        
         this.nameText.setStyle({ fontSize: '22px', align: 'center' })
            .setOrigin(0.5, 2.6)
            .setAngle(45)
            .setPosition(1, 1);

        this.add(this.nameText);

        this.icon = this.scene.add.image(0, 15, 'icon_parking')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(90, 60)
            .setAngle(45)
            .setPosition(1, 1);
        
        this.add(this.icon);
        
        this.subText = this.scene.add.text(0, 15, "Gratuito", {
            fontFamily: 'LTSuperior',
            fontSize: '22px',
            color: '#242424',
            fontStyle: 'bold'
        })
        .setOrigin(0.5, -1.)
        .setAngle(45)
        .setPosition(1, 1);
        
        this.add(this.subText);
    }
}
