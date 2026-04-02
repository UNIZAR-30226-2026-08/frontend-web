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

import { DiceManager } from '../managers/DiceManager';

import { SoundId } from '@/context/AudioContext';

import { CameraController } from '../utils/CameraController';
import { BoardEffects } from '../utils/BoardEffects';
import { AnimationManager } from '../managers/AnimationManager';


const CORNER_VISUALS: Map<Function, CornerTileContent> = new Map ([
	[GoToJailTile, { image: 'images/bodyguard.png', tileText: 'Ve a Secretaría', buttonText: 'Aceptar', sound: 'jail_door'}],
	[JailTile, { image: 'images/secretary.png', tileText: 'Secretaría', buttonText: 'Comenzar turno', sound: 'jail_turn_in'}],
	[ParkingTile, { image: 'images/caravan.png', tileText: 'Parking Gratuito', buttonText: 'Recoger dinero', sound: 'parking'}],
	[TramTile, { image: 'icons/tram.svg', tileText: 'Tranvía', buttonText: 'Gestionar desplazamiento', sound: 'tram_bell'}],
]);


export class Board extends Phaser.Scene {
    private tiles: Tile[] = [];
    private players: { model: PlayerModel, token: PlayerToken }[] = [];
    private colorPalette: number[] = [];
    private fantasyCards: any[] = []; // TODO: rellenar con data/fantasyCard.json o recibir de backend
    private cameraController!: CameraController; // TODO: para las cámaras
    private diceManager!: DiceManager;
    private localPlayerId: string | null = null;

    // kinda global (handlePlayerClick)
    private selectedPlayer: { model: PlayerModel, token: PlayerToken } | null = null;

    // Para animaciones
    private animationManager!: AnimationManager;
    private pendingParkingData: { tile: Tile, playerId: string } | null = null;
    private pendingBillData: { playerId: string, bills: number , amount: string } | null = null;

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
        this.load.video('background_video', 'videos/game_background.webm');
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
        
        const { width, height } = this.scale;

        this.animationManager = new AnimationManager(this);
        this.diceManager = new DiceManager(this);
        
        const bgVideo = this.add.video(width / 2, height / 2, 'background_video');
        bgVideo.setOrigin(0.5, 0.5);
        bgVideo.setDepth(-100);

        const resizeVideo = (screenWidth: number, screenHeight: number) => {
            const videoW = bgVideo.width;
            const videoH = bgVideo.height;

            if (videoW === 0 || videoH === 0) return; 

            const scaleX = screenWidth / videoW;
            const scaleY = screenHeight / videoH;
            
            const scale = Math.max(scaleX, scaleY); 
            
            bgVideo.setScale(scale);
            bgVideo.setPosition(screenWidth / 2, screenHeight / 2);
        };

        bgVideo.on('play', () => {
            resizeVideo(this.scale.width, this.scale.height);
        });

        bgVideo.play(true);

        this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            resizeVideo(gameSize.width, gameSize.height);
        }, this);

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

        // Evento para que camara vuelva a la vista general ----------------------------
        EventBus.on('close-overlay', () => {
            this.cameraController.resetView(2000);
            this.time.delayedCall(2000, () => {
                this.showUI();

                if (this.pendingBillData) {
                    this.animationManager.BillAnimation(this.pendingBillData.playerId, 15, this.pendingBillData.amount);
                    this.pendingBillData = null;
                }
                if (this.pendingParkingData) {
                    this.animationManager.CoinAnimation(
                        this.pendingParkingData.tile, 
                        this.pendingParkingData.playerId,
                        this.players
                    );
                    this.pendingParkingData = null; 
                }
            });
        });

        // DEBUG: para animacion dinero  ----------------------------
        const debugKeys = ['ONE', 'TWO', 'THREE', 'FOUR'];
        debugKeys.forEach((key, index) => {
            this.input.keyboard?.on(`keydown-${key}`, () => {
                const id = `000${index + 1}`;
                console.log(`[DEBUG] Test HUD Pos ${id}`);
                this.animationManager.BillAnimation(id, 6, "-1100M");
            });
        });

        // DEBUG: para propuesta de tradeo ----------------------------
        this.input.keyboard?.on('keydown-T', () => {
            console.log("simulando propuesta...");
            
            const mockProposal = { // TODO: pasar propiedades bien 
                offeringPlayer: this.players[0],
                offeredMoney: 500,
                askedMoney: 0,
                offeredProperties: ["005", "007"],
                askedProperties: ["012"],
            };

            EventBus.emit('show-trade-request', mockProposal);
        });
    }

    public hideUI() {
        EventBus.emit('hide-players-hud');
        EventBus.emit('hide-controls-hud');
    }

    public showUI() {
        EventBus.emit('show-players-hud');
        EventBus.emit('show-controls-hud');
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

    public announceTurn(playerName: string, playerColor: string): Promise<void> {
        // Estoy prometiendo que voy a acabar
        return new Promise((resolve) => {
            EventBus.emit('show-banner', {
                message: `¡Turno de ${playerName}!`,
                color: playerColor
            });

            this.time.delayedCall(2500, () => {
                EventBus.emit('hide-banner');
                resolve();
            });
        });
    }

    public showToast(message: string, duration?: number) {
        EventBus.emit('show-toast', { message, duration });
    }

    public playSecretaryCutscene(): Promise<void> {
        return new Promise((resolve) => {
            this.hideUI();

            const onComplete = () => {
                EventBus.off('secretary-animation-complete', onComplete); 
                this.showUI();
                resolve();
            };

            EventBus.on('secretary-animation-complete', onComplete);
            EventBus.emit('play-secretary-animation');
        });
    }

    // TODO: Esto es solo para probar el movimiento (async !!!!!)
    private async handlePlayerClick(playerId: string) {
        const p = this.players.find(pair => pair.model.id === playerId);
        if (!p) return;
        
        this.selectedPlayer = p;
    
        const currentIndex = this.tiles.findIndex(t => t.tileConfig.id === p.model.currentTileId);

        const hopIndex = (currentIndex + 1) % this.tiles.length;
        const hopTile = this.tiles[hopIndex];

        // DEBUG: pasa por 'todas' las casillas
        // const nextIndex = (currentIndex + 3) % this.tiles.length;
        // const targetTile = this.tiles[nextIndex];
        // const nextTileId = targetTile.tileConfig.id;

        // DEBUG: va a la casilla dependiendo del tipo
        const targetIndex = this.tiles.findIndex(t => t instanceof GoToJailTile);
        const targetTile = this.tiles[targetIndex];
        const nextTileId = targetTile.tileConfig.id;
        
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

        this.hideUI();

        const cssColor = '#' + p.model.color.toString(16).padStart(6, '0');

        // await this.playSecretaryCutscene();
        await this.announceTurn(p.model.name, cssColor); // Ojo con el await, que hace falta

        // p.model.move(nextTileId);

        // p.token.moveTo(path, () => {
        //     this.checkTileLogic(p.model, targetTile);
        // });

        this.cameraController.followToken(p.token, 2.2, () => {
            p.model.move(nextTileId);
            p.token.moveTo(path, () => {
                this.time.delayedCall(800, () => {
                    this.checkTileLogic(p.model, targetTile);
                });
            });
        });

        // this.showToast(`¡${p.model.name} ha comprado la casilla!`);
    }

    public async sendToSecretary(playerId: string) {
        const p = this.players.find(pair => pair.model.id === playerId);
        const jailTile = this.tiles.find(t => t instanceof JailTile);
        
        if (!p || !jailTile) return;
     
        await this.playSecretaryCutscene();

        const othersCount = this.players.filter(other => 
            other.model.id !== playerId && 
            other.model.currentTileId === jailTile.tileConfig.id
        ).length;
     
        let finalX = jailTile.x;
        let finalY = jailTile.y;
     
        if (othersCount > 0) {
            const spacing = 22;
            finalX += (othersCount % 2 === 0) ? spacing : -spacing;
            finalY += (othersCount > 1) ? spacing : -spacing;
        }
     
        p.model.currentTileId = jailTile.tileConfig.id; 

        p.token.setAlpha(0);
        
        p.token.setPosition(finalX, finalY - 600);

        this.cameraController.focusOnTile(jailTile, 2.2);

        this.tweens.add({
            targets: p.token,
            alpha: 1,
            duration: 100, 
        });
     
        this.tweens.add({
            targets: p.token,
            y: finalY,
            ease: 'Bounce.easeOut',
            duration: 600,
            onComplete: () => {
                // TODO: A ver si podemos poner algun sonidito
                // this.checkTileLogic(p.model, jailTile); (NO HAGO LA LOGICA DE CAER EN NUEVA CASILLA)
            }
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
                id: tileConfig.id,
				title: tileConfig.name,
				typeName: 'Servidor',
				image:'images/server.png', // TODO override tileConfig.icon
				price: 80,
				rent: rent,
				mortgage: 100,
				isMortgaged: false,	// Pruebecitas TODO JULIA
				isAvailable: true,
				hasAll: 'all',
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0'),
			});
		}

		else if (tile instanceof BridgeTile) {
			const rent = {one:50,all:100}
			const tileConfig = tile.tileConfig as IServerTile;
			EventBus.emit('show-service-card', {
                id: tileConfig.id,
				title: tileConfig.name,
				typeName: 'Puente',
				image:'icons/bridge.svg', // TODO override tileConfig.icon
				price: 80,
				rent: rent,
				mortgage: 100,
				isMortgaged: false,	// Pruebecitas TODO JULIA
				isAvailable: true,
				hasAll: 'one',
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0'),
			});
		}

        else if (tile instanceof GoToJailTile) {
            this.sendToSecretary(player.id);
        }

		else if (tile instanceof StartTile) {}
        
		else {
			const cornerConfig = CORNER_VISUALS.get(tile.constructor);
		        EventBus.emit('show-corner-tile', {
				image: cornerConfig.image,
				tileText: cornerConfig.tileText,
				buttonText: cornerConfig.buttonText,
				sound: cornerConfig.sound,
				id: tile.tileConfig.id
			});
		}
    }

    private handleDiceRoll() {
		// if (debugInJail) {
        this.diceManager.handleJailDiceRoll(this.tiles, this.players, [1, 1]);
		this.time.delayedCall(1000, () => { // wait for dice to stop rolling
			EventBus.emit('open-in-jail-overlay',{tileList:["104","107"]}); // could go
			//EventBus.emit('open-in-jail-overlay',["104"]); // forced to leave jail
		});
		// else {
        // this.diceManager.handleDiceRoll(this.tiles, this.players, [1, 2, 6]);

		// not clicking anything
        // this.time.delayedCall(8000, () => {
        //     EventBus.emit('clear-dice');
        // });
    }

    // Marcador para cada casilla que compra un player 
    private handlePurchase (data: { tileId: string, playerColor: string }) {
        console.log("Recibida compra:", data);
        const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);
        if (tile) {
            const colorNum = parseInt(data.playerColor.startsWith('#')  ? data.playerColor.replace('#', '0x') : data.playerColor);
                    
            if (tile instanceof PropertyTile) {
                tile.setOwnerMarker(colorNum);
            } else if (tile instanceof ServerTile) {
                console.log("Entro");
                tile.setOwnerMarker(colorNum);
            } else if (tile instanceof BridgeTile) {
                tile.setOwnerMarker(colorNum);
            }
        } else {
            console.warn("No se encontró la casilla con ID:", data.tileId);
        }
    }

    private setupEventListeners() {

        // Trading overlay
        EventBus.on('start-selection-mode', (data: { ownerId: string, propertyIds: string[]}) => {
            
            BoardEffects.setFocusByIds(this.tiles, data.propertyIds, this, this.players);

            this.tiles.forEach(tile => {
                if (data.propertyIds.includes(tile.tileConfig.id)) {
                    tile.setInteractive({ useHandCursor: true });
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

        // Evento para mostrar casillas cuando se pulsa el boton de administrar
        EventBus.on('open-property-selection-mode', (propertyIds: string[]) => {
            BoardEffects.setFocusByIds(this.tiles, propertyIds, this, []);
            this.tiles.forEach(tile => {

                if (propertyIds.includes(tile.tileConfig.id)) {
                    tile.removeAllListeners('pointerdown');

                    tile.once('pointerdown', () => {
                        BoardEffects.setFocusByIds(this.tiles, null, this, this.players);
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
        
        // Evento para oscurecer tablero (active = true)
        EventBus.on('dark-mode', (active: boolean = true) => {
            if (active) {
                // Oscurece todo el tablero
                BoardEffects.setFocusByIds(this.tiles, [], this, this.players);
            } else {
                // Limpia oscurecimiento
                BoardEffects.setFocusByIds(this.tiles, null, this, this.players);
            }
        });

        // light up trams and wait for clicks
		EventBus.on('start-tram-selection', () => {
			const tramTiles = this.tiles.filter(t => t instanceof TramTile);
			const tramTileIds = tramTiles.map(t => t.tileConfig.id);
            
			BoardEffects.setFocusByIds(this.tiles, tramTileIds, this, this.players);

			this.tiles.forEach(tile => {
				if (tramTileIds.includes(tile.tileConfig.id)) {
					tile.setInteractive({ useHandCursor: true });
					tile.removeAllListeners('pointerdown');

					tile.once('pointerdown', () => {
						const tramConfig = tile.tileConfig as ITramTile;

						EventBus.emit('tram-tile-selected', {
							id: tramConfig.id,
							name: tramConfig.name
						});

						// disable focus after click
						BoardEffects.setFocusByIds(this.tiles, null, this, this.players);
					});
				} else {
					tile.disableInteractive();
				}
			});
		});

        EventBus.on('execute-tram-travel', (data: {targetId: string, cost: number}) => {
        	const p = this.selectedPlayer;
			const targetTile = this.tiles.find(t => t.tileConfig.id === data.targetId);

			const path = [{ x: targetTile.x, y: targetTile.y }];
			p.token.moveTo(path, () => {
				// this.time.delayedCall(800, () => {
				// 	  this.checkTileLogic(p.model, targetTile); // INFINITE LOOP
				// });
			});

			// unset interactiveness of tram tiles
			const tramTiles = this.tiles.filter(t => t instanceof TramTile);
			tramTiles.forEach(tile => {
				tile.disableInteractive();
			});
		});

 		EventBus.on('start-in-jail-selection', (data: { tileList: string[]} ) => { // List of tile IDs (string)
			//const goableTiles = this.tiles.filter(t => data.tileList.includes(t.tileConfig.id));
            
			BoardEffects.setFocusByIds(this.tiles, data.tileList, this, this.players);

			this.tiles.forEach(tile => {
				if (data.tileList.includes(tile.tileConfig.id)) {
					tile.setInteractive({ useHandCursor: true });
					tile.removeAllListeners('pointerdown');

					tile.once('pointerdown', () => {
						const tileConfig = tile.tileConfig;

						EventBus.emit('in-jail-tile-selected', {
							id: tileConfig.id,
							name: tileConfig.name
						});

						// disable focus after click
						BoardEffects.setFocusByIds(this.tiles, null, this, this.players);
					});
				} else {
					tile.disableInteractive();
				}
			});
		});

        EventBus.on('execute-in-jail-travel', (data: {targetId: string }) => {
        	const p = this.selectedPlayer;
			const targetTile = this.tiles.find(t => t.tileConfig.id === data.targetId);

			const path = [{ x: targetTile.x, y: targetTile.y }];
			p.token.moveTo(path, () => {
				 this.time.delayedCall(800, () => {
				 	this.checkTileLogic(p.model, targetTile);
				 });
			});
		});

        EventBus.on('make-tiles-unclickable', (data: { tileList: string[]}) => { // list of strings (tile IDs)
			const setTiles = this.tiles.filter(t => data.tileList.includes(t.tileConfig.id));
			setTiles.forEach(tile => {
				tile.disableInteractive();
			});
        	EventBus.emit('clear-dice');
		});

      
        // Construir casas/hoteles
        EventBus.on('execute-property-build', (data: { tileId: string, level: string, isMortgaged: boolean }) => {
            const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);
            
            if (tile && tile instanceof PropertyTile) {
                // Mapeamos el string del Overlay a un número para el método setConstructionLevel
                const levelMap: Record<string, number> = {
                    'base': 0, 'house1': 1, 'house2': 2, 'house3': 3, 'house4': 4, 'hotel': 5
                };
                const numericLevel = levelMap[data.level] ?? 0;
                tile.setConstructionLevel(numericLevel);
            }
        });

        // Cuando se cae en parking, animacion dinero 
        EventBus.on('collect-parking-money', (data: { currentTileId: string }) => {
            const parkingTile = this.tiles.find(t => t.tileConfig.id === data.currentTileId);
            const currentPlayer = this.getLocalPlayer();

            if (parkingTile && currentPlayer) {
                this.pendingParkingData = { 
                tile: parkingTile, 
                playerId: currentPlayer.model.id };
            }
        });

        EventBus.on('animate-bill', (data: { playerId: string, amount?: string }) => {
            this.animationManager.BillAnimation(data.playerId, 15, data.amount);
        });
    }

}
