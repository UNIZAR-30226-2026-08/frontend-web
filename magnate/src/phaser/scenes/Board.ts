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

import { CornerTileContent } from '@/components/layout/CornerLayout';

import { PlayerModel } from '../models/PlayerModel';
import { PlayerToken } from '../objects/PlayerToken';
import { EventBus } from '@/EventBus'

import { create3DDice } from '../objects/Dice3D';

import { SoundId } from '@/context/AudioContext';

const CORNER_VISUALS: Map<Function, CornerTileContent> = new Map ([
	[GoToJailTile, { image: 'images/bodyguard.png', tileText: 'Ve a Secretaría', buttonText: 'Aceptar', sound: 'jail_door'}],
	[JailTile, { image: 'images/secretary.png', tileText: 'Secretaría', buttonText: 'Comenzar turno', sound: 'jail_turn_in'}],
	[ParkingTile, { image: 'images/caravan.png', tileText: 'Parking Gratuito', buttonText: 'Recoger dinero', sound: 'parking'}],
	[TramTile, { image: 'icons/tram.svg', tileText: 'Tranvía', buttonText: 'Gestionar desplazamiento', sound: 'tram_bell'}],
]);
import { CameraController } from '../utils/CameraController';
import { BoardEffects } from '../utils/BoardEffects';

export class Board extends Phaser.Scene {
    private tiles: Tile[] = [];
    private players: { model: PlayerModel, token: PlayerToken }[] = [];
    private colorPalette: number[] = [];
    private fantasyCards: any[] = []; // TODO: rellenar con data/fantasyCard.json o recibir de backend
    private cameraController!: CameraController; // TODO: para las cámaras

    constructor() {
        super({ key: 'BoardScene' });
    }

    preload() { // precargar imagenes...
        this.load.image('background', 'images/background_ingame.png');
        this.load.json('board', 'data/board.json');
        this.load.json('fantasyCards', 'data/fantasyCard.json');
        this.load.image('hat', 'images/hat.png'); // fantasy tiles
        this.load.image('tram', 'images/tram.png'); // tram tiles
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
        const fullFantasy = this.cache.json.get('fantasyCards');
        this.fantasyCards = fullFantasy.fantasy;

        const background = this.add.image(960, 540, 'background');
        background.setDisplaySize(1920, 1080);

        const rawColors = fullData.playerColors as string[];
        this.colorPalette = rawColors.map(c => parseInt(c.replace('#', '0x')));

        this.cameraController = new CameraController(this);

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
            // TODO: para las cámaras
            // tile.setSize(100, 100); 
            // tile.setInteractive();
            
            // tile.on('pointerdown', () => {
            //     console.log("Enfocando casilla:", config.name);
            //     this.cameraController.focusOnTile(tile, 2)
            // });
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

        // Evento para marcar quien compra propiedad  ----------------------------
        EventBus.on('property-bought', this.handlePurchase, this);

        
        //------------------------------------------------- Para debugear trading: no borrar
        // const debugTradeBtn = this.add.container(150, 180);

        // const rectTrade = this.add.rectangle(0, 0, 200, 50, 0xff8800, 1)
        //     .setInteractive({ useHandCursor: true });

        // const txtTrade = this.add.text(0, 0, 'DEBUG: trading', { 
        //     color: '#ffffff', 
        //     fontSize: '18px',
        // }).setOrigin(0.5);

        // debugTradeBtn.add([rectTrade, txtTrade]);
        // debugTradeBtn.setDepth(10001);
        // debugTradeBtn.setScrollFactor(0);

        // rectTrade.on('pointerdown', () => {
        //     if (this.players.length >= 2) {
        //         const tradePayload = {
        //             sender: this.players[0].model,
        //             allPlayers: this.players.map(p => ({ 
        //                 id: p.model.id, 
        //                 name: p.model.name, 
        //                 color: '#' + p.model.color.toString(16).padStart(6, '0') 
        //             }))
        //         };
        //         EventBus.emit('open-trade', tradePayload);  
        //     }
        // });
        //------------------------------------------------- Para debugear admin: no borrar
        // const debugTradeBtn2 = this.add.container(150, 120);

        // const rectTrade2 = this.add.rectangle(0, 0, 200, 50, 0xff8800, 1)
        //     .setInteractive({ useHandCursor: true });

        // const txtTrade2 = this.add.text(0, 0, 'DEBUG: admin', { 
        //     color: '#ffffff', 
        //     fontSize: '18px',
        // }).setOrigin(0.5);

        // debugTradeBtn2.add([rectTrade2, txtTrade2]);
        // debugTradeBtn2.setDepth(10001);
        // debugTradeBtn2.setScrollFactor(0);

        // rectTrade2.on('pointerdown', () => {
            
        //     const rentValues = {base: 50, house1: 200, house2: 300, house3: 400, house4: 500, hotel: 800 };
            
        //     EventBus.emit('open-property-management', {
        //         data: {
        //             id: "001",
        //             name: "ITA",
        //             headerColor: '#885626', 
        //             price: 100,
        //             rent: rentValues,
        //             mortgage: 100,
        //             housePrice: 20,
        //             isMortgaged:  false,
        //             constructionLevel: 'base'
        //         }
        //     });
        // });
        //-------------------------------------------------
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
            //this.handlePlayerClickDebug(id); // Para debugear si quiero enviarlo a una casilla en concreto
        });

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
		//const targetIndex = this.tiles.findIndex(t => t instanceof GoToJailTile); // Debug Julia
        
        //this.cameraController.followToken(p.token, 1.2);

        const othersCount = this.players.filter(other => 
            other.model.id !== playerId && 
            other.model.currentTileIndex === targetIndex
        ).length;

        const targetTile = this.tiles[targetIndex];
        // targetTile.setOwnerMarker(p.model.color);
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

        // Buscamos la primera casilla de tipo __
		const fantasyIndex = this.tiles.findIndex(t => t instanceof PropertyTile);
        p.model.currentTileIndex = fantasyIndex;
        
        const targetTile = this.tiles[fantasyIndex];


        p.token.moveTo(targetTile.x, targetTile.y);

        // Ejecutamos la lógica de la casilla
        this.time.delayedCall(500, () => {
            this.checkTileLogic(p.model, targetTile);
        });
    }
    
    private checkTileLogic(player: PlayerModel, tile: Tile) {
        
        if (tile instanceof FantasyTile) {
            // TODO: Vendrá del backend
            const cartasFantasia = [
                { title: "Concurso de Postales EINA", description: "Ganaste el concurso anual de postales navideñas de la EINA. Tu premio: 150€.", price: 130 }
            ];
            
            const cartaAleatoria = Phaser.Utils.Array.GetRandom(cartasFantasia);

            // Evento hacia react
            EventBus.emit('show-fantasy-card', {
                ...cartaAleatoria,
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0')
            });
        }
        
		else if (tile instanceof PropertyTile) {

            const propConfig = tile.tileConfig as IPropertyTile;
            // TODO: Vendrá del backend?
            const rentValues = {base: 50, house1: 200, house2: 300, house3: 400, house4: 500, hotel: 800};
            const playersData = this.players.map(p => ({
                id: p.model.id,
                name: p.model.name,
                color: '#' + p.model.color.toString(16).padStart(6, '0'),
            }));

            EventBus.emit('show-property-card', {
                id: propConfig.id,
                name: propConfig.name,
                headerColor: propConfig.color || '#FFFFFF', 
                price: 100,
                rent: rentValues,
                mortgage: 100,
                housePrice: 20,
                players: playersData, // Para los resultados de la subasta
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0'),
				isMortgaged: false, 		// Pruebecitas TODO JULIA
				isAvailable: true, 		// Pruebecitas TODO JULIA
				constructionLevel: 'house1',	// Pruebecitas TODO JULIA
            });
        }

		else if (tile instanceof ServerTile) {
			const rent = {one:50,all:100}
			const tileConfig = tile.tileConfig as IServerTile;
			EventBus.emit('show-service-card', {
				title: tileConfig.name,
				typeName: 'Servidor',
				image:'images/server.png', // TODO override tileConfig.icon
				price: 80,
				rent: rent,
				mortgage: 100,
				isMortgaged: false,	// Pruebecitas TODO JULIA
				isAvailable: true,
				hasAll: 'all'
			});
		}

		else if (tile instanceof BridgeTile) {
			const rent = {one:50,all:100}
			const tileConfig = tile.tileConfig as IServerTile;
			EventBus.emit('show-service-card', {
				title: tileConfig.name,
				typeName: 'Puente',
				image:'icons/bridge.svg', // TODO override tileConfig.icon
				price: 80,
				rent: rent,
				mortgage: 100,
				isMortgaged: false,	// Pruebecitas TODO JULIA
				isAvailable: true,
				hasAll: 'one'
			});
		}

		else if (tile instanceof StartTile) {}

		else {
			const cornerConfig = CORNER_VISUALS.get(tile.constructor);
            EventBus.emit('show-corner-tile', {
				image: cornerConfig.image,
				tileText: cornerConfig.tileText,
				buttonText: cornerConfig.buttonText,
				sound: cornerConfig.sound
			});
		}

    }

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

    // Marcador para cada casilla que compra un player 
    private handlePurchase (data: { tileId: string, playerColor: string }) {
        const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);

            if (tile) {
                const colorNum = parseInt(data.playerColor.startsWith('#')  ? data.playerColor.replace('#', '0x') : data.playerColor);
                        
                // TODO: añadir server, bridge
                if (tile instanceof PropertyTile) {
                    tile.setOwnerMarker(colorNum);
                }
            }
    }

    private setupEventListeners() {
        // Cuando entramos en modo selección (Trade)
        EventBus.on('start-selection-mode', (data: { ownerId: string, propertyIds: string[] }) => {
            // Solo brillan las propiedades que el jugador posee actualmente
            BoardEffects.setFocusByIds(this.tiles, data.propertyIds, this);
        });

        // cancelamos
        EventBus.on('stop-selection-mode', () => {
            BoardEffects.setFocusByIds(this.tiles, null, this);
        });

        // brillan las de un grupo
        EventBus.on('highlight-group', (groupIds: string[]) => {
            BoardEffects.setFocusByIds(this.tiles, groupIds, this);
    });
}
}

