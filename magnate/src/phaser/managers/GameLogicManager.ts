import { GameModel } from '@/phaser/models/GameModel';
import { GameState } from '@/services/types/socket';
import { EventBus } from '@/EventBus';
import * as WSTypes from "@/services/types/socket";
import { TramTile } from '../objects/TramTile';

export class GameLogicManager {
    private static instance: GameLogicManager;
	private populated: boolean = false;
    public model: GameModel;
    private lastPendingProposal: any = null;

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

        // Response general
        EventBus.on('report-response', (data: any) => {
            console.log("Modelo actual:", this.model);
            const isNewTurn = this.model.active_turn_player !== data.active_turn_player;
            const isNewPhase = this.model.phase !== data.phase;

            this.model.active_phase_player = data.active_phase_player;
            this.model.active_turn_player = data.active_turn_player;
            this.model.phase = data.phase;
            this.model.parking_money = data.parking_money;

            // Actualizar dinero
            if (data.money) {
                this.updateBalances(data.money);
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
                    EventBus.emit('model-updated', this.model);
                }, 2800);

            } else if (isNewPhase) {
                console.log(`Cambio de Fase: pasamos a ${data.phase}`);
                EventBus.emit('model-updated', this.model);
                this.updateHUDControls(data.phase);
            }
            console.log("Response general:", data);
            console.log("Modelo actual:", this.model);

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

            if (data.fantasy_event) { // para guardar proximo  evento fantasía
                this.model.setFantasyEvent(data.fantasy_event.fantasy_type, data.fantasy_event.value);
            }
            
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

            if (data.fantasy_event) { // para guardar proximo evento fantasía
                this.model.setFantasyEvent(data.fantasy_event.fantasy_type, data.fantasy_event.value);
            }
        
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

        EventBus.on('new-chat-message', (data: any) => {
            console.log("El mensajito", data);
            
            const senderName = data.user;
            const messageText = data.msg?.text || "";

            const player = Object.values(this.model.players).find(p => p.name === senderName);
            
            const isSender = player ? player.id === this.model.myId : false;

            const playerColor = player 
                ? `#${player.color.toString(16).padStart(6, '0')}` 
                : "#9ca3af";

            EventBus.emit('receive-chat-message', {
                playerId: player ? player.id : "unknown",
                playerName: senderName,
                playerColor: playerColor,
                text: messageText,
                isSender: isSender
            });
        });
        
        EventBus.on('report-response-movement', (data: any) => {
            console.log("Manager: Movimiento", data);
            if (data.fantasy_event) {
                this.model.setFantasyEvent(data.fantasy_event.fantasy_type, data.fantasy_event.value);
            }
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

                // EventBus.emit('view-animate-money', { 
                //     playerId: playerId, 
                //     amount: `-${property.buyPrice}M`,
                //     numBill: 8
                // });

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

        EventBus.on('report-action-take-tram', (data: any) => {
            console.log("Manager: Alguien ha tomado el tranvía", data);

            const movingPlayerId = String(data.player);
            const targetTileId = String(data.square).padStart(3, '0');

            EventBus.emit('execute-tram-travel', {
                playerId: movingPlayerId, 
                targetId: targetTileId
            });
        });

        // ---------------------- NEGOCIACIONES ----------------------
        EventBus.on('report-action-trade-proposal', (data: WSTypes.GameReportTradeProposal) => {
            console.log("Manager: Nueva propuesta de trato recibida", data);
            const myId = localStorage.getItem('myId');
            
            this.lastPendingProposal = data;
            
            if (String(data.destination_user) !== String(myId)) {
                console.log("Manager: El trato no es para mí, ignoro el overlay.");
                return; 
            }

            const offeringPlayer = this.model.getPlayer(String(data.player));
            const askedPlayer = this.model.getPlayer(String(data.destination_user));

            // Función para convertir IDs de propiedades en objetos para la UI
            const mapProperties = (ids: string[]) => {
                return ids.map(id => {
                    const prop = this.model.getProperty(String(id).padStart(3, '0'));
                    return {
                        id: id,
                        name: prop?.name || `Propiedad ${id}`,
                        color: prop?.color || '#cbd5e1'
                    };
                });
            };

            const proposalData = {
                offeringPlayer: {
                    id: offeringPlayer?.id,
                    name: offeringPlayer?.name,
                    color: offeringPlayer ? this.model.getPlayerColor(offeringPlayer.id) : '#ffffff'
                },
                askedPlayer: {
                    id: askedPlayer?.id,
                    name: askedPlayer?.name,
                    color: askedPlayer ? this.model.getPlayerColor(askedPlayer.id) : '#cbd5e1'
                },
                offeredMoney: data.offered_money,
                askedMoney: data.asked_money,
                offeredProperties: mapProperties(data.offered_properties || []),
                askedProperties: mapProperties(data.asked_properties || []),
            };
            this.lastPendingProposal = data;
            EventBus.emit('show-trade-request', proposalData);
        });

        EventBus.on('report-action-trade-answer', (data: any) => {
            const accepted = data.accept;
            console.log("Manager: ¿Trato aceptado?", accepted);
            console.log("lastPendingProposal",  this.lastPendingProposal);
            
            if (accepted && this.lastPendingProposal) {
                this.executeTradeTransfer(this.lastPendingProposal);
                EventBus.emit('show-toast', { 
                    message: "¡El trato se ha cerrado con éxito!", 
                    duration: 4000 
                });
                this.lastPendingProposal = null;
            } else if (!accepted) {
                EventBus.emit('show-toast', { 
                    message: `La propuesta ha sido rechazada.`, 
                    duration: 3000 
                });
                this.lastPendingProposal = null;
            }
            EventBus.emit('model-updated', this.model);
        });

        // Hipotecar
        EventBus.on('report-action-mortgage-set', (data: any) => {
            const propId = String(data.square).padStart(3, '0');
            const prop = this.model.getProperty(propId);
            if (prop) {
                prop.isMortgaged = true;
                prop.houseCount = 0;
                this.updateBalances(data.money);
                EventBus.emit('model-updated', this.model);
                EventBus.emit('update-tile-mortgage-visual', { tileId: propId, isMortgaged: true });
            }
        });

        // Deshipotecar
        EventBus.on('report-action-mortgage-unset', (data: any) => {
            const propId = String(data.square).padStart(3, '0');
            const prop = this.model.getProperty(propId);
            if (prop) {
                prop.isMortgaged = false;

                this.updateBalances(data.money);
                EventBus.emit('model-updated', this.model);
                EventBus.emit('update-tile-mortgage-visual', { tileId: propId, isMortgaged: false });
            }
        });

        // CONSTRUIR Y DEMOLER CASAS
        EventBus.on('report-action-build', (data: any) => {
            const propId = String(data.square).padStart(3, '0');
            const prop = this.model.getProperty(propId);
            if (prop) {
                prop.houseCount += data.houses; 
                EventBus.emit('model-updated', this.model);
                EventBus.emit('view-update-tile-construction', { 
                    tileId: propId, 
                    level: prop.houseCount 
                });
            }
        });

        EventBus.on('report-action-demolish', (data: any) => {
            const propId = String(data.square).padStart(3, '0');
            const prop = this.model.getProperty(propId);
            if (prop) {
                prop.houseCount -= data.houses;
                EventBus.emit('model-updated', this.model);
                EventBus.emit('view-update-tile-construction', { 
                    tileId: propId, 
                    level: prop.houseCount 
                });
            }
        });

        // fantasía

        // Si se ha elegido la carta vista, actualiza; si se ha elegido la oculta 
        EventBus.on('report-response-choose-fantasy', (data: any) => {
            console.log("Manager: resultado de fantasía recibido", data);

            // actualizar dinero
            if (data.money) this.updateBalances(data.money);

            // actualizar posiciones
            if (data.positions) {
                Object.entries(data.positions).forEach(([id, pos]) => {
                    const playerId = String(id);
                    const newPos = String(pos).padStart(3, '0');
                    
                    this.model.updatePlayerPosition(playerId, newPos);
                });
            }

            if (data.fantasy_result && data.fantasy_result.fantasy_event) {
                const event = data.fantasy_result.fantasy_event;
                this.handleFantasyEventEffect(event.fantasy_type, event.value, data.fantasy_result.result);
                
                EventBus.emit('fantasy-card-result-applied', {
                    type: event.fantasy_type,
                    value: event.value,
                    cost: event.card_cost,
                    result: data.fantasy_result.result
                });
            }

            EventBus.emit('model-updated', this.model);
        });

        // BANCARROTA
        EventBus.on('report-action-surrender', (data: WSTypes.GameReportSender) => {
            const playerId = String(data.player);
            const player = this.model.getPlayer(playerId);

            if (player) {
                console.log(`Manager: Procesando bancarrota de ${player.name} (${playerId})`);

                // Liberamos todas las propiedades que pertenecían a ese jugador
                const playerPropertiesIds = [...player.properties];
                
                playerPropertiesIds.forEach(id => {
                    const normalizedId = String(id).padStart(3, '0');
                    this.model.setPropertyOwner(normalizedId, null);
                    const prop = this.model.getProperty(normalizedId);
                    
                    if (prop) {
                        prop.houseCount = 0;
                        prop.isMortgaged = false;

                        EventBus.emit('update-tile-owner-visual', {
                            tileId: normalizedId,
                            playerColor: null,
                            playerId: null
                        });
                        EventBus.emit('view-update-tile-construction', { tileId: id, level: 0 });
                        EventBus.emit('update-tile-mortgage-visual', { tileId: id, isMortgaged: false });
                    }
                });
                
                this.model.orderedPlayers = this.model.orderedPlayers.filter(id => id !== playerId);
                // Eliminar ficha
                EventBus.emit('view-remove-player', { playerId: playerId });
                EventBus.emit('show-toast', { 
                    message: `${player.name} se ha declarado en bancarrota`,
                    duration: 4000 
                });

                delete this.model.players[playerId];
                EventBus.emit('model-updated', this.model);
                
            }
        });

		EventBus.on('pause-game', () => {
			this.model.isPaused = true;
            EventBus.emit('model-updated', this.model);
			// whatevs you need now (?) TODO
		});
    }

    private updateHUDControls(phase: string) {
        const isMe = this.model.isMyTurn();
        const myId = this.model.myId;
        
        if (phase === 'roll_the_dices') {
            EventBus.emit('update-turn-controls', isMe);
        } else if (phase === 'business') {
            const tile = this.model.getPlayerPosition(this.model.myId);
            
            // Si me muevo a otra casilla de tranvía, mo vuelvo a interactuar -> tienen que habilitarse los botones de business
            if (tile in ["010", "030", "100", "107"]) {
                EventBus.emit('update-controls-state', {
                    roll: false, administer: isMe, trade: isMe, finishTurn: isMe, bankrupt: true
                });
                return;
                
            } 
            if ((tile in this.model.boardProperties) && this.model.boardProperties[tile].ownerId !== null) {
                if (this.model.boardProperties[tile].ownerId === myId) {
                    EventBus.emit('update-controls-state', {
                        roll: false, administer: isMe, trade: isMe, finishTurn: isMe, bankrupt: true
                    });
                    return; // es propiedad/server/puente y tiene dueño -> sale porque tiene que ir al overlay de pagar primero
                } else {
                    console.log("Manager: Casilla de otro jugador");
                    return;
                }
            } 

            EventBus.emit('update-controls-state', {
                roll: false, administer: isMe, trade: isMe, finishTurn: isMe, bankrupt: true
            });
        } else if (phase === 'auction') {
            console.log("Empieza subastaaaa!!");
            EventBus.emit('update-controls-state', {
                roll: false, administer: false, trade: false, finishTurn: false, bankrupt: true
            });
        } else if (phase === 'proposal_acceptance') {
            console.log("Enviando propuesta de trato al otro tío");
        }  else if (phase === 'choose_fantasy') {
            console.log("Manager: empieza fantasía");
        }
    }

    private updateBalances(moneyMap: Record<string, number>) {
        if (!moneyMap) return;
        Object.entries(moneyMap).forEach(([id, bal]) => {
            const p = this.model.getPlayer(id);
            if (p) {
                p.balance = Number(bal);
                p.emitUpdate(); // actualiza player
            }
        });
    }
    
    // Procesa el intercambio de dinero y propiedades entre dos jugadores
    private executeTradeTransfer(data: any) {
        console.log("Entrando en actualizacion de tradeos:");
        const senderId = String(data.player);
        const receiverId = String(data.destination_user);
    
        const sender = this.model.getPlayer(senderId);
        const receiver = this.model.getPlayer(receiverId);

        if (!sender || !receiver) return;

        // --- TRANSFERENCIA DE PROPIEDADES ---
        const transferProperties = (propIds: string[], newOwnerId: string) => {
            propIds.forEach(id => {
                const normalizedId = String(id).padStart(3, '0');
                
                // actualizamos owners
                this.model.setPropertyOwner(normalizedId, newOwnerId);

                // actualizamos marcadores
                const colorStr = this.model.getPlayerColor(newOwnerId);
                const colorNum = parseInt(colorStr.replace('#', '0x'), 16);
                
                EventBus.emit('update-tile-owner-visual', {
                    tileId: normalizedId,
                    playerColor: colorNum,
                    playerId: newOwnerId
                });
            });
        };

        if (data.offered_properties) transferProperties(data.offered_properties, receiverId);
        if (data.asked_properties) transferProperties(data.asked_properties, senderId);

        // --- TRANSFERENCIA DE DINERO ---
        const moneyOffered = Number(data.offered_money || 0);
        const moneyAsked = Number(data.asked_money || 0);

        // Actualizar balances
        const senderChange = moneyAsked - moneyOffered;
        if (senderChange !== 0) {
            this.syncPlayerMoney(senderId, senderChange);
        }

        const receiverChange = moneyOffered - moneyAsked;
        if (receiverChange !== 0) {
            this.syncPlayerMoney(receiverId, receiverChange);
        }
        EventBus.emit('model-updated', this.model);
        console.log(`[tradeando] Sincronización completa. ${sender.name}: ${sender.balance}M | ${receiver.name}: ${receiver.balance}M`);
    }

    public syncPlayerMoney(playerId: string, amount: number, showAnimation: boolean = true) {
        const player = this.model.getPlayer(playerId);
        if (!player || amount === 0) return;

        this.model.updatePlayerBalance(playerId, amount);
        console.log("balance del player", this.model.getPlayerBalance(playerId));

        player.emitUpdate();
        // if (showAnimation) {
        //     EventBus.emit('view-animate-money', {
        //         playerId: playerId,
        //         amount: `${amount > 0 ? '+' : ''}${amount}M`,
        //         numBill: amount
        //     });
        // }
    }

    private handleFantasyEventEffect(type: WSTypes.FantasyEventType, value: any, result: any) {
        const myId = this.model.myId;
        const activePlayerId = String(this.model.active_turn_player);
        const activePlayer = this.model.getPlayer(activePlayerId);

        console.log(`Efecto Fantasía: ${type} con valor:`, value);

        switch (type) {
            // --- EVENTOS DE DINERO ---
            // case 'winPlainMoney':
            // case 'winRatioMoney':
            // case 'losePlainMoney':
            // case 'loseRatioMoney':

            // case 'getParkingMoney':

            case 'shareMoneyAll': // Todos reciben dinero
                Object.keys(this.model.players).forEach(id => {
                    this.syncPlayerMoney(id, Number(value));
                });
                break;

            case 'everybodySendsYouMoney':
                // Todos pierden X y tú ganas X * cantidad de jugadores
                Object.keys(this.model.players).forEach(id => {
                    if (id !== activePlayerId) {
                        this.syncPlayerMoney(id, -Number(value));
                        this.syncPlayerMoney(activePlayerId, Number(value));
                    }
                });
                break;

            // --- EVENTOS DE MOVIMIENTO ---
            case 'goToJail':
            case 'sendToJail':
                if (activePlayer) activePlayer.jailRemainingTurns = 3;
                break;

            case 'goToStart':
            case 'moveAnywhereRandom':
            case 'magnetism':
                break;

            // --- EVENTOS DE PROPIEDADES ---
            case 'breakOpponentHouse':
            case 'breakOwnHouse':
                const propToBreak = this.model.getProperty(String(value).padStart(3, '0'));
                if (propToBreak && propToBreak.houseCount > 0) {
                    propToBreak.houseCount--;
                    EventBus.emit('view-update-tile-construction', { 
                        tileId: propToBreak.id, 
                        level: propToBreak.houseCount 
                    });
                }
                break;

            case 'earthquake':
                // Quitar casas de todas las propiedades del tablero
                Object.values(this.model.boardProperties).forEach(prop => {
                    if (prop.houseCount > 0) {
                        prop.houseCount = 0;
                        EventBus.emit('view-update-tile-construction', { tileId: prop.id, level: 0 });
                    }
                });
                break;

            case 'reviveProperty':
                // Quitar hipoteca de una propiedad
                const propToFix = this.model.getProperty(String(value).padStart(3, '0'));
                if (propToFix) {
                    propToFix.isMortgaged = false;
                    EventBus.emit('update-tile-mortgage-visual', { tileId: propToFix.id, isMortgaged: false });
                }
                break;

            default:
                console.warn(`No hay efecto para esa fantasía: ${type}`);
                break;
        }

        EventBus.emit('model-updated', this.model);
    }

}