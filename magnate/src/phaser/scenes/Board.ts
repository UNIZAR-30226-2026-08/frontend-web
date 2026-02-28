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

import { create3DDice } from '../objects/Dice3D';

export class Board extends Phaser.Scene {
    private tiles: Tile[] = [];
    private players: { model: PlayerModel, token: PlayerToken }[] = [];
    private colorPalette: number[] = [];

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
        this.load.image("dice-albedo", "dice-albedo.png");
        this.load.obj("dice-obj", "dice.obj");

    } 

    create() { // crear escena
        const fullData = this.cache.json.get('board');
        const boardTiles = fullData.tiles as TileConfig[];
        const groups = fullData.groups as { group: number, color: string }[];

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

        EventBus.on('trigger-dice-roll', this.handleDiceRoll, this);

        this.events.on('shutdown', () => {
            EventBus.off('trigger-dice-roll', this.handleDiceRoll, this);
        });
    }

    createPlayer(id: string, name: string) {
        // const startTile = this.tiles[0];
        const startTile = this.tiles[this.players.length % this.colorPalette.length];
        
        const colorIndex = this.players.length % this.colorPalette.length;
        const assignedColor = this.colorPalette[colorIndex];

        const model = new PlayerModel(id, name, assignedColor);
        const token = new PlayerToken(this, startTile.x, startTile.y, assignedColor);

        token.setDepth(10 + this.players.length);

        // TODO: Esto es solo para probar el movimiento
        token.on('pointerdown', () => {
            this.handlePlayerClick(id);
        });
        //

        this.players.push({ model, token });
    }

    private emitInitialPlayers() {
        const playerInitData = this.players.map(p => {
            const cssColor = '#' + p.model.color.toString(16).padStart(6, '0');

            return {
                id: p.model.id,
                name: p.model.name,
                color: cssColor,
                balance: p.model.balance
            };
        });

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
    }
    //

    private handleDiceRoll() {
        if (this.isRolling) return;
        this.isRolling = true;

        const dice1 = create3DDice(960 - 220, 540, this, 1000);
        const dice2 = create3DDice(960, 540, this, 1150); 
        const dice3 = create3DDice(960 + 220, 540, this, 1300);

        let completedRolls = 0;
        let totalValue = 0;

        const checkDone = (val: number, diceObj: any) => {
            totalValue += val;
            completedRolls++;

            this.time.delayedCall(1500, () => {
                this.tweens.add({
                    targets: diceObj.mesh,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => {
                        diceObj.mesh.destroy();
                    }
                });
            });

            if (completedRolls === 3) {
                this.time.delayedCall(1900, () => {
                    try {
                    } catch (error) {
                        console.error("Error moving player:", error);
                    } finally {
                        this.isRolling = false; 
                    }
                });
            }
        };

        dice1.roll((val) => checkDone(val, dice1));
        dice2.roll((val) => checkDone(val, dice2));
        dice3.roll((val) => checkDone(val, dice3));
    }
}
