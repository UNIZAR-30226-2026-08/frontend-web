import { Tile } from './Tile';
import { IStartTile } from '../types/TileTypes';

export class StartTile extends Tile {
    constructor(scene: Phaser.Scene, config: IStartTile) {
        super(scene, config);

        this.nameText.setStyle({
            fontSize: '28px',
            color: '#242424',
            fontStyle: 'bold',
            align: 'center'
        })
            .setText("SALIDA")
            .setOrigin(0.5, 1.3)
            .setPosition(1,1)
            .setAngle(-45); 

        const arrow = this.scene.add.text(0, 30, '➔', {
            fontSize: '60px',
            color: '#ef233c'
        }).setOrigin(1, 1).setPosition(1, 1);
        arrow.setAngle(-180);
        
        this.add(arrow);

        const subText = this.scene.add.text(0, 0, "Cobra 200M al pasar", {
            fontFamily: 'LTSuperior',
            fontSize: '14px',
            color: '#242424',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAngle(-45);
        
        this.add(subText);
    }
}
