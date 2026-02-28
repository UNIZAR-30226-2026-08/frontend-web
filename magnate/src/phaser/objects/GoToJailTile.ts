import { Tile } from './Tile';
import { IGoToJailTile } from '../types/TileTypes';

export class GoToJailTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    private subText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, config: IGoToJailTile) {
        super(scene, config);

        this.nameText.setStyle({
            fontSize: '18px',
            align: 'center'
        });
         
        this.nameText.setOrigin(0.5, 3);
        this.nameText.setAngle(-45);
        this.nameText.setPosition(1, 1);

        this.icon = this.scene.add.image(0, 15, 'icon_gotojail')
            .setOrigin(0.5, 0.7)
            .setDisplaySize(70, 70)
            .setAngle(-45)
            .setPosition(1, 1);
        
        this.add(this.icon);

        this.subText = this.scene.add.text(0, 15, "Secretaria", {
            fontFamily: 'LTSuperior',
            fontSize: '18px',
            color: '#242424',
            fontStyle: 'bold'
        })
        .setOrigin(0.5, -1)
        .setAngle(-45)
        .setPosition(1, 1);
        
        this.add(this.subText);
        
    }
}
