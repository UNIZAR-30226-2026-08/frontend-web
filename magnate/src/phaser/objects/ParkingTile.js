import { Tile } from './Tile';
export class ParkingTile extends Tile {
    icon;
    subText;
    constructor(scene, config) {
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
    }
}
