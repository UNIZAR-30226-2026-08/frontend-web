import { Tile } from './Tile';
import { ITramTile } from '../types/TileTypes';

export class TramTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    // private subText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, config: ITramTile) {
        super(scene, config);

        const w = config.width || 80;
        const h = config.height || 120;

		this.setSize(w,h);
        
        this.nameText.setStyle({ 
            fontSize: `${Math.floor(w * 0.2)}px`,
            align: 'center',
            wordWrap: { width: w * 0.4 }
        })
            .setOrigin(0.6, 1.4)
            .setAngle(-45)
            .setPosition(1, -(h * 0.1));
        
        
        this.icon = this.scene.add.image(0, 0, 'tram')
            .setOrigin(0.3, 0)
            .setAngle(0)
            .setDisplaySize(w * 0.6, h * 0.6)
            .setPosition(1, -(h * 0.1));
                
        this.add(this.icon);

        // TODO: subText para añadir paradas del tranvía, ajustar posición y tamaño
        // this.subText = this.scene.add.text(0, 0, config.subText, {
        //     fontSize: `${Math.floor(w * 0.10)}px`,
        //     fontFamily: 'LTSuperior',
        //     color: '#242424',
        //     fontStyle: 'bold',
        //     align: 'center',
        //     wordWrap: { width: w * 0.7 }
        // }).setOrigin(0.4, -1)
        //   .setAngle(45)
        //   .setPosition(0.4, 0.4);
        
        // this.add(this.subText);
        

    }
}
