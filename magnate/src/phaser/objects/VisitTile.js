import { Tile } from './Tile';
export class VisitTile extends Tile {
    constructor(scene, config) {
        super(scene, config);
        this.setVisible(false);
    }
}
