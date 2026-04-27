import { Tile } from './Tile';
export class GoToJailTile extends Tile {
    icon;
    subText;
    constructor(scene, config) {
        super(scene, config);
        this.nameText.setColor("#00000000");
        this.subText = this.scene.add.text(0, 15, "Ve a ", {
            fontFamily: 'LTSuperior',
            fontSize: '18px',
            color: '#242424',
            fontStyle: 'bold'
        })
            .setOrigin(0.5, 3)
            .setAngle(-45)
            .setPosition(1, 1);
        this.add(this.subText);
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
