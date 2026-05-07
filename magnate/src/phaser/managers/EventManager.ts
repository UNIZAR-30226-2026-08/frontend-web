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

        EventBus.on('jail-dice-rolled', (res: { val1: number, val2: number }) => {
            const isDouble = res.val1 === res.val2;
            if (isDouble) {
                this.scene.showToast('¡Dobles! Sales libre.');
            }
        });

        EventBus.on('jail-re-enable-selection', () => {
            console.log("EventManager: Re-habilitando selección de cárcel...");
        });
    }
    
    private setupJailClick(tileId: string, mode: 'free' | 'pay' | 'stay', playerModel?: PlayerModel) {
        const tile = this.tiles.find(t => t.tileConfig.id === tileId);
        if (!tile) return;
        console.log("En setupJailClick con mode:", mode);
        tile.removeAllListeners('pointerdown');
        tile.setInteractive({ useHandCursor: true });
        
        tile.once('pointerdown', () => {
            
            EventBus.emit('show-jail-decision-popup', {
                tileId: tileId,
                tileName: tile.tileConfig.name,
                mode: mode, // 'pay' (50€) o 'stay' (pasar turno)
                turnCount: playerModel?.jailRemainingTurns || 0
            });
        });
    }
    
}
