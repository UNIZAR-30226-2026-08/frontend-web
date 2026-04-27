import { Tile } from './Tile';
export class FantasyTile extends Tile {
    icon;
    constructor(scene, config) {
        super(scene, config);
        this.icon = this.scene.add.image(0, 15, 'hat')
            .setOrigin(0.5)
            .setDisplaySize(70, 70);
        this.add(this.icon);
    }
}
