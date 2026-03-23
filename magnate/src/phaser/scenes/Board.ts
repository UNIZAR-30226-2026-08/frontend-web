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
import { create3DDiceBus } from '../objects/DiceBus3D';

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
    private isRolling: boolean = false;
    private localPlayerId: string | null = null;

    constructor() {
        super({ key: 'BoardScene' });
    }

    init(data: { myPlayerId?: string }) {
        if (data && data.myPlayerId) {
            this.localPlayerId = data.myPlayerId;
        } else {
            this.localPlayerId = "0003"; 
        }
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
        this.load.image("dice-bus-albedo", "dice-bus-albedo.png");
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
        this.setupEventListeners();
        
        EventBus.on('close-overlay', () => { // Evento para que camara vuelva a la vista general
            this.cameraController.resetView(2000);
        });
    }

    createPlayer(id: string, name: string) {
        // const startTile = this.tiles[0];
        const startTile = this.tiles[this.players.length % this.colorPalette.length];
        
        const colorIndex = this.players.length % this.colorPalette.length;
        const assignedColor = this.colorPalette[colorIndex];

        const model = new PlayerModel(id, name, assignedColor);
        const token = new PlayerToken(this, startTile.x, startTile.y, assignedColor);

        token.setDepth(200 + this.players.length);

        // TODO: Esto es solo para probar el movimiento
        token.on('pointerdown', () => {
            this.handlePlayerClick(id);
            //this.handlePlayerClickDebug(id); // Para debugear si quiero enviarlo a una casilla en concreto
        });

        this.players.push({ model, token });
    }

    public getLocalPlayer() {
        if (!this.localPlayerId) return null;
        return this.players.find(p => p.model.id === this.localPlayerId) || null;
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
    
        const currentIndex = this.tiles.findIndex(t => t.tileConfig.id === p.model.currentTileId);
        
        const hopIndex = (currentIndex + 1) % this.tiles.length;
        const hopTile = this.tiles[hopIndex];

        const nextIndex = (currentIndex + 2) % this.tiles.length;
        const targetTile = this.tiles[nextIndex];
        const nextTileId = targetTile.tileConfig.id;

        //const targetIndex = this.tiles.findIndex(t => t instanceof GoToJailTile); // Debug Julia
        
        const othersCount = this.players.filter(other => 
            other.model.id !== playerId && 
            other.model.currentTileId === nextTileId
        ).length;

        let finalX = targetTile.x;
        let finalY = targetTile.y;

        if (othersCount > 0) {
            const spacing = 22;
            finalX += (othersCount % 2 === 0) ? spacing : -spacing;
            finalY += (othersCount > 1) ? spacing : -spacing;
        }

        const path = [
            { x: hopTile.x, y: hopTile.y },
            { x: finalX, y: finalY }
        ];
        
        // this.cameraController.followToken(p.token, 2.2);

        // p.model.move(nextTileId);

        // p.token.moveTo(path, () => {
        //     this.checkTileLogic(p.model, targetTile);
        // });
        const tileRotation = targetTile.tileConfig.rotation || 0; // TODO: revisar giro de la cámara dependiendo de la rotación de la ficha

        this.cameraController.followToken(p.token, 2.2, tileRotation, () => {
            p.model.move(nextTileId);
            p.token.moveTo(path, () => {
                this.time.delayedCall(800, () => {
                    this.checkTileLogic(p.model, targetTile);
                });
            });
        });
    }

    // Método para debug, se envía a la primera casilla de un tipo específico
    // public handlePlayerClickDebug(playerId: string) {
    //     const p = this.players.find(pair => pair.model.id === playerId);
    //     if (!p) return;

    //     // Buscamos la primera casilla de tipo __
	// 	const fantasyIndex = this.tiles.findIndex(t => t instanceof PropertyTile);
    //     p.model.currentTileIndex = fantasyIndex;
        
    //     const targetTile = this.tiles[fantasyIndex];


    //     p.token.moveTo(targetTile.x, targetTile.y);

    //     // Ejecutamos la lógica de la casilla
    //     this.time.delayedCall(500, () => {
    //         this.checkTileLogic(p.model, targetTile);
    //     });
    // }
    
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

        EventBus.emit('play-sfx', 'dice_shake');

        BoardEffects.setFocusByIds(this.tiles, [], this);

        const dice1 = create3DDice(960 - 220, 540, this, 1000);
        const dice2 = create3DDice(960, 540, this, 1150); 
        const dice3 = create3DDiceBus(960 + 220, 540, this, 1300);

        dice1.mesh.setDepth(99999);
        dice2.mesh.setDepth(99999);
        dice3.mesh.setDepth(99999);

        let completedRolls = 0;
        let val1 = 0;
        let val2 = 0;
        let val3 = 0;

        const checkDone = () => {
            completedRolls++;

            if (completedRolls === 3) {
                this.time.delayedCall(1000, () => {
                    const bgX = 40;
                    const bgY = 40;
                    const diceBg = this.add.graphics();
                    diceBg.fillStyle(0x000000, 0.7);
                    diceBg.fillRoundedRect(bgX, bgY, 300, 100, 16);
                    diceBg.setDepth(99998);
                    diceBg.setScrollFactor(0);
                    diceBg.setAlpha(0);

                    this.tweens.add({
                        targets: diceBg,
                        alpha: 1,
                        duration: 400
                    });

                    const scaleFactor = 0.4;
                    const moveDuration = 800;

                    const moveDiceToCorner = (dieObj: any, targetX: number, targetY: number, onCompleteCallback?: () => void) => {
                        this.tweens.add({
                            targets: dieObj.mesh,
                            x: targetX,
                            y: targetY,
                            scaleX: dieObj.mesh.scaleX * scaleFactor,
                            scaleY: dieObj.mesh.scaleY * scaleFactor,
                            scaleZ: dieObj.mesh.scaleZ * scaleFactor,
                            duration: moveDuration,
                            ease: 'Cubic.easeOut',
                            onComplete: onCompleteCallback
                        });
                    };

                    EventBus.emit('play-sfx', 'dice_throw');

                    moveDiceToCorner(dice1, bgX + 60, bgY + 50);
                    moveDiceToCorner(dice2, bgX + 150, bgY + 50);
                    
                    moveDiceToCorner(dice3, bgX + 240, bgY + 50, () => {
                        try {
                            const myPlayer = this.getLocalPlayer();
                            if (myPlayer) {
                                // DEBUG
                                BoardEffects.setFocusByIds(this.tiles, ["003", "006", "009"], this);
                            }
                        } catch (error) {
                            console.error(error);
                        } finally {
                            this.time.delayedCall(3000, () => {
                                this.tweens.add({
                                    targets: [diceBg, dice1.mesh, dice2.mesh, dice3.mesh],
                                    alpha: 0,
                                    duration: 500,
                                    onComplete: () => {
                                        diceBg.destroy();
                                        dice1.mesh.destroy();
                                        dice2.mesh.destroy();
                                        dice3.mesh.destroy();
                                        
                                        BoardEffects.setFocusByIds(this.tiles, null, this);
                                        this.isRolling = false; 

                                        EventBus.emit('dice-roll-complete');
                                    }
                                });
                            });
                        }
                    });
                });
            }
        };

        dice1.roll((val) => { val1 = val; checkDone(); });
        dice2.roll((val) => { val2 = val; checkDone(); });
        dice3.roll((val) => { val3 = val; checkDone(); });
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
        // cuando entramos en modo trade
        EventBus.on('start-selection-mode', (data: { ownerId: string, propertyIds: string[]}) => {
            BoardEffects.setFocusByIds(this.tiles, data.propertyIds, this);
            this.tiles.forEach(tile => {

                if (data.propertyIds.includes(tile.tileConfig.id)) {
                    tile.removeAllListeners('pointerdown');

                    tile.once('pointerdown', () => {
                        // TODO: esto viene del backend o tendremos que añadirlo a cada property
    
                        const propConfig = tile.tileConfig as IPropertyTile;
                        
                        EventBus.emit('tile-added-to-trade', {
                            id: propConfig.id,
                            name: propConfig.name,
                            color: propConfig.color || '#cbd5e1'
                        });
                    });
                } else {
                    tile.disableInteractive();
                }
            });
        });

        // Limpia el tablero y bloquea clicks de selección
        EventBus.on('stop-selection-mode', () => {
            BoardEffects.setFocusByIds(this.tiles, null, this);
        });

        // brillan las de un grupo
        EventBus.on('highlight-group', (groupIds: string[]) => {
            BoardEffects.setFocusByIds(this.tiles, groupIds, this);
        });

        // Evento para mostrar casillas cuando se pulsa el boton de administrar
        EventBus.on('open-property-selection-mode', (propertyIds: string[]) => {
            BoardEffects.setFocusByIds(this.tiles, propertyIds, this);
            this.tiles.forEach(tile => {

                if (propertyIds.includes(tile.tileConfig.id)) {
                    tile.removeAllListeners('pointerdown');

                    tile.once('pointerdown', () => {
                        BoardEffects.setFocusByIds(this.tiles, null, this);
                        // TODO: esto viene del backend o tendremos que añadirlo a cada property
                        const rentValues = {base: 50, house1: 200, house2: 300, house3: 400, house4: 500, hotel: 800 };
                        const propConfig = tile.tileConfig as IPropertyTile;
                        
                        EventBus.emit('open-property-management', { 
                            data: {
                                ...tile.tileConfig,
                                headerColor: propConfig.color || '#FFFFFF' ,
                                rent: rentValues,
                                housePrice: 20,
                            }
                        });
                    });
                } else {
                    tile.disableInteractive();
                }
            });
        });

        EventBus.on('dark-mode', () => {
            BoardEffects.setFocusByIds(this.tiles, [], this); // oscurece tablero
            this.players.forEach(p => p.token.setAlpha(0.3).setDepth(1)); // oscurece fichas
        });

    }
}

