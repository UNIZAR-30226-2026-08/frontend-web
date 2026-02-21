import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';
import { TileConfig, TileType, IPropertyTile, ISpecialTile, IBridgeTile, ISpecialInTile, IPropertyInTile } from '../types/TileTypes';
import { PropertyTile } from '../objects/PropertyTile';
import { SpecialTile } from '../objects/SpecialTile';
import { BridgeTile } from '../objects/BridgeTile';
import { SpecialInTile } from '../objects/SpecialInTile';
import { PropertyInTile } from '../objects/PropertyInTile';

export class Board extends Phaser.Scene {
    private tiles: Tile[] = [];

    constructor() {
        super({ key : 'BoardScene' })
    }

    preload() { // precargar imagenes...
        this.load.json('board', '/data/board.json');
    } 
    create() { // crear escena
        
        const boardData = this.cache.json.get('board') as TileConfig[];

        boardData.forEach((config : TileConfig) => {

            let tile: Tile;
            if (config.type === TileType.PROPERTY) {
                tile = new PropertyTile(this, config as IPropertyTile);
            } else if (config.type === TileType.SPECIAL) {
                tile = new SpecialTile(this, config as ISpecialTile);
            } else if (config.type === TileType.BRIDGE) {
                tile = new BridgeTile(this, config as IBridgeTile);
            } else if (config.type === TileType.SPECIALIN) {
                tile = new SpecialInTile(this, config as ISpecialInTile);
            } else if (config.type === TileType.PROPERTYIN) {
                tile = new PropertyInTile(this, config as IPropertyInTile);
            } else {
                tile = new Tile(this, config);
            }
            this.tiles.push(tile);

        })


    }
}