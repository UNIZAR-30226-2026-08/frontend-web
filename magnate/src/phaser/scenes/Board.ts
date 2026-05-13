import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';
import { TileConfig, TileType, IPropertyTile, IFantasyTile, IBridgeTile, IServerTile, IStartTile, IGoToJailTile, IJailTile, IParkingTile, ITramTile, IVisitTile} from '../types/TileTypes';
import { PropertyTile } from '../objects/PropertyTile';
import { FantasyTile } from '../objects/FantasyTile';
import { BridgeTile } from '../objects/BridgeTile';
import { ServerTile } from '../objects/ServerTile';
import { StartTile } from '../objects/StartTile';
import { GoToJailTile } from '../objects/GoToJailTile';
import { JailTile } from '../objects/JailTile';
import { ParkingTile } from '../objects/ParkingTile';
import { TramTile } from '../objects/TramTile';
import { VisitTile } from '../objects/VisitTile';

import { PlayerModel } from '../models/PlayerModel';
import { PlayerToken } from '../objects/PlayerToken';
import { EventBus } from '@/EventBus'

import { DiceManager } from '../managers/DiceManager';

import { SoundId } from '@/context/AudioContext';

import { CameraController } from '../utils/CameraController';
import { BoardEffects } from '../utils/BoardEffects';
import { AnimationManager } from '../managers/AnimationManager';
import { TileLogicManager } from '../managers/TileLogicManager';
import { GameLogicManager } from '../managers/GameLogicManager';
import { EventManager } from '../managers/EventManager';

import * as WSTypes from "@/services/types/socket";

export class Board extends Phaser.Scene {
    
    private tiles: Tile[] = [];
	private players : { model: PlayerModel, token: PlayerToken }[] = [];
    private colorPalette: number[] = [];
    private fantasyCards: any[] = [];
    
    // -- Managers Visuales
    public diceManager!: DiceManager;
    public animationManager!: AnimationManager;
    public tileLogicManager!:  TileLogicManager;
    public cameraController!: CameraController;
    public eventManager!: EventManager;

    // -- Estado Global --
    private GamelogicManager!: GameLogicManager;
    private localPlayerId: string | null = null;
    public selectedPlayer: any | null = null;
    
    
    private pendingParkingData: { tile: Tile, playerId: string } | null = null;
    private pendingBillData: { playerId: string, numBills: number , amount: string } | null = null;
    private lastTurnPlayerId: string | null = null;

    private turnsLabel!: Phaser.GameObjects.Text;
    private turnsDisplay!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'BoardScene' });
    }

    init() {
        this.localPlayerId = localStorage.getItem('myId');
		this.GamelogicManager = GameLogicManager.getInstance();
    }

    preload() { // precargar imagenes...
        // this.load.video('background_video', 'videos/game_background.webm');
        this.load.image('background', 'images/fondo.png');
        this.load.json('board', 'data/board.json');
        this.load.json('money', 'data/money.json');
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
        this.initManagers();
        this.createBackground();
        this.createBoard();
        this.setupEventBus();
        this.createTurnsDisplay();

        const currentModel = this.GamelogicManager.model;
        console.log("BOARD CREATE: Comprobando jugadores iniciales", this.GamelogicManager.model.orderedPlayers);
        EventBus.emit('board-ready');
        // Check if GameLogicManager already has data
        if (currentModel && currentModel.orderedPlayers && currentModel.orderedPlayers.length > 0) {
            this.syncPlayers(this.GamelogicManager.model);
        }
    }

    private initManagers() {
        this.animationManager = new AnimationManager(this);
        this.diceManager = new DiceManager(this);
        this.tileLogicManager = new TileLogicManager(this);
        this.cameraController = new CameraController(this);
    }

    // private createBackground() { // Para video
    //     const { width, height } = this.scale;
    //     const bgVideo = this.add.video(width / 2, height / 2, 'background_video');
    //     bgVideo.setOrigin(0.5, 0.5);
    //     bgVideo.setDepth(-100);

    //     const resizeVideo = (screenWidth: number, screenHeight: number) => {
    //         const videoW = bgVideo.width;
    //         const videoH = bgVideo.height;

    //         if (videoW === 0 || videoH === 0) return; 

    //         const scaleX = screenWidth / videoW;
    //         const scaleY = screenHeight / videoH;
            
    //         const scale = Math.max(scaleX, scaleY); 
    //         bgVideo.setScale(scale);
    //         bgVideo.setPosition(screenWidth / 2, screenHeight / 2);
    //     };

    //     bgVideo.on('play', () => { resizeVideo(this.scale.width, this.scale.height); });
    //     bgVideo.play(true);

    //     this.scale.on('resize', (gameSize: Phaser.Structs.Size) => { resizeVideo(gameSize.width, gameSize.height); }, this);
    // }

    private createBackground() {
        const { width, height } = this.cameras.main;

        const bgImage = this.add.image(width / 2, height / 2, 'background');
        bgImage.setDepth(-100);

        const scaleX = width / bgImage.width;
        const scaleY = height / bgImage.height;
     
        const scale = Math.max(scaleX, scaleY);
        bgImage.setScale(scale);
    }

    private createBoard() { 
        const fullData = this.cache.json.get('board');
        const moneyData = this.cache.json.get('money');

        const priceMap = new Map();
        if (moneyData && moneyData.tiles) {
            moneyData.tiles.forEach((t: any) => {
                priceMap.set(String(t.id).padStart(3, '0'), t.buy_price);
            });
        }
        
        // Extraer colores para players
        const rawColors = fullData.playerColors as string[];
        this.colorPalette = rawColors.map(c => parseInt(c.replace('#', '0x')));

        const boardTiles = fullData.tiles as TileConfig[];
        const groups = fullData.groups as { group: number, color: string }[];
        
        const fullFantasy = this.cache.json.get('fantasyCards');
        this.fantasyCards = fullFantasy.fantasy;

        boardTiles.forEach((config: TileConfig) => {
            let tile: Tile;
            const normalizedId = String(config.id).padStart(3, '0');

            if (config.type === TileType.PROPERTY) {
                const propConfig = config as IPropertyTile;
                const groupInfo = groups.find(g => g.group === propConfig.group);
                propConfig.color = groupInfo ? groupInfo.color : '#FFFFFF';
                if (priceMap.has(normalizedId)) {
                    propConfig.price = priceMap.get(normalizedId);
                }
                tile = new PropertyTile(this, propConfig);
                
            } else if (config.type === TileType.FANTASY) {
                tile = new FantasyTile(this, config as IFantasyTile);
            } else if (config.type === TileType.BRIDGE) {
                const bridgeConfig = config as IBridgeTile;
                if (priceMap.has(normalizedId)) bridgeConfig.price = priceMap.get(normalizedId);
                tile = new BridgeTile(this, bridgeConfig);
            } else if (config.type === TileType.SERVER) {
                const serverConfig = config as IServerTile;
                if (priceMap.has(normalizedId)) serverConfig.price = priceMap.get(normalizedId);
                tile = new ServerTile(this, serverConfig);
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
            } else if (config.type === TileType.VISIT) {
                tile = new VisitTile(this, config as IVisitTile);
            } else {
                tile = new Tile(this, config);
            }
            this.tiles.push(tile);
        });

        this.eventManager = new EventManager(this, this.tiles, this.players);
    }

    // Funciones turnos en el tablero
    private createTurnsDisplay() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const baseStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'LTSuperior',
            color: '#ffffff',
            align: 'center'
        };

        this.turnsLabel = this.add.text(centerX, centerY - 60, 'TURNO', {
            ...baseStyle,
            fontSize: '40px',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.turnsLabel.setOrigin(0.5).setDepth(1);

        this.turnsDisplay = this.add.text(centerX, centerY + 20, '1 / 20', {
            ...baseStyle,
            fontSize: '60px',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.turnsDisplay.setOrigin(0.5).setDepth(1);

        EventBus.on('model-updated', (model: any) => {
            this.updateTurns(model.current_turn, 20);
        });
    }

    private updateTurns(current: number, max: number) {
        const newText = `${current} / ${max}`;
        
        if (this.turnsDisplay.text !== newText) {
            this.turnsDisplay.setText(newText);

            this.tweens.add({
                targets: [this.turnsLabel, this.turnsDisplay],
                scale: 1.1,
                duration: 200,
                yoyo: true,
                ease: 'Quad.easeInOut',
                onComplete: () => {
                    this.turnsLabel.setScale(1);
                    this.turnsDisplay.setScale(1);
                }
            });
        }
    }

    // --- EVENT BUS  ---
    private setupEventBus() {
        
        EventBus.on('model-updated', async (gameModel: any) => {
            // Sincronizamos quién está en la partida (Crear/Actualizar nombres)
            this.syncPlayers(gameModel);
            this.syncPropertiesOwnership(gameModel);
            this.syncBuildingsAndMortgages(gameModel);
            //this.syncPlayerPositions(gameModel);

            const parkingTile = this.tiles.find(t => t instanceof ParkingTile) as ParkingTile;
            if (parkingTile) {
                const currentParkingMoney = gameModel.getParkingMoney();
                parkingTile.updatePrice(currentParkingMoney);
            }

            const currentTurnId = gameModel.getCurrentTurnPlayerId();
            
            if (this.lastTurnPlayerId === null && currentTurnId) {
                this.lastTurnPlayerId = currentTurnId;
                this.updateTurns(gameModel.current_turn, 20);
                return;
            }

            if (this.lastTurnPlayerId !== currentTurnId) {
                if (this.lastTurnPlayerId === null) { // primer turno
                    gameModel.firstPlayerId = currentTurnId;
                } else if (currentTurnId === gameModel.firstPlayerId) {
                    gameModel.current_turn++;
                }
                this.updateTurns(gameModel.current_turn, 20);

                // banner de nuevo turno
                // const isFirstTurn = this.lastTurnPlayerId === null;
                this.lastTurnPlayerId = currentTurnId;
    
                // Algo de tiempo antes del primer turno
                // if (isFirstTurn) {
                //     this.time.delayedCall(800, async () => {
                //         await this.handleNewTurn(gameModel);
                //     });
                // }
            } else {
                this.handlePhaseLogic(gameModel);
            }
        });

        EventBus.on('trigger-dice-roll', (data: any) => {
            this.handleDiceRoll(data);
        }, this);

        EventBus.on('trigger-dice-roll-jail', (data: any) => {
            this.handleJailDiceRoll(data);
        }, this);

        EventBus.on('view-animate-path', (data: any) => {
            this.hideUI();
        
            const formattedPath = data.path.slice(1).map((id: number) => String(id).padStart(3, '0'));
            const playerToMove = this.players.find(p => p.model.id === String(data.playerId));
            
            if (playerToMove && formattedPath.length > 0) {
                const oldTileId = String(data.path[0]).padStart(3, '0');
                const newTileId = formattedPath[formattedPath.length - 1];

                playerToMove.token.isMoving = true;

                const pathCoordinates = formattedPath.map((tileId: string) => {
                    const targetTile = this.tiles.find(t => t.tileConfig.id === tileId);
                    return targetTile ? { x: targetTile.x, y: targetTile.y } : null; 
                }).filter((coord: { x: number, y: number } | null): coord is { x: number, y: number } => coord !== null);
        
                this.cameraController.followToken(playerToMove.token, 2.2, () => {
                    playerToMove.token.moveToCoords(pathCoordinates, () => {
                        // Actualizamos los jugadores en la casilla que abandona
                        this.organizeTokensOnTile(oldTileId);

                        playerToMove.model.currentTileId = newTileId;
                        
                        playerToMove.token.isMoving = false;

                        // Actualizamos los jugadores en la casilla a la que llega
                        this.organizeTokensOnTile(newTileId);
        
                        this.time.delayedCall(1000, () => { });
                        EventBus.emit('token-fin');
                    });
                });
            }
        });

        EventBus.on('token-fin', () => {
            this.time.delayedCall(400, () => { });
            const gameModel = this.GamelogicManager.model;
            const activePlayerId = gameModel.getCurrentTurnPlayerId();
            const isMe = gameModel.isMyTurn();
            const playerPair = this.players.find(p => p.model.id === activePlayerId);
            if (!playerPair) return;
            
            const currentTileId = playerPair.model.currentTileId;
            const prop = gameModel.getProperty(currentTileId);
            
            console.log(`[Token Fin] Verificando fase: ${gameModel.phase}`);

            if (gameModel.phase === 'choose_fantasy' || gameModel.phase === 'management' || gameModel.phase === 'business') {
                console.log("Entro en token-tile con phase:",gameModel.phase);
                this.interactWithTile(gameModel);

            } else if (gameModel.phase === 'liquidation') {
                if (currentTileId === '020') {
                    console.log("Token llegó a Secretaría en liquidación. Abriendo overlay...");
                    this.interactWithTile(gameModel);
                }
            } else if (gameModel.streak > 0 && gameModel.phase === 'roll_the_dices') {
                if (!isMe) {
                    this.time.delayedCall(800, () => {
                        console.log("Volviendo a la vista de origen...");
                        this.cameraController.resetView(1500); 
                    }); 
                    return;
                }
                this.interactWithTile(gameModel);
                const isInteractiveProp = prop !== undefined; 

                if (isInteractiveProp) {
                    console.log("Dobles: Casilla con interacción. Esperando a que se cierre el overlay para habilitar el re-roll.");
                    
                    EventBus.once('close-overlay', () => {
                        console.log("Overlay cerrado. Habilitando segundo tiro.");
                        EventBus.emit('update-controls-state', {
                            roll: true,  administer: false, trade: false, finishTurn: false, bankrupt: true });
                    });
                } else { // TODO: revisar 
                    EventBus.emit('update-controls-state', {
                        roll: true,  administer: false, trade: false, finishTurn: false, bankrupt: true });
                }
            }
        });

        
        EventBus.on('view-new-turn', async (gameModel: any) => {
            await this.handleNewTurn(gameModel);
        });

        
        // Evento para marcar quien compra propiedad 
        EventBus.on('property-bought', this.handlePurchase, this); 

        // Evento para que camara vuelva a la vista general
        EventBus.on('close-overlay', () => {
            this.cameraController.resetView(2000);

            this.time.delayedCall(2000, () => {
                this.showUI();
                if (this.pendingBillData) {
                    console.log("Ejecutando animación de dinero cuando cierra overlay");
                    this.animationManager.BillAnimation(this.pendingBillData.playerId, this.pendingBillData.numBills, this.pendingBillData.amount);
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

        EventBus.on('dark-mode', (active: boolean = true) => {
            if (active) { // Oscurece todo el tablero
                BoardEffects.setFocusByIds(this.tiles, [], this, this.players.map(p => p.token));
            } else { // Limpia oscurecimiento
                BoardEffects.setFocusByIds(this.tiles, null, this, this.players.map(p => p.token));
            }
        });

        EventBus.on('execute-tram-travel', (data: { playerId: string, targetId: string }) => {
            const playerPair = this.players.find(p => p.model.id === String(data.playerId));
            const targetTile = this.tiles.find(t => t.tileConfig.id === data.targetId);

            if (playerPair && targetTile) {
                const oldTileId = playerPair.model.currentTileId;
                playerPair.token.isMoving = true;

                this.organizeTokensOnTile(oldTileId);

                console.log(`Tram Visual: Moviendo a ${playerPair.model.name} a ${data.targetId}`);
                
                const path = [{ x: targetTile.x, y: targetTile.y }];
            
                playerPair.token.moveToCoords(path, () => {
                    this.tweens.add({
                        targets: playerPair.token,
                        y: targetTile.y - 15,
                        yoyo: true,
                        ease: 'Back.easeOut',
                        duration: 600,
                        onComplete: () => {
                            playerPair.model.currentTileId = data.targetId;
                            playerPair.token.isMoving = false;

                            this.GamelogicManager.model.updatePlayerPosition(data.playerId, data.targetId);

                            this.organizeTokensOnTile(data.targetId); 
                            EventBus.emit('model-updated', this.GamelogicManager.model);
                        }
                    });
                });
            }
            const tramTiles = this.tiles.filter(t => t instanceof TramTile);
            tramTiles.forEach(tile => tile.disableInteractive());
        });

        // inico de interfaz de tradeo
        EventBus.on('start-trade', () => {
            console.log("Manager: Iniciando proceso de intercambio...");

            EventBus.emit('dark-mode', true); // oscurecemos todo
            EventBus.emit('set-hud-clickable', true); // players clickables

            EventBus.emit('show-selection-notice', { // mensaje tradeo
                message: "Selecciona a un rival en el tablero para negociar",
                type: 'player' 
            });
            // EventBus.emit('show-toast', { 
            //     message: "Selecciona a un rival en el tablero para negociar",
            //     duration: 7000 
            // });

            // EventBus.emit('start-selection-mode');
        });

        EventBus.on('show-trading-mode', (data: { sender: any, receiver: any }) => {
            const gameModel = this.GamelogicManager.model;

            const getDetailedPlayer = (basicPlayerData: any) => {
                const fullModel = gameModel.getPlayer(basicPlayerData.id);
                
                const detailedProps = (fullModel?.properties || []).map(id => {
                    const prop = gameModel.getProperty(id);
                    return {
                        id: id,
                        name: prop?.name || `Propiedad ${id}`,
                        color: prop?.color || '#cbd5e1'
                    };
                });

                return {
                    ...basicPlayerData, // id, name, color, balance
                    properties: detailedProps
                };
            };
            const fullSender = getDetailedPlayer(data.sender);
            const fullReceiver = getDetailedPlayer(data.receiver);

            console.log("Board: Abriendo tradeo con info de los players", { fullSender, fullReceiver });

            EventBus.emit('open-trading-mode', {
                sender: fullSender,
                receiver: fullReceiver
            });
        });

        // evento para guardar animacion dinero, se muestra cuando se cierra overlay
        EventBus.on('save-pending-bill', (data: any) => {
            this.pendingBillData = { playerId: data.playerId, amount: data.amount, numBills: data.numBill};
        });

        EventBus.on('view-animate-money', (data: any) => {
            this.animationManager.BillAnimation(data.playerId, data.numBill, data.amount);
        });

        // evento para actualizar marcadores
        EventBus.on('update-tile-owner-visual', (data: { tileId: string, playerColor: number, playerId: string }) => {
            this.handlePurchase(data);
        });
    
        // evento para animación del dinero del Parking
        EventBus.on('collect-parking-money', (data: { currentTileId: string, playerId: string }) => {
            const tile = this.tiles.find(t => t.tileConfig.id === data.currentTileId);
            const myId = this.GamelogicManager.model.myId;

            if (tile) {
                this.pendingParkingData = { tile: tile,  playerId: data.playerId };
                const parking_money = this.GamelogicManager.model.getParkingMoney();
                console.log(`Parking: El jugador ${data.playerId} va a cobrar ${parking_money}M`);
                console.log("Parking: Animación lista", data.currentTileId);
                this.GamelogicManager.syncPlayerMoney(data.playerId, parking_money, true);
            }
        });

        
        EventBus.on('start-administer', () => {
            console.log("Manager: Iniciando adminitración...");
            
            const myId = this.GamelogicManager.model.myId;
            const model = this.GamelogicManager.model;
            EventBus.emit('dark-mode', true);
            EventBus.emit('show-players-hud', true);
            EventBus.emit('open-property-selection-mode', model, myId);
        });

        EventBus.on('stop-administer', () => {
            console.log("Manager: Finalizando administración...");
       
            EventBus.emit('dark-mode', false);
            EventBus.emit('show-players-hud', false);
            
            BoardEffects.setFocusByIds(this.tiles, null, this, this.players.map(p => p.token));
            
            this.tiles.forEach(tile => {
                tile.removeAllListeners('pointerdown');
                tile.setInteractive(); 
            });

            EventBus.emit('toggle-admin-exit-button', false);
        });

        EventBus.on('update-tile-mortgage-visual', (data: { tileId: string, isMortgaged: boolean }) => {
            const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);
            
            if (tile && (tile instanceof PropertyTile || tile instanceof ServerTile || tile instanceof BridgeTile ) ) {
                tile.updateMortgageVisual(data.isMortgaged);

                if (data.isMortgaged && tile instanceof PropertyTile) {
                    tile.clearBuildings();
                }
            }
        });

        EventBus.on('view-update-tile-construction', (data: { tileId: string, level: number }) => {
            const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);
            if (tile && tile instanceof PropertyTile) {
                tile.setConstructionLevel(data.level);
            }
        });

        // para cuando un player se rinde
        EventBus.on('view-remove-player', (data: { playerId: string }) => {
            const playerIndex = this.players.findIndex(p => p.model.id === data.playerId);
            
            if (playerIndex !== -1) {
                console.log(`Eliminando ficha del jugador ${data.playerId}`);
                const { token } = this.players[playerIndex];
                this.players.splice(playerIndex, 1);

                this.tweens.add({
                    targets: token,
                    alpha: 0,
                    scale: 0,
                    duration: 800,
                    ease: 'Back.easeIn',
                    onComplete: () => {
                        token.destroy();
                    }
                });
            } 
        });

        // para mover fichas
        EventBus.on('view-teleport-player', (data: { playerId: string, targetTileId: string }) => {
            const playerPair = this.players.find(p => p.model.id === data.playerId);
            const targetTile = this.tiles.find(t => t.tileConfig.id === data.targetTileId);

            if (playerPair && targetTile) {
                const oldTileId = playerPair.model.currentTileId;

                playerPair.token.isMoving = true;

                this.organizeTokensOnTile(oldTileId); 

                console.log(`Fantasía Visual: Teletransportando a ${playerPair.model.name} a ${data.targetTileId}`);

                this.tweens.add({
                    targets: playerPair.token,
                    alpha: 0,
                    scale: 0.5,
                    duration: 300,
                    onComplete: () => {
                        playerPair.model.currentTileId = data.targetTileId;
                
                        playerPair.token.setPosition(targetTile.x, targetTile.y);
                        
                        this.tweens.add({
                            targets: playerPair.token,
                            alpha: 1,
                            scale: 1,
                            duration: 300,
                            ease: 'Back.easeOut',
                            onComplete: () => {
                                // Terminó de aparecer. Liberamos y organizamos
                                playerPair.token.isMoving = false;
                                this.organizeTokensOnTile(data.targetTileId);
                            }
                        });
                    }
                });
            }
        });

        // evento que muestra animacion para ir a la carcel
        EventBus.on('view-send-to-jail', (data: { playerId: string }) => {
            this.sendToSecretary(data.playerId);
        });

        // Evento siguiente fase, comprueba que el player no tiene saldo negativo
        EventBus.on('request-next-phase', () => {
            const model = this.GamelogicManager.model;
            const myId = model.myId;
            const me = model.getPlayer(myId);

            // balance negativo?
            if (me && me.balance < 0) {
                EventBus.emit('show-toast', {
                    message: "No puedes pasar turno con saldo negativo.",
                    type: 'error'
                });
                return;
            }
            // si balance ok, emitimos la evento
            EventBus.emit('action-next-phase');

        });

        this.events.on('shutdown', () => {
            EventBus.off('model-updated');
            EventBus.off('trigger-dice-roll', this.handleDiceRoll, this);
            EventBus.off('view-animate-path');
            EventBus.off('token-fin');
            EventBus.off('view-new-turn');
            EventBus.off('property-bought');
            EventBus.off('close-overlay');
            EventBus.off('dark-mode');
            EventBus.off('execute-tram-travel');
            EventBus.off('start-trade');
            EventBus.off('show-trading-mode');
            EventBus.off('view-animate-money');
            EventBus.off('update-tile-owner-visual');
            EventBus.off('collect-parking-money');
            EventBus.off('start-administer');
            EventBus.off('update-tile-mortgage-visual');
            EventBus.off('view-update-tile-construction');
            EventBus.off('view-remove-player');
            EventBus.off('request-next-phase');
            this.tweens.killAll();
            this.time.removeAllEvents();
            

            this.tiles.forEach(tile => tile.destroy());
            this.players.forEach(p => p.token.destroy());
            this.tiles = [];
            this.players = [];
        });
    }

    private syncPlayers(gameModel: any) {
        const orderedIds = gameModel.orderedPlayers || [];
        let newPlayersAdded = false;

        this.players = this.players.filter(p => {
            const stillExists = orderedIds.includes(p.model.id);
            if (!stillExists) {
                console.log(`Sync: Destruyendo ficha huérfana del jugador ${p.model.id}`);
                p.token.destroy(); // Borrar objeto visual de Phaser
            }
            return stillExists;
        });
        
        orderedIds.forEach((playerId: string, index: number) => {
            const pData = gameModel.players[playerId];
            if (!pData) return;

            const existingPlayer = this.players.find(p => p.model.id === playerId);

            if (!existingPlayer) {
                this.createPlayer(playerId, pData.name, index, pData.balance);
                newPlayersAdded = true;
            } else {
                // Actualizamos solo datos lógicos
                existingPlayer.model.name = pData.name;
                existingPlayer.model.balance = pData.balance;
                existingPlayer.model.jailRemainingTurns = pData.jailRemainingTurns;

                if (!existingPlayer.token.isMoving) {
                    existingPlayer.model.currentTileId = pData.currentTileId;
                }

                // existingPlayer.model.currentTileId = pData.currentTileId;
            }
        });

        if (newPlayersAdded) {
            this.emitInitialPlayers();
            this.showUI();
        }
    }

    private syncPropertiesOwnership(gameModel: any) {
        Object.values(gameModel.boardProperties).forEach((prop: any) => {
            const ownerId = prop.ownerId;
            this.handlePurchase({
                tileId: prop.id,
                playerId: ownerId,
                playerColor: ownerId ? gameModel.getPlayerColor(ownerId) : null
            });
        });
    }

    private syncBuildingsAndMortgages(gameModel: any) {
        Object.values(gameModel.boardProperties).forEach((prop: any) => {
            const tile = this.tiles.find(t => t.tileConfig.id === prop.id);
            
            if (tile && (tile instanceof PropertyTile || tile instanceof ServerTile || tile instanceof BridgeTile)) {
                // Sincronizar hipoteca
                tile.updateMortgageVisual(prop.isMortgaged);

                // Sincronizar casas (solo en propiedades)
                if (tile instanceof PropertyTile) {
                    tile.setConstructionLevel(prop.houseCount);
                }
            }
        });
    }
    private async handleNewTurn(gameModel: any) {
        //const player = gameModel.getPlayer(gameModel.getCurrentTurnPlayerId());
        const playerId = gameModel.getCurrentTurnPlayerId();
        const player = gameModel.getPlayer(String(playerId));
        console.log(player);
        
        if (!player) return;

        const isMe = gameModel.isMyTurn();
        const bannerText = isMe ? "Tu turno" : `Turno de ${player.name}`;
        const playerColor = '#' + player.color.toString(16).padStart(6, '0');

        this.hideUI();

        await this.announceTurn(bannerText, playerColor);
        this.showUI();
        // Después de enseñar banner, empieza la fase
        this.handlePhaseLogic(gameModel);
        // EventBus.emit('turn-announcement-finished', gameModel);
    }

    private handlePhaseLogic(gameModel: any) {
        const isMe = gameModel.isMyTurn();
        console.log(`[Phase Check] Fase actual: "${gameModel.phase}" | ¿Es mi turno?: ${isMe}`);
        this.showUI();
        switch (gameModel.phase as WSTypes.Phase) {
            case 'roll_the_dices':
                console.log("Enseño UI");
                this.showUI();
                EventBus.emit('update-turn-controls', isMe);
                break;
            case 'choose_square':
                this.hideUI();
                console.log("empieza choose_square");
                break;

            case 'choose_fantasy':
                break;

            case 'management':
                console.log("empieza management");
                break;

            case 'business':
                break;

            case 'auction':
                console.log("Empieza subasta");
                break;

            case 'liquidation':
                break;

            case 'proposal_acceptance':
                break;

            case 'end_game':
                break;

            default:
                break;
        }
    }

    public interactWithTile(gameModel: any) {
        console.log("--- INTERACTUAR CON LA CASILLA ---");
        const isMe = gameModel.isMyTurn();
        const activePlayerId = gameModel.getCurrentTurnPlayerId();
        const activePlayerPair = this.players.find(p => p.model.id === activePlayerId);
        if (isMe) {
            
            if (activePlayerPair) {
                const currentTileId = activePlayerPair.model.currentTileId;
                const currentTile = this.tiles.find(t => t.tileConfig.id === currentTileId);

                if (currentTile) {
                    console.log(`Disparando lógica para ID: ${currentTile.tileConfig.id}`);
                    this.tileLogicManager.checkTileLogic(activePlayerPair.model, currentTile, this.players);
                } else {
                    console.error(`No se encontró la casilla física con ID: ${currentTile}`);
                }
            }
            EventBus.emit('model-updated', this.GamelogicManager.model);
        } else { // volvemos a la vista general mientras el playerActive está en management
            this.time.delayedCall(800, () => {
                console.log("Volviendo a la vista de origen...");
                this.cameraController.resetView(1500); 
            });
        }
    }
    
    public hideUI() {
        EventBus.emit('hide-players-hud');
        EventBus.emit('hide-controls-hud');
    }

    public showUI() {
        EventBus.emit('show-players-hud');
        EventBus.emit('show-controls-hud');
    }

    public showToast(message: string, duration?: number) {
        EventBus.emit('show-toast', { message, duration });
    }

    public announceTurn(message: string, bgColor: string): Promise<void> {
        // Estoy prometiendo que voy a acabar
        return new Promise((resolve) => {
            EventBus.emit('show-banner', {
                message: message,
                color: bgColor
            });

            this.time.delayedCall(2500, () => {
                EventBus.emit('hide-banner');
                resolve();
            });
        });
    }

    createPlayer(id: string, name: string, colorIndex: number, balance: number) {
        const startTile = this.tiles[0];
        
        const cIndex = colorIndex % this.colorPalette.length;
        const assignedColor = this.colorPalette[cIndex];

        const model = new PlayerModel(id, name, assignedColor, balance);
        model.currentTileId = startTile.tileConfig.id; 
        const token = new PlayerToken(this, startTile.x, startTile.y, assignedColor);
        token.isMoving = false;

        token.setDepth(200 + this.players.length);

        this.players.push({ model, token });

        this.organizeTokensOnTile(startTile.tileConfig.id);
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

    public async sendToSecretary(playerId: string) {
        const p = this.players.find(pair => pair.model.id === playerId);
        const jailTile = this.tiles.find(t => t instanceof JailTile);
        
        if (!p || !jailTile) return;
        const oldTileId = p.model.currentTileId;
        const myId = localStorage.getItem('myId');
        const isMe = playerId === String(myId);
        
        if (isMe) {
            await this.playSecretaryCutscene();
        }

        if(!isMe) {
            console.log("Otro player ha ido a la cárcel, muevo token");
            this.time.delayedCall(2000, () => { 
                EventBus.emit('view-teleport-player', {
                    playerId: playerId,
                    targetTileId: jailTile

                });
                this.showToast(`${p.model.name} ha sido enviado a Secretaría`); 
            });
            this.time.delayedCall(800, () => {
                console.log("Rset de la camra en secretaría");
                this.cameraController.resetView(1500);
            }); 
            
            return;
        }
        
        // await this.playSecretaryCutscene();
        p.model.currentTileId = jailTile.tileConfig.id;
        p.token.isMoving = true;
        this.organizeTokensOnTile(oldTileId);

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
        this.cameraController.focusOnTile(jailTile, 2.2, () => {

            p.token.setPosition(finalX, finalY - 600);
            p.token.setAlpha(1);
            
            this.tweens.add({
                targets: p.token,
                y: finalY,
                ease: 'Bounce.easeOut',
                duration: 800,
                onComplete: () => {
                    const myId = localStorage.getItem('myId');
                    this.organizeTokensOnTile(jailTile.tileConfig.id);
                    p.token.isMoving = false;
                    if (playerId === String(myId)) {
                        this.time.delayedCall(1000, () => {
                            EventBus.emit('jail-animation-finished');
                        });
                    } 
                }
            });
            this.showToast(`${p.model.name} ha sido enviado a Secretaría`);
        });
    }

    private handleDiceRoll(diceData?: { dice1: number, dice2: number, dice_bus?: number, destinations?: number[] }) {
        if (!diceData) return;

        const values = [diceData.dice1, diceData.dice2];
        if (diceData.dice_bus !== undefined && diceData.dice_bus !== null) {
            values.push(diceData.dice_bus);
        }
        let formattedDestinations: string[] = [];
        if (diceData.destinations) {
            formattedDestinations = diceData.destinations.map(d => String(d).padStart(3, '0'));
        }
        const isMyTurn = this.GamelogicManager.model.isMyTurn();

        this.hideUI();

        this.diceManager.handleDiceRoll(
            this.tiles, 
            this.players, 
            values as [number, number, number],
            formattedDestinations,
            isMyTurn
        );
    }

    private handleJailDiceRoll(diceData: { dice1: number, dice2: number, destinations?: number[] }) {
        if (!diceData) return;

        const values: [number, number] = [diceData.dice1, diceData.dice2];
        
        let formattedDestinations: string[] = [];
        if (diceData.destinations) {
            formattedDestinations = diceData.destinations.map(d => String(d).padStart(3, '0'));
        }
        const isMe = this.GamelogicManager.model.isMyTurn();
        this.hideUI();

        this.diceManager.handleJailDiceRoll(
            this.tiles, 
            this.players, 
            values,
            formattedDestinations,
            isMe
        );
    }

    // Marcador para cada casilla que compra un player 
    private handlePurchase (data: { tileId: string, playerColor: number | null | string, playerId: string }) {
        const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);

        if (tile && (tile instanceof PropertyTile || tile instanceof ServerTile || tile instanceof BridgeTile)) {
            const isNewPurchase = !tile.tileConfig.ownerId && data.playerId;
            tile.tileConfig.ownerId = data.playerId;
            
            if (data.playerId === null || data.playerColor === null) { // borrar marcadores
                tile.clearOwnerMarker();
            } else {
                let colorNum = data.playerColor;
                if (typeof colorNum === 'string') {
                    colorNum = parseInt(colorNum.replace('#', '0x'), 16);
                }
                tile.setOwnerMarker(colorNum);
                if (isNewPurchase) {
                    this.tweens.add({
                        targets: tile,
                        alpha: 0.5,
                        duration: 150,
                        yoyo: true,
                        ease: 'Quad.easeInOut'
                    });
                }
            }
        } else {
            console.warn("No se encontró la casilla con ID:", data.tileId);
        }
    }

    // Posición dinámica de los tokens en una misma casilla
    public organizeTokensOnTile(tileId: string) {
        const tile = this.tiles.find(t => t.tileConfig.id === tileId);
        if (!tile) return;

        const playersOnTile = this.players.filter(p => 
            p.model.currentTileId === tileId && !p.token.isMoving
        );
        
        // Si no hay jugadores no hacemos nada
        if (playersOnTile.length === 0) return;

        const SPREAD_RADIUS = 22;

        let offsets: {x: number, y: number}[] = [];
        switch (playersOnTile.length) {
            case 1: offsets = [{ x: 0, y: 0 }]; break;
            case 2: offsets = [{ x: -SPREAD_RADIUS, y: 0 }, { x: SPREAD_RADIUS, y: 0 }]; break;
            case 3: offsets = [
                { x: 0, y: -SPREAD_RADIUS }, 
                { x: -SPREAD_RADIUS, y: SPREAD_RADIUS }, 
                { x: SPREAD_RADIUS, y: SPREAD_RADIUS }
            ]; break;
            case 4: offsets = [
                { x: -SPREAD_RADIUS, y: -SPREAD_RADIUS }, { x: SPREAD_RADIUS, y: -SPREAD_RADIUS }, 
                { x: -SPREAD_RADIUS, y: SPREAD_RADIUS }, { x: SPREAD_RADIUS, y: SPREAD_RADIUS }
            ]; break;
            default:
                for (let i = 0; i < playersOnTile.length; i++) {
                    const angle = (i / playersOnTile.length) * Math.PI * 2;
                    offsets.push({ x: Math.cos(angle) * SPREAD_RADIUS, y: Math.sin(angle) * SPREAD_RADIUS });
                }
        }

        playersOnTile.forEach((player, index) => {
            this.tweens.add({
                targets: player.token,
                x: tile.x + offsets[index].x,
                y: tile.y + offsets[index].y,
                duration: 300,
                ease: 'Sine.easeInOut'
            });
        });
    }
}
