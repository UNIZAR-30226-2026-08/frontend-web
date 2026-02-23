import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';
import { TileConfig, TileType, IPropertyTile, IFantasyTile, IBridgeTile } from '../types/TileTypes';
import { PropertyTile } from '../objects/PropertyTile';
import { FantasyTile } from '../objects/FantasyTile';
import { BridgeTile } from '../objects/BridgeTile';

export class Board extends Phaser.Scene {
    private tiles: Tile[] = [];

    constructor() {
        super({ key: 'BoardScene' });
    }

    preload() { // precargar imagenes...
        this.load.json('board', 'data/board.json'); 
    } 

    create() { // crear escena
        const boardData = this.cache.json.get('board') as TileConfig[];

        boardData.forEach((config: TileConfig) => {
            let tile: Tile;

            if (config.type === TileType.PROPERTY) {
                tile = new PropertyTile(this, config as IPropertyTile);
            } else if (config.type === TileType.FANTASY) {
                tile = new FantasyTile(this, config as IFantasyTile);
            } else if (config.type === TileType.BRIDGE) {
                tile = new BridgeTile(this, config as IBridgeTile);
            } else {
                tile = new Tile(this, config);
            }
            
            this.tiles.push(tile);
        });
    }
}
