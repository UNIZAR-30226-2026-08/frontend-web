import { GameModel } from '@/phaser/models/GameModel';
import { EventBus } from '@/EventBus';
export class GameLogicManager {
    static instance;
    populated = false;
    model;
    lastPendingProposal = null;
    constructor() {
        this.model = new GameModel();
        this.setupCentralListeners();
    }
    static getInstance() {
        if (!GameLogicManager.instance) {
            GameLogicManager.instance = new GameLogicManager();
        }
        return GameLogicManager.instance;
    }
    setupCentralListeners() {
        // -- Game State
        EventBus.on('new-game-state', async (new_state) => {
            console.log("Manager: Received new state", new_state.id);
            if (!this.populated) {
                await this.model.populate(new_state);
                this.populated = true;
            }
            else {
                this.model.updateState(new_state);
            }
            EventBus.emit('model-updated', this.model);
        });
        EventBus.on('report-response-throw-dices', (data) => {
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
        EventBus.on('report-response-choose-square', (data) => {
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
        EventBus.on('new-chat-message', (data) => {
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
        EventBus.on('report-response', (data) => {
            const isNewTurn = this.model.active_turn_player !== data.active_turn_player;
            const isNewPhase = this.model.phase !== data.phase;
            this.model.active_phase_player = data.active_phase_player;
            this.model.active_turn_player = data.active_turn_player;
            this.model.phase = data.phase;
            // Actualizar dinero
            if (data.money) {
                Object.entries(data.money).forEach(([id, bal]) => {
                    const p = this.model.getPlayer(id);
                    if (p) {
                        p.balance = Number(bal);
                        p.emitUpdate();
                    }
                });
            }
            // Actualizar posiciones
            if (data.positions) {
                Object.entries(data.positions).forEach(([id, pos]) => {
                    this.model.updatePlayerPosition(String(id), String(pos).padStart(3, '0'));
                });
            }
            if (isNewTurn) {
                console.log(`Cambio de Turno: turno del jugador ${data.active_turn_player}`);
                EventBus.emit('view-new-turn', this.model);
                setTimeout(() => {
                    this.updateHUDControls(data.phase);
                }, 2800);
            }
            else if (isNewPhase) {
                console.log(`Cambio de Fase: pasamos a ${data.phase}`);
                this.updateHUDControls(data.phase);
            }
            // EventBus.emit('model-updated', this.model);
            console.log("Response general:", data);
            console.log("Modelo actual:", this.model);
        });
        // ---------------------- COMPRA PROPIEDAD ----------------------
        EventBus.on('report-action-buy-square', (data) => {
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
        EventBus.on('report-action-drop-purchase', (data) => {
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
            if (this.model.isMyTurn() || jail > 0) { // El que la rechaza y los de la carcel NO participan subasta
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
        EventBus.on('report-response-auction', (data) => {
            console.log("Manager: Auction update received", data);
            const auctionInfo = data.auction;
            if (!auctionInfo)
                return;
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
                }
                else if (highestBid > 0) { // Si no hay empate y la puja no es 0, hay ganador
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
        // ---------------------- NEGOCIACIONES ----------------------
        EventBus.on('report-action-trade-proposal', (data) => {
            console.log("Manager: Nueva propuesta de trato recibida", data);
            const myId = localStorage.getItem('myId');
            if (String(data.destination_user) !== String(myId)) {
                console.log("Manager: El trato no es para mí, ignoro el overlay.");
                return;
            }
            const offeringPlayer = this.model.getPlayer(String(data.player));
            const askedPlayer = this.model.getPlayer(String(data.destination_user));
            // Función para convertir IDs de propiedades en objetos para la UI
            const mapProperties = (ids) => {
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
                    name: offeringPlayer?.name,
                    color: offeringPlayer?.color
                },
                askedPlayer: {
                    name: askedPlayer?.name,
                    color: askedPlayer?.color
                },
                offeredMoney: data.offered_money,
                askedMoney: data.asked_money,
                offeredProperties: mapProperties(data.offered_properties || []),
                askedProperties: mapProperties(data.asked_properties || []),
            };
            this.lastPendingProposal = data;
            EventBus.emit('show-trade-request', proposalData);
        });
        EventBus.on('report-action-trade-answer', (data) => {
            const accepted = data.accept;
            if (accepted && this.lastPendingProposal) {
                this.executeTradeTransfer(this.lastPendingProposal);
                EventBus.emit('show-toast', {
                    message: "¡El trato se ha cerrado con éxito!",
                    duration: 4000
                });
                this.lastPendingProposal = null;
            }
            else {
                EventBus.emit('show-toast', {
                    message: `La propuesta ha sido rechazada.`,
                    duration: 3000
                });
                this.lastPendingProposal = null;
            }
            EventBus.emit('model-updated', this.model);
        });
        // Hipotecar
        EventBus.on('report-action-mortgage-set', (data) => {
            const propId = String(data.square).padStart(3, '0');
            const prop = this.model.getProperty(propId);
            if (prop) {
                prop.isMortgaged = true;
                prop.houseCount = 0;
                EventBus.emit('model-updated', this.model);
                EventBus.emit('update-tile-mortgage-visual', { tileId: propId, isMortgaged: true });
            }
        });
        // Deshipotecar
        EventBus.on('report-action-mortgage-unset', (data) => {
            const propId = String(data.square).padStart(3, '0');
            const prop = this.model.getProperty(propId);
            if (prop) {
                prop.isMortgaged = false;
                EventBus.emit('model-updated', this.model);
                EventBus.emit('update-tile-mortgage-visual', { tileId: propId, isMortgaged: false });
            }
        });
        EventBus.on('report-action-build', (data) => {
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
        EventBus.on('report-action-demolish', (data) => {
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
        EventBus.on('report-action-surrender', (data) => {
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
    updateHUDControls(phase) {
        const isMe = this.model.isMyTurn();
        const myId = this.model.myId;
        if (phase === 'roll_the_dices') {
            EventBus.emit('update-turn-controls', isMe);
        }
        else if (phase === 'business') {
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
                }
                else {
                    console.log("Manager: Casilla de otro jugador");
                    return;
                }
            }
            EventBus.emit('update-controls-state', {
                roll: false, administer: isMe, trade: isMe, finishTurn: isMe, bankrupt: true
            });
        }
        else if (phase === 'auction') {
            console.log("Empieza subastaaaa");
        }
        else if (phase === 'proposal_acceptance') {
            console.log("Enviando propuesta de trato al otro tío");
        }
    }
    // Procesa el intercambio de dinero y propiedades entre dos jugadores
    executeTradeTransfer(data) {
        console.log("Entrando en actualizacion de tradeos:");
        const senderId = String(data.player);
        const receiverId = String(data.destination_user);
        const sender = this.model.getPlayer(senderId);
        const receiver = this.model.getPlayer(receiverId);
        if (!sender || !receiver)
            return;
        // --- TRANSFERENCIA DE PROPIEDADES ---
        const transferProperties = (propIds, newOwnerId) => {
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
        if (data.offered_properties)
            transferProperties(data.offered_properties, receiverId);
        if (data.asked_properties)
            transferProperties(data.asked_properties, senderId);
        // --- TRANSFERENCIA DE DINERO ---
        const moneyOffered = Number(data.offered_money || 0);
        const moneyAsked = Number(data.asked_money || 0);
        // Actualizar balances
        sender.balance -= moneyOffered;
        sender.balance += moneyAsked;
        receiver.balance += moneyOffered;
        receiver.balance -= moneyAsked;
        // --- animaciones ---
        if (moneyOffered > 0) {
            EventBus.emit('view-animate-money', { playerId: senderId, numBill: 6, amount: `-${moneyOffered}M` });
        }
        if (moneyAsked > 0) {
            EventBus.emit('view-animate-money', { playerId: receiverId, numBill: 6, amount: `-${moneyAsked}M` });
        }
        console.log(`[tradeando] Sincronización completa. ${sender.name}: ${sender.balance}M | ${receiver.name}: ${receiver.balance}M`);
    }
}
