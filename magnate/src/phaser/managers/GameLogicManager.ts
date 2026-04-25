import { GameModel } from '@/phaser/models/GameModel';
import { GameState } from '@/services/types/socket';
import { EventBus } from '@/EventBus';
import * as WSTypes from "@/services/types/socket";

export class GameLogicManager {
    private static instance: GameLogicManager;
	private populated: boolean = false;
    public model: GameModel;

    private constructor() {
        this.model = new GameModel();
        this.setupCentralListeners();
    }

    public static getInstance(): GameLogicManager {
        if (!GameLogicManager.instance) {
            GameLogicManager.instance = new GameLogicManager();
        }
        return GameLogicManager.instance;
    }

    private setupCentralListeners() {
        // -- Game State
        EventBus.on('new-game-state', async (new_state: GameState) => {
            console.log("Manager: Received new state", new_state.id);
			if (!this.populated) {
                await this.model.populate(new_state);
				this.populated = true;
			} else {
            	this.model.updateState(new_state);
			}
            EventBus.emit('model-updated', this.model);
        });

        EventBus.on('report-response-throw-dices', (data: any) => {
            // TODO: --- inicio dados
            console.log("Manager: Rolling dices...", data);
            EventBus.emit('trigger-dice-roll', {
                dice1: data.dice1,
                dice2: data.dice2,
                dice_bus: data.dice_bus,
                destinations: data.destinations || []
            });

            
            if (data.destinations?.length === 1) {
                console.log("Manager: Square forced, waiting for dice to land...");

                EventBus.once('dice-roll-complete', () => {
                    setTimeout(() => {
                        const movingPlayerId = String(data.active_turn_player); 
                        if (data.path && data.path.length > 0) {
                            const finalDestination = data.path[data.path.length - 1]; 
                            this.model.updatePlayerPosition(movingPlayerId, String(finalDestination).padStart(3, '0'));
                        }
            
                        EventBus.emit('clear-dice'); 
            
                        EventBus.emit('view-animate-path', {
                            playerId: movingPlayerId,
                            path: data.path,
                        });
                        
                        EventBus.emit('model-updated', this.model);
                    }, 1800);
                });

            }
            
            EventBus.emit('model-updated', this.model);
        });

        EventBus.on('report-response-choose-square', (data: any) => {
            console.log("Manager: Square chosen...", data);
        
            const movingPlayerId = String(data.active_turn_player); 
            if (data.path && data.path.length > 0) {
                const finalDestination = data.path[data.path.length - 1]; 
                this.model.updatePlayerPosition(movingPlayerId, String(finalDestination).padStart(3, '0'));
            }
        
            EventBus.emit('clear-dice'); 
        
            EventBus.emit('view-animate-path', {
                playerId: movingPlayerId,
                path: data.path,
            });
        
            EventBus.emit('model-updated', this.model);
        });

        EventBus.on('report-response', (data: any) => {
            const isNewTurn = this.model.active_turn_player !== data.active_turn_player;
            const isNewPhase = this.model.phase !== data.phase;

            this.model.active_phase_player = data.active_phase_player;
            this.model.active_turn_player = data.active_turn_player;
            this.model.phase = data.phase;

            // Actualizar dinero
            if (data.money) {
                Object.entries(data.money).forEach(([id, bal]) => {
                    const p = this.model.getPlayer(id);
                    if (p) p.balance = Number(bal);
                });
            }
            // Actualizar posiciones
            if (data.positions) {
                Object.entries(data.positions).forEach(([id, pos]) => {
                    this.model.updatePlayerPosition(String(id), String(pos).padStart(3, '0'));
                });
            }

            if(isNewTurn) {
                console.log(`Cambio de Turno: turno del jugador ${data.active_turn_player}`);
                EventBus.emit('view-new-turn', this.model);
                setTimeout(() => {
                    this.updateHUDControls(data.phase);
                }, 2800);

            } else if (isNewPhase) {
                console.log(`Cambio de Fase: pasamos a ${data.phase}`);
                this.updateHUDControls(data.phase);
            }
            
            console.log("Response general", this.model);
        });

        // ---------------------- COMPRA PROPIEDAD ----------------------
        EventBus.on('report-action-buy-square', (data: WSTypes.GameReportSquare) => {
            const playerId = String(data.player);
            const propId = String(data.square).padStart(3, '0');
            
            const property = this.model.getProperty(propId);
            const player = this.model.getPlayer(playerId);

            if (property && player) {
                // Actualizamos el dueño en el modelo
                this.model.setPropertyOwner(propId, playerId);

                player.balance -= property.buyPrice; 

                EventBus.emit('property-bought', {
                    tileId: propId,
                    playerId: player.id,
                    playerColor: player.color
                });
                EventBus.emit('model-updated', this.model);

                console.log(`Jugador ${player.name} ha comprado ${property.name}`);
            }
        });

        
        // ---------------------- SUBASTAS ----------------------
        // Alguien ha rechazado comprar propiedad -> empieza subasta par el resto
        EventBus.on('report-action-drop-purchase', (data: WSTypes.GameReportSquare) => {
            console.log("!!! EVENTO RECIBIDO EN MANAGER !!!");
            const playerId = String(data.player);
            const propId = String(data.square).padStart(3, '0');
            const propertyData = this.model.getProperty(propId);
            
            console.log(`Manager: El jugador ${playerId} ha rechazado comprar la casilla ${propId}.`);
            EventBus.emit('close-overlay');

            //  Mostrar un mensaje informativo (Toast)
            const player = this.model.getPlayer(playerId);
            if (player) {
                EventBus.emit('show-toast', { 
                    message: `${player.name} ha enviado la propiedad a subasta`,
                    duration: 3000 
                });
            }
            const myId = localStorage.getItem('myId');
            const me = this.model.getPlayer(String(myId));
            const jail = this.model.getPlayer(String(myId))?.jailRemainingTurns ?? 0;
            if (this.model.isMyTurn() ||  jail > 0) { // El que la rechaza y los de la carcel NO participan subasta
                return;
            }
            const special = propertyData?.group === 13 || propertyData?.group === 14;
            EventBus.emit('show-auction-overlay', {
                auctionData: data,
                property: propertyData,
                myBalance: me?.balance ?? 0,
                phase: this.model.phase,
                special: special
            });

        });

        EventBus.on('report-response-auction', (data: any) => {
            console.log("Manager: Auction update received", data);

            const auctionInfo = data.auction;
            if (!auctionInfo) return;

            const participants = Object.entries(auctionInfo.bids || {}).map(([userId, amount]) => {
                return {
                    id: userId,
                    name: this.model.getPlayerName(userId),
                    bid: Number(amount),
                    color: this.model.getPlayerColor(userId),
                    isWinner: false
                };
            });

            participants.sort((a, b) => b.bid - a.bid);

            let winner = null;
            let isTie = false;

            if (participants.length > 0) {
                const highestBid = participants[0].bid;
                const hasTie = participants.length > 1 && participants[1].bid === highestBid;
                

                if (hasTie) {
                    isTie = true;
                    console.log("Manager: empate en la puja más alta.");
                } else if (highestBid > 0) { // Si no hay empate y la puja no es 0, hay ganador
                    participants[0].isWinner = true;
                    winner = participants[0];
                    
                    // Actualizamos el dueño en el modelo local
                    const propId = String(auctionInfo.square).padStart(3, '0');
                    const winnerId = String(winner.id);
                    this.model.setPropertyOwner(propId, winnerId);
                    const rawColor = this.model.getPlayerColor(winnerId); 
                    const colorInt = parseInt(rawColor.replace('#', '0x'), 16);
                    EventBus.emit('property-bought', {
                        tileId: propId,
                        playerColor: colorInt,
                        playerId: winnerId
                    });
                }
            }

            EventBus.emit('show-auction-overlay-results', {
                property: this.model.getProperty(String(auctionInfo.square).padStart(3, '0')),
                participants: participants,
                winner: winner,
                isTie: isTie, // hay empate
                finalCount: auctionInfo.final_amount
            });
            EventBus.emit('model-updated', this.model);
        });

		EventBus.on('pause-game', () => {
			this.model.isPaused = true;
            EventBus.emit('model-updated', this.model);
			// whatevs you need now (?) TODO
		});
    }

    private updateHUDControls(phase: string) {
        const isMe = this.model.isMyTurn();
        if (phase === 'roll_the_dices') {
            EventBus.emit('update-turn-controls', isMe);
        } else if (phase === 'business') {
            const tile = this.model.getPlayerPosition(this.model.myId);
            if (! (tile in this.model.boardProperties) || this.model.boardProperties[tile].ownerId === null) {
                return;
            }
            EventBus.emit('update-controls-state', {
                roll: false, administer: isMe, trade: isMe, finishTurn: isMe, bankrupt: true
            });
        } else if (phase === 'auction') {
            console.log("Empieza subastaaaa");
        }
    }
}
