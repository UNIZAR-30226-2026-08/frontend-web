import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';
import { TileType } from '../types/TileTypes';
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
import { EventBus } from '@/EventBus';
import { DiceManager } from '../managers/DiceManager';
import { CameraController } from '../utils/CameraController';
import { BoardEffects } from '../utils/BoardEffects';
import { AnimationManager } from '../managers/AnimationManager';
import { TileLogicManager } from '../managers/TileLogicManager';
import { GameLogicManager } from '../managers/GameLogicManager';
import { EventManager } from '../managers/EventManager';
export class Board extends Phaser.Scene {
    tiles = [];
    players = [];
    colorPalette = [];
    fantasyCards = [];
    // -- Managers Visuales
    diceManager;
    animationManager;
    tileLogicManager;
    cameraController;
    eventManager;
    // -- Estado Global --
    GamelogicManager;
    localPlayerId = null;
    selectedPlayer = null;
    pendingParkingData = null;
    pendingBillData = null;
    lastTurnPlayerId = null;
    constructor() {
        super({ key: 'BoardScene' });
    }
    init() {
        this.localPlayerId = localStorage.getItem('myId');
        this.GamelogicManager = GameLogicManager.getInstance();
    }
    preload() {
        this.load.video('background_video', 'videos/game_background.webm');
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
    create() {
        this.initManagers();
        this.createBackground();
        this.createBoard();
        this.setupEventBus();
        console.log("BOARD CREATE: Comprobando jugadores iniciales", this.GamelogicManager.model.orderedPlayers);
        // Check if GameLogicManager already has data
        if (this.GamelogicManager && this.GamelogicManager.model.orderedPlayers.length > 0) {
            this.syncPlayers(this.GamelogicManager.model);
        }
    }
    initManagers() {
        this.animationManager = new AnimationManager(this);
        this.diceManager = new DiceManager(this);
        this.tileLogicManager = new TileLogicManager(this);
        this.cameraController = new CameraController(this);
    }
    createBackground() {
        const { width, height } = this.scale;
        const bgVideo = this.add.video(width / 2, height / 2, 'background_video');
        bgVideo.setOrigin(0.5, 0.5);
        bgVideo.setDepth(-100);
        const resizeVideo = (screenWidth, screenHeight) => {
            const videoW = bgVideo.width;
            const videoH = bgVideo.height;
            if (videoW === 0 || videoH === 0)
                return;
            const scaleX = screenWidth / videoW;
            const scaleY = screenHeight / videoH;
            const scale = Math.max(scaleX, scaleY);
            bgVideo.setScale(scale);
            bgVideo.setPosition(screenWidth / 2, screenHeight / 2);
        };
        bgVideo.on('play', () => { resizeVideo(this.scale.width, this.scale.height); });
        bgVideo.play(true);
        this.scale.on('resize', (gameSize) => { resizeVideo(gameSize.width, gameSize.height); }, this);
    }
    createBoard() {
        const fullData = this.cache.json.get('board');
        const moneyData = this.cache.json.get('money');
        const priceMap = new Map();
        if (moneyData && moneyData.tiles) {
            moneyData.tiles.forEach((t) => {
                priceMap.set(String(t.id).padStart(3, '0'), t.buy_price);
            });
        }
        // Extraer colores para players
        const rawColors = fullData.playerColors;
        this.colorPalette = rawColors.map(c => parseInt(c.replace('#', '0x')));
        const boardTiles = fullData.tiles;
        const groups = fullData.groups;
        const fullFantasy = this.cache.json.get('fantasyCards');
        this.fantasyCards = fullFantasy.fantasy;
        boardTiles.forEach((config) => {
            let tile;
            const normalizedId = String(config.id).padStart(3, '0');
            if (config.type === TileType.PROPERTY) {
                const propConfig = config;
                const groupInfo = groups.find(g => g.group === propConfig.group);
                propConfig.color = groupInfo ? groupInfo.color : '#FFFFFF';
                if (priceMap.has(normalizedId)) {
                    propConfig.price = priceMap.get(normalizedId);
                }
                tile = new PropertyTile(this, propConfig);
            }
            else if (config.type === TileType.FANTASY) {
                tile = new FantasyTile(this, config);
            }
            else if (config.type === TileType.BRIDGE) {
                const bridgeConfig = config;
                if (priceMap.has(normalizedId))
                    bridgeConfig.price = priceMap.get(normalizedId);
                tile = new BridgeTile(this, bridgeConfig);
            }
            else if (config.type === TileType.SERVER) {
                const serverConfig = config;
                if (priceMap.has(normalizedId))
                    serverConfig.price = priceMap.get(normalizedId);
                tile = new ServerTile(this, serverConfig);
            }
            else if (config.type === TileType.START) {
                tile = new StartTile(this, config);
            }
            else if (config.type === TileType.GO_TO_JAIL) {
                tile = new GoToJailTile(this, config);
            }
            else if (config.type === TileType.JAIL) {
                tile = new JailTile(this, config);
            }
            else if (config.type === TileType.PARKING) {
                tile = new ParkingTile(this, config);
            }
            else if (config.type === TileType.TRAM) {
                tile = new TramTile(this, config);
            }
            else if (config.type === TileType.VISIT) {
                tile = new VisitTile(this, config);
            }
            else {
                tile = new Tile(this, config);
            }
            this.tiles.push(tile);
        });
        this.eventManager = new EventManager(this, this.tiles, this.players);
    }
    // --- EVENT BUS  ---
    setupEventBus() {
        EventBus.on('model-updated', async (gameModel) => {
            // Sincronizamos quién está en la partida (Crear/Actualizar nombres)
            this.syncPlayers(gameModel);
            this.syncPropertiesOwnership(gameModel);
            this.syncBuildingsAndMortgages(gameModel);
            //this.syncPlayerPositions(gameModel);
            const currentTurnId = gameModel.getCurrentTurnPlayerId();
            if (this.lastTurnPlayerId !== currentTurnId) {
                const isFirstTurn = this.lastTurnPlayerId === null;
                this.lastTurnPlayerId = currentTurnId;
                // Algo de tiempo antes del primer turno
                if (isFirstTurn) {
                    this.time.delayedCall(800, async () => {
                        await this.handleNewTurn(gameModel);
                    });
                }
            }
            else {
                this.handlePhaseLogic(gameModel);
            }
        });
        EventBus.on('trigger-dice-roll', (data) => {
            this.handleDiceRoll(data);
        }, this);
        EventBus.on('view-animate-path', (data) => {
            this.hideUI();
            const formattedPath = data.path.map((id) => String(id).padStart(3, '0'));
            const playerToMove = this.players.find(p => p.model.id === String(data.playerId));
            if (playerToMove && formattedPath.length > 0) {
                const pathCoordinates = formattedPath.map((tileId) => {
                    const targetTile = this.tiles.find(t => t.tileConfig.id === tileId);
                    if (targetTile) {
                        return { x: targetTile.x, y: targetTile.y };
                    }
                    else {
                        console.warn(`Tile ${tileId} not found on the board!`);
                        return null;
                    }
                }).filter((coord) => coord !== null);
                this.cameraController.followToken(playerToMove.token, 2.2, () => {
                    playerToMove.token.moveToCoords(pathCoordinates, () => {
                        this.time.delayedCall(1000, () => { });
                        EventBus.emit('token-fin');
                    });
                });
            }
        });
        EventBus.on('token-fin', () => {
            this.time.delayedCall(400, () => { });
            const gameModel = this.GamelogicManager.model;
            console.log(`[Token Fin] Verificando fase: ${gameModel.phase}`);
            if (gameModel.phase === 'choose_fantasy') {
                this.interactWithTile(gameModel);
            }
            else if (gameModel.phase === 'management' || gameModel.phase === 'business') {
                this.interactWithTile(gameModel);
            }
        });
        EventBus.on('view-new-turn', async (gameModel) => {
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
                    this.animationManager.BillAnimation(this.pendingBillData.playerId, 15, this.pendingBillData.amount);
                    this.pendingBillData = null;
                }
                if (this.pendingParkingData) {
                    this.animationManager.CoinAnimation(this.pendingParkingData.tile, this.pendingParkingData.playerId, this.players);
                    this.pendingParkingData = null;
                }
            });
        });
        EventBus.on('dark-mode', (active = true) => {
            if (active) { // Oscurece todo el tablero
                BoardEffects.setFocusByIds(this.tiles, [], this, this.players.map(p => p.token));
            }
            else { // Limpia oscurecimiento
                BoardEffects.setFocusByIds(this.tiles, null, this, this.players.map(p => p.token));
            }
        });
        EventBus.on('execute-tram-travel', (data) => {
            const playerPair = this.players.find(p => p.model.id === String(data.playerId));
            const targetTile = this.tiles.find(t => t.tileConfig.id === data.targetId);
            if (playerPair && targetTile) {
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
                            this.GamelogicManager.model.updatePlayerPosition(data.playerId, data.targetId);
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
            EventBus.emit('show-selection-notice', {
                message: "Selecciona a un rival en el tablero para negociar",
                type: 'player'
            });
            // EventBus.emit('show-toast', { 
            //     message: "Selecciona a un rival en el tablero para negociar",
            //     duration: 7000 
            // });
            // EventBus.emit('start-selection-mode');
        });
        EventBus.on('show-trading-mode', (data) => {
            const gameModel = this.GamelogicManager.model;
            const getDetailedPlayer = (basicPlayerData) => {
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
        // evento para enseñar animacion dinero
        EventBus.on('view-animate-money', (data) => {
            const bills = data.numBill ?? 6;
            this.animationManager.BillAnimation(data.playerId, bills, data.amount);
        });
        // evento para actualizar marcadores
        EventBus.on('update-tile-owner-visual', (data) => {
            this.handlePurchase(data);
        });
        // evento para animación del dinero del Parking
        EventBus.on('collect-parking-money', (data) => {
            const tile = this.tiles.find(t => t.tileConfig.id === data.currentTileId);
            const myId = this.GamelogicManager.model.myId;
            if (tile) {
                this.pendingParkingData = { tile: tile, playerId: data.playerId };
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
        EventBus.on('update-tile-mortgage-visual', (data) => {
            const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);
            if (tile && (tile instanceof PropertyTile || tile instanceof ServerTile || tile instanceof BridgeTile)) {
                tile.updateMortgageVisual(data.isMortgaged);
                if (data.isMortgaged && tile instanceof PropertyTile) {
                    tile.clearBuildings();
                }
            }
        });
        EventBus.on('view-update-tile-construction', (data) => {
            const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);
            if (tile && tile instanceof PropertyTile) {
                tile.setConstructionLevel(data.level);
            }
        });
        // para cuando un player se rinde
        EventBus.on('view-remove-player', (data) => {
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
        EventBus.on('view-teleport-player', (data) => {
            const playerPair = this.players.find(p => p.model.id === data.playerId);
            const targetTile = this.tiles.find(t => t.tileConfig.id === data.targetTileId);
            if (playerPair && targetTile) {
                console.log(`Fantasía Visual: Teletransportando a ${playerPair.model.name} a ${data.targetTileId}`);
                this.tweens.add({
                    targets: playerPair.token,
                    alpha: 0,
                    scale: 0.5,
                    duration: 300,
                    onComplete: () => {
                        playerPair.token.setPosition(targetTile.x, targetTile.y);
                        playerPair.model.currentTileId = data.targetTileId;
                        this.tweens.add({
                            targets: playerPair.token,
                            alpha: 1,
                            scale: 1,
                            duration: 300,
                            ease: 'Back.easeOut'
                        });
                    }
                });
            }
        });
        // evento que muestra animacion para ir a la carcel
        EventBus.on('view-send-to-jail', (data) => {
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
    syncPlayers(gameModel) {
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
        orderedIds.forEach((playerId, index) => {
            const pData = gameModel.players[playerId];
            if (!pData)
                return;
            const existingPlayer = this.players.find(p => p.model.id === playerId);
            if (!existingPlayer) {
                this.createPlayer(playerId, pData.name, index, pData.balance);
                newPlayersAdded = true;
            }
            else {
                // Actualizamos solo datos lógicos
                existingPlayer.model.name = pData.name;
                existingPlayer.model.balance = pData.balance;
                existingPlayer.model.currentTileId = pData.currentTileId;
            }
        });
        if (newPlayersAdded) {
            this.emitInitialPlayers();
            this.showUI();
        }
    }
    syncPropertiesOwnership(gameModel) {
        Object.values(gameModel.boardProperties).forEach((prop) => {
            const ownerId = prop.ownerId;
            this.handlePurchase({
                tileId: prop.id,
                playerId: ownerId,
                playerColor: ownerId ? gameModel.getPlayerColor(ownerId) : null
            });
        });
    }
    syncBuildingsAndMortgages(gameModel) {
        Object.values(gameModel.boardProperties).forEach((prop) => {
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
    // private syncPlayerPositions(gameModel: any) {
    //     this.players.forEach(p => {
    //         const modelPos = gameModel.getPlayerPosition(p.model.id);
    //         // Si la pieza en Phaser no está donde dice el servidor
    //         if (p.model.currentTileId !== modelPos) {
    //             const targetTile = this.tiles.find(t => t.tileConfig.id === modelPos);
    //             if (targetTile) {
    //                 console.log(`Corrección de posición para ${p.model.name}: ${modelPos}`);
    //                 p.model.currentTileId = modelPos;
    //                 // Animación de teletransporte/movimiento rápido para sincronizar
    //                 this.tweens.add({
    //                     targets: p.token,
    //                     alpha: 0.5,
    //                     scale: 0.8,
    //                     duration: 300,
    //                     onComplete: () => {
    //                         p.token.setPosition(targetTile.x, targetTile.y);
    //                         this.tweens.add({
    //                             targets: p.token,
    //                             alpha: 1,
    //                             scale: 1,
    //                             duration: 300,
    //                             ease: 'Power2'
    //                         });
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // }
    async handleNewTurn(gameModel) {
        //const player = gameModel.getPlayer(gameModel.getCurrentTurnPlayerId());
        const playerId = gameModel.getCurrentTurnPlayerId();
        const player = gameModel.getPlayer(String(playerId));
        console.log(player);
        if (!player)
            return;
        const isMe = gameModel.isMyTurn();
        const bannerText = isMe ? "Tu turno" : `Turno de ${player.name}`;
        const playerColor = '#' + player.color.toString(16).padStart(6, '0');
        this.hideUI();
        await this.announceTurn(bannerText, playerColor);
        this.showUI();
        // Después de enseñar banner, empieza la fase
        this.handlePhaseLogic(gameModel);
    }
    handlePhaseLogic(gameModel) {
        const isMe = gameModel.isMyTurn();
        console.log(`[Phase Check] Fase actual: "${gameModel.phase}" | ¿Es mi turno?: ${isMe}`);
        this.showUI();
        switch (gameModel.phase) {
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
    interactWithTile(gameModel) {
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
                }
                else {
                    console.error(`No se encontró la casilla física con ID: ${currentTile}`);
                }
            }
            EventBus.emit('model-updated', this.GamelogicManager.model);
        }
        else { // volvemos a la vista general mientras el playerActive está en management
            this.time.delayedCall(800, () => {
                console.log("Volviendo a la vista de origen...");
                this.cameraController.resetView(1500);
            });
        }
    }
    hideUI() {
        EventBus.emit('hide-players-hud');
        EventBus.emit('hide-controls-hud');
    }
    showUI() {
        EventBus.emit('show-players-hud');
        EventBus.emit('show-controls-hud');
    }
    showToast(message, duration) {
        EventBus.emit('show-toast', { message, duration });
    }
    announceTurn(message, bgColor) {
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
    createPlayer(id, name, colorIndex, balance) {
        const startTile = this.tiles[0];
        const cIndex = colorIndex % this.colorPalette.length;
        const assignedColor = this.colorPalette[cIndex];
        const offset = 22;
        const offsetX = (this.players.length % 2 === 0) ? -offset : offset;
        const offsetY = (this.players.length < 2) ? -offset : offset;
        const finalX = startTile.x + offsetX;
        const finalY = startTile.y + offsetY;
        const model = new PlayerModel(id, name, assignedColor, balance);
        const token = new PlayerToken(this, finalX, finalY, assignedColor);
        token.setDepth(200 + this.players.length);
        // TODO: Esto es solo para probar el movimiento
        // token.on('pointerdown', () => {
        //     this.handlePlayerClick(id);
        // });
        this.players.push({ model, token });
    }
    getLocalPlayer() {
        if (!this.localPlayerId)
            return null;
        return this.players.find(p => p.model.id === this.localPlayerId) || null;
    }
    emitInitialPlayers() {
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
    playSecretaryCutscene() {
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
    async sendToSecretary(playerId) {
        const p = this.players.find(pair => pair.model.id === playerId);
        const jailTile = this.tiles.find(t => t instanceof JailTile);
        if (!p || !jailTile)
            return;
        await this.playSecretaryCutscene();
        const othersCount = this.players.filter(other => other.model.id !== playerId &&
            other.model.currentTileId === jailTile.tileConfig.id).length;
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
                onComplete: () => { }
            });
            this.showToast(`${p.model.name} ha sido enviado a Secretaría`);
        });
    }
    handleDiceRoll(diceData) {
        if (!diceData)
            return;
        const values = [diceData.dice1, diceData.dice2];
        if (diceData.dice_bus !== undefined && diceData.dice_bus !== null) {
            values.push(diceData.dice_bus);
        }
        let formattedDestinations = [];
        if (diceData.destinations) {
            formattedDestinations = diceData.destinations.map(d => String(d).padStart(3, '0'));
        }
        const isMyTurn = this.GamelogicManager.model.isMyTurn();
        this.hideUI();
        this.diceManager.handleDiceRoll(this.tiles, this.players, values, formattedDestinations, isMyTurn);
    }
    // Marcador para cada casilla que compra un player 
    handlePurchase(data) {
        const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);
        if (tile && (tile instanceof PropertyTile || tile instanceof ServerTile || tile instanceof BridgeTile)) {
            const isNewPurchase = !tile.tileConfig.ownerId && data.playerId;
            tile.tileConfig.ownerId = data.playerId;
            if (data.playerId === null || data.playerColor === null) { // borrar marcadores
                tile.clearOwnerMarker();
            }
            else {
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
        }
        else {
            console.warn("No se encontró la casilla con ID:", data.tileId);
        }
    }
}
