import { Tile } from './Tile';
import { IParkingTile } from '../types/TileTypes';

export class ParkingTile extends Tile {
    private icon: Phaser.GameObjects.Image;
    private subText: Phaser.GameObjects.Text;
    private priceText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, config: IParkingTile) {
        super(scene, config);
        const w = config.width || 80;
        const h = config.height || 120;
        
        this.nameText.setStyle({ fontSize: `${Math.floor(w * 0.2)}px`, align: 'center' })
            .setOrigin(0.6, 1.4)
            .setAngle(-45)
            .setPosition(1, -(h * 0.1));

        this.add(this.nameText);

        this.icon = this.scene.add.image(0, 15, 'icon_parking')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(90, 60)
            .setAngle(-45)
            .setPosition(1, 1);
        
        this.add(this.icon);
        
        this.subText = this.scene.add.text(0, 15, "Gratuito", {
            fontFamily: 'LTSuperior',
            fontSize: '22px',
            color: '#242424',
            fontStyle: 'bold'
        })
        .setOrigin(0.5, -1.)
        .setAngle(-45)
        .setPosition(1, 1);
        
        this.add(this.subText);

        this.priceText = this.scene.add.text(0, 0, "0M", {
            fontFamily: 'LTSuperior',
            fontSize: '20px',
            color: '#242424',
            fontStyle: 'bold'
        })
        .setOrigin(0.5, -2.5)
        .setAngle(-45)
        .setPosition(1, 1);

        this.add(this.priceText);
    }
    
    public updatePrice(amount: number) {
        this.priceText.setText(`${amount}M`);
        
        if (amount > 0) {
            this.scene.tweens.add({
                targets: this.priceText,
                scale: 1.2,
                duration: 100,
                yoyo: true
            });
        }
    }
}
