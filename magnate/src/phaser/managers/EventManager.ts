import { EventBus } from '@/EventBus';
import { Tile } from '../objects/Tile';
import { PlayerModel } from '../models/PlayerModel';
import { PlayerToken } from '../objects/PlayerToken';
import { BoardEffects } from '../utils/BoardEffects';
import { TramTile } from '../objects/TramTile';
import { PropertyTile } from '../objects/PropertyTile';
import { IPropertyTile, ITramTile } from '../types/TileTypes';
import { DiceManager } from './DiceManager';
import { TileLogicManager } from './TileLogicManager';
import { CameraController } from '../utils/CameraController';
import { AnimationManager } from './AnimationManager';
import { GameModel } from '../models/GameModel';

interface IBoardScene extends Phaser.Scene {
    sendToSecretary(playerId: string): Promise<void>;
    showToast(message: string, duration?: number): void;
    getLocalPlayer(): { model: PlayerModel, token: PlayerToken } | null;
    cameraController: CameraController;
    selectedPlayer: { model: PlayerModel, token: PlayerToken } | null;
    animationManager: AnimationManager;
    diceManager: DiceManager;
    tileLogicManager: TileLogicManager;
}

export class EventManager {
    private scene: IBoardScene;
    private tiles: Tile[];
    private players: { model: PlayerModel, token: PlayerToken }[];

    constructor(scene: IBoardScene, tiles: Tile[], players: { model: PlayerModel, token: PlayerToken }[]) {
        this.scene = scene;
        this.tiles = tiles;
        this.players = players;

        this.init();
    }

    private init() {
        this.setupControlsEvents();
        this.setupTramEvents();
        this.setupJailEvent();
        this.billEvent();
    }

    private getActivePlayer() {
        return this.scene.selectedPlayer ;
    }

    private setupControlsEvents() {

        // Lógica de inicio de tradeo
        EventBus.on('start-selection-mode', (data: { ownerId: string, propertyIds: string[]}) => {
            BoardEffects.setFocusByIds(this.tiles, data.propertyIds, this.scene, this.players.map(p=>p.token));

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

        // Lógica de administración
        EventBus.on('open-property-selection-mode', (model: GameModel, playerId: string) => {
            // propiedades del player
            const propertyIds = model.getPlayerProperties(playerId);
            if (propertyIds.length === 0) {
                EventBus.emit('show-toast', { message: "No tienes propiedades para administrar", duration: 3000 });
                EventBus.emit('dark-mode', false);
                return;
            }
            BoardEffects.setFocusByIds(this.tiles, propertyIds, this.scene, []);
            this.tiles.forEach(tile => {
                const tileId = tile.tileConfig.id;
                if (propertyIds.includes(tile.tileConfig.id)) {
                    tile.setInteractive();
                    tile.removeAllListeners('pointerdown');

                    tile.once('pointerdown', () => {
                        BoardEffects.setFocusByIds(this.tiles, null, this.scene, this.players.map(p=>p.token));
                        const prop = model.getProperty(tileId);
                        if (!prop) return;
                        
                        EventBus.emit('open-property-management', { 
                            data: {
                                id: prop.id,
                                name: prop.name,
                                color: prop.color,
                                owner: prop.ownerId,
                                group: prop.group,
                                houseCount: prop.houseCount,
                                buildPrice: prop.buildPrice,
                                buyPrice: prop.buyPrice,
                                rentPrices: prop.rentPrices,
                                isMortgaged: prop.isMortgaged,
                            },
                        });
                    });
                } else {
                    tile.disableInteractive();
                }
            });
        });

        // // Lógica construir casas/hoteles
        // EventBus.on('execute-property-build', (data: { tileId: string, level: string, isMortgaged: boolean }) => {
        //     const tile = this.tiles.find(t => t.tileConfig.id === data.tileId);
            
        //     if (tile && tile instanceof PropertyTile) {
        //         // Mapeamos el string del Overlay a un número para el método setConstructionLevel
        //         const levelMap: Record<string, number> = {
        //             'base': 0, 'house1': 1, 'house2': 2, 'house3': 3, 'house4': 4, 'hotel': 5
        //         };
        //         const numericLevel = levelMap[data.level] ?? 0;
        //         tile.setConstructionLevel(numericLevel);
        //     }
        // });

    }

    private setupTramEvents() {

        EventBus.on('start-tram-selection', () => {
			const tramTiles = this.tiles.filter(t => t instanceof TramTile);
			const tramTileIds = tramTiles.map(t => t.tileConfig.id);
            
			BoardEffects.setFocusByIds(this.tiles, tramTileIds, this.scene, this.players.map(p=>p.token));

			this.tiles.forEach(tile => {
				if (tramTileIds.includes(tile.tileConfig.id)) {
					tile.setInteractive({ useHandCursor: true });
					tile.removeAllListeners('pointerdown');

					tile.once('pointerdown', () => {
						const tramConfig = tile.tileConfig as ITramTile;

						EventBus.emit('tram-tile-selected', {
							id: tramConfig.id,
							name: tramConfig.name,
                            subText: tramConfig.subText,
						});

						// disable focus after click
						BoardEffects.setFocusByIds(this.tiles, null, this.scene, this.players.map(p=>p.token));
					});
				} else {
					tile.disableInteractive();
				}
			});
		});
    }

    private setupJailEvent() {

        EventBus.on('start-jail-roll-sequence', () => {  
            this.tiles.forEach(t => {
                t.removeAllListeners('pointerdown');
                t.disableInteractive();
             });
            this.scene.cameraController.resetView(1500);
            this.scene.time.delayedCall(1700, () => {
                EventBus.emit('dark-mode', true);
                this.scene.diceManager.handleJailDiceRoll(this.tiles, this.players, [1, 2]); // TODO: dados carcel
            });
        });

        // resultados dados
        EventBus.on('jail-dice-rolled', (res: { val1: number, val2: number }) => {
            //const p = this.scene.getLocalPlayer();
            const p = this.getActivePlayer();
            console.log("Jugador actual in jail-dice-rolled:", p?.model.id);
            if (!p) return;

            const isDouble = res.val1 === res.val2;
            const steps = res.val1 + res.val2;
            
            const currentIndex = this.tiles.findIndex(t => t.tileConfig.id === p.model.currentTileId);
            //const targetTile = this.tiles[(currentIndex + steps) % this.tiles.length];
            const targetId = "108"; // TODO: resultados de los dados
            const jailId = "104";

            if (isDouble) {
                BoardEffects.setFocusByIds(this.tiles, [targetId], this.scene, this.players.map(p=>p.token));
                this.scene.showToast('¡Dobles! Sales libre.');
                p.model.jailRemainingTurns = 0;
                p.model.emitUpdate();
                this.scene.time.delayedCall(1500, () => {
                    this.scene.diceManager.clearDice();
                    EventBus.emit('close-overlay');
                    EventBus.emit('dark-mode', false);
                    EventBus.emit('execute-in-jail-travel', { targetId: targetId });
                });
                
            } else {
                if (p.model.jailRemainingTurns >= 3) {
                    BoardEffects.setFocusByIds(this.tiles, [targetId], this.scene, this.players.map(p=>p.token));
                    this.scene.showToast('¡Tercer turno! Debes pagar la fianza obligatoriamente');
                    this.setupJailClick(targetId, 'pay');
                } else {
                    BoardEffects.setFocusByIds(this.tiles, [jailId, targetId], this.scene, this.players.map(p=>p.token));
                    this.setupJailClick(jailId, 'stay');
                    this.setupJailClick(targetId, 'pay');
                }
                p.model.jailRemainingTurns++;
                p.model.emitUpdate();
            }
        });

        // Pago de fianza 
        EventBus.on('execute-jail-bail-payment', (pay: { amount: number }) => {
            this.tiles.forEach(t => t.disableInteractive());
            //const p = this.scene.getLocalPlayer();
			//TODO quitar porque esto vendrá por una response
            const p = this.getActivePlayer();
            if (p && p.model.balance >= pay.amount) { // TODO: ajustar dinero players
                p.model.balance -= pay.amount;
                p.model.jailRemainingTurns = 0;
                this.scene.showToast("Fianza pagada");
                EventBus.emit('player-updated', p.model);
                EventBus.emit('close-overlay');
            } else {
                this.scene.showToast("Saldo insuficiente."); // TODO: NO pasa esto, simplemente pasaría a fase de liquidación
            }
        });

        EventBus.on('jail-re-enable-selection', () => {
			// TODO usar el modelo bueno 
            //const p = this.scene.getLocalPlayer();
            const p = this.getActivePlayer();
            console.log("Jugador actual in jail-re-enalble:", p?.model.id);
            if (!p) return;

            const jailId = "104";
            const targetId = "108"; // ID de destino tras los dados

            if (p.model.jailRemainingTurns >= 3) {
                BoardEffects.setFocusByIds(this.tiles, [targetId], this.scene, this.players.map(p => p.token));
                this.setupJailClick(targetId, 'pay');
            } else {
                BoardEffects.setFocusByIds(this.tiles, [jailId, targetId], this.scene, this.players.map(p=>p.token));
                this.setupJailClick(jailId, 'stay'); 
                this.setupJailClick(targetId, 'pay');
            }
        });

        EventBus.on('execute-in-jail-travel', (data: {targetId: string }) => {
        	//const p = this.scene.getLocalPlayer();
            const p = this.getActivePlayer();
            if (!p) return;

			const targetTile = this.tiles.find(t => t.tileConfig.id === data.targetId);
            if (!targetTile) return;
            this.tiles.forEach(t => t.disableInteractive());

			const path = [{ x: targetTile?.x, y: targetTile?.y }];
			p.token.moveToCoords(path, () => {
				 this.scene.time.delayedCall(800, () => {
				 	this.scene.tileLogicManager.checkTileLogic(p.model, targetTile, this.players);
				 });
			});
		});

    }
    
    private setupJailClick(tileId: string, mode: 'free' | 'pay' | 'stay') {
        const tile = this.tiles.find(t => t.tileConfig.id === tileId);
        if (!tile) return;

        tile.removeAllListeners('pointerdown');
        tile.setInteractive({ useHandCursor: true });
        
        tile.once('pointerdown', () => {
            const p = this.scene.getLocalPlayer();
            EventBus.emit('show-jail-decision-popup', {
                tileId: tileId,
                tileName: tile.tileConfig.name,
                mode: mode, // 'pay' (50€) o 'stay' (pasar turno)
                turnCount: p?.model.jailRemainingTurns || 0
            });
        });
    }

    private billEvent() {
        EventBus.on('animate-bill', (data: { playerId: string, amount?: string }) => {
            this.scene.animationManager.BillAnimation(data.playerId, 15, data.amount);
        });
    }
    
}
