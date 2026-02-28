import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';
import { TileConfig, TileType, IPropertyTile, IFantasyTile, IBridgeTile, IServerTile, IStartTile, IGoToJailTile, IJailTile, IParkingTile, ITramTile} from '../types/TileTypes';
import { PropertyTile } from '../objects/PropertyTile';
import { FantasyTile } from '../objects/FantasyTile';
import { BridgeTile } from '../objects/BridgeTile';
import { ServerTile } from '../objects/ServerTile';
import { StartTile } from '../objects/StartTile';
import { GoToJailTile } from '../objects/GoToJailTile';
import { JailTile } from '../objects/JailTile';
import { ParkingTile } from '../objects/ParkingTile';
import { TramTile } from '../objects/TramTile';

export class Board extends Phaser.Scene {
    private tiles: Tile[] = [];

    constructor() {
        super({ key: 'BoardScene' });
    }

    preload() { // precargar imagenes...
        this.load.image('background', 'images/background_ingame.png');
        this.load.json('board', 'data/board.json');
        this.load.image('hat', 'images/hat.png'); // fantasy tiles
        this.load.image('tram', 'icons/tram.svg'); // tram tiles
        this.load.image('background_parking', 'images/parking.jpg'); // background parking tile
        this.load.image('icon_parking', 'images/caravan.png'); // parking tile
        this.load.image('icon_gotojail', 'images/bodyguard.png'); // background go_to_jail tile
        this.load.image('icon_jail', 'images/secretary.png'); // background jail tile
        this.load.image('icon_server', 'images/server.png'); // icon server tile
        this.load.image('icon_bridge', 'icons/bridge.svg'); // icon bridge tile

    } 

    create() { // crear escena
        const fullData = this.cache.json.get('board');
        const boardTiles = fullData.tiles as TileConfig[];
        const groups = fullData.groups as { group: number, color: string }[];

        const background = this.add.image(960, 540, 'background');
        background.setDisplaySize(1920, 1080);

        boardTiles.forEach((config: TileConfig) => {
            let tile: Tile;

            if (config.type === TileType.PROPERTY) {
                const propConfig = config as IPropertyTile;
                const groupInfo = groups.find(g => g.group === propConfig.group);
                propConfig.color = groupInfo ? groupInfo.color : '#FFFFFF';
                tile = new PropertyTile(this, propConfig);
                
            } else if (config.type === TileType.FANTASY) {
                tile = new FantasyTile(this, config as IFantasyTile);
            } else if (config.type === TileType.BRIDGE) {
                tile = new BridgeTile(this, config as IBridgeTile);
            } else if (config.type === TileType.SERVER) {
                tile = new ServerTile(this, config as IServerTile);
            } else if (config.type === TileType.START) {
                tile = new StartTile(this, config as IStartTile);
            } else if (config.type === TileType.GO_TO_JAIL) {
                tile = new GoToJailTile(this, config as IGoToJailTile);
            } else if (config.type === TileType.JAIL) {
                tile = new JailTile(this, config as IJailTile);
            } else if (config.type === TileType.PARKING) {
                tile = new ParkingTile(this, config as IParkingTile);
            } else if (config.type === TileType.TRAM) {
                tile = new TramTile(this, config as ITramTile);
            } else {
                tile = new Tile(this, config);
            }
            
            this.tiles.push(tile);
        });
    }
}
