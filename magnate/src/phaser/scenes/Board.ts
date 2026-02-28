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

import { PlayerModel } from '../models/PlayerModel';
import { PlayerToken } from '../objects/PlayerToken';
import { EventBus } from '@/EventBus'

export class Board extends Phaser.Scene {
    private tiles: Tile[] = [];
    private players: { model: PlayerModel, token: PlayerToken }[] = [];
    private colorPalette: number[] = [];
    private fantasyCards: any[] = [];

    constructor() {
        super({ key: 'BoardScene' });
    }

    preload() { // precargar imagenes...
        this.load.image('background', 'images/background_ingame.png');
        this.load.json('board', 'data/board.json');
        this.load.json('fantasyCards', 'data/fantasyCard.json');
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
        const fullFantasy = this.cache.json.get('fantasyCards');
        this.fantasyCards = fullFantasy.fantasy;


        const background = this.add.image(960, 540, 'background');
        background.setDisplaySize(1920, 1080);

        const rawColors = fullData.playerColors as string[];
        this.colorPalette = rawColors.map(c => parseInt(c.replace('#', '0x')));

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

        this.createPlayer("0001", "Player 1")
        this.createPlayer("0002", "Player 2")
        this.createPlayer("0003", "Player 3")
        this.createPlayer("0004", "Player 4")

        this.emitInitialPlayers();
    }

    createPlayer(id: string, name: string, color: number) {
        // const startTile = this.tiles[0];
        const startTile = this.tiles[this.players.length % this.colorPalette.length];
        
        const colorIndex = this.players.length % this.colorPalette.length;
        const assignedColor = this.colorPalette[colorIndex];

        const model = new PlayerModel(id, name, assignedColor);
        const token = new PlayerToken(this, startTile.x, startTile.y, assignedColor);

        token.setDepth(10 + this.players.length);

        // TODO: Esto es solo para probar el movimiento
        token.on('pointerdown', () => {
            //this.handlePlayerClick(id);
            this.handlePlayerClickDebug(id); // Para debugear si quiero enviarlo a una casilla en concreto
        });

        this.players.push({ model, token });
    }

    private emitInitialPlayers() {
        const playerInitData = this.players.map(p => {
            const cssColor = '#' + p.model.color.toString(16).padStart(6, '0');

            return {
                id: p.model.id,
                name: p.model.name,
                color: cssColor
            };
        });

        // Send the array to React!
        EventBus.emit('setup-players', playerInitData);
    }

    // TODO: Esto es solo para probar el movimiento
    private handlePlayerClick(playerId: string) {
        const p = this.players.find(pair => pair.model.id === playerId);
        if (!p) return;

        const roll = Phaser.Math.Between(1, 6);
        p.model.move(roll, this.tiles.length);
        const targetIndex = p.model.currentTileIndex;

        const othersCount = this.players.filter(other => 
            other.model.id !== playerId && 
            other.model.currentTileIndex === targetIndex
        ).length;

        const targetTile = this.tiles[targetIndex];
        targetTile.setOwnerMarker(p.model.color);
        let finalX = targetTile.x;
        let finalY = targetTile.y;

        if (othersCount > 0) {
            const spacing = 22;
            finalX += (othersCount % 2 === 0) ? spacing : -spacing;
            finalY += (othersCount > 1) ? spacing : -spacing;
        }

        p.token.moveTo(finalX, finalY);

        this.time.delayedCall(500, () => {
            this.checkTileLogic(p.model, targetTile);
        });
    }

    // Método para debug, se envía a la primera casilla de un tipo específico
    public handlePlayerClickDebug(playerId: string) {
        const p = this.players.find(pair => pair.model.id === playerId);
        if (!p) return;

        // Buscamos la primera casilla de tipo Fantasy
        const fantasyIndex = this.tiles.findIndex(t => t instanceof FantasyTile);
        p.model.currentTileIndex = fantasyIndex;
        
        const targetTile = this.tiles[fantasyIndex];
        p.token.moveTo(targetTile.x, targetTile.y);

        // Ejecutamos la lógica de la casilla
        this.time.delayedCall(500, () => {
            this.checkTileLogic(p.model, targetTile);
        });
    }
    
    private checkTileLogic(player: PlayerModel, tile: Tile) {
        
        if (tile instanceof FantasyTile || (tile as any).config?.type === TileType.FANTASY) {
            // TODO: Vendrá del backend
            const cartasFantasia = [
                { title: "¡HACKEO ÉPICO!", description: "Has interceptado las comunicaciones del servidor.", price: 10 }
            ];
            
            const cartaAleatoria = Phaser.Utils.Array.GetRandom(cartasFantasia);

            // Evento hacia react
            EventBus.emit('show-fantasy-card', {
                ...cartaAleatoria,
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0')
            });
        }
    }
}
