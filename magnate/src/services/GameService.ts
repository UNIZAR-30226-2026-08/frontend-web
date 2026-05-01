import React, { useEffect, useState, useRef } from "react";
import { EventBus } from '@/EventBus';
import * as WSTypes from "@/services/types/socket";

// flags to show more or less output
const SELF_PROTECTION = true;
const VERBOSE = true;
const DEBUG = true;

export const GameService = ( ) => { 
	/*
	 * PUBLIC ROOM FUNCTIONS
	 */
	const handlePublicConnect = () => { 
		EventBus.emit('handle-public-connect');
	};

	const handlePublicCancel = () => {
		EventBus.emit('handle-public-cancel');
	};

	/*
	 * PRIVATE ROOM FUNCTIONS
	 */
	const handlePrivateConnect = (roomcode: string) => { 
		EventBus.emit('handle-private-connect', roomcode);
	};

	const handlePrivateCancel = () => {
		EventBus.emit('handle-private-cancel');
	};

	const handlePrivateStart = () => {
		const msg : WSTypes.PrivateCommand = {"command": "start_game"};
		EventBus.emit('private-send-message', msg);
	};

	const handlePrivateChangeSettings = (data : WSTypes.PrivateRoomHostSettings) => {
		const msg : WSTypes.PrivateCommand = {
			"command": "update_settings",
			"bot_level": WSTypes.spaeng[data.bot_level],
			"target_players": data.target_players
		};	
		EventBus.emit('private-send-message', msg);
	};

	const handlePrivateSetReady = (ready:boolean = true) => {
		const msg : WSTypes.PrivateCommand = {
			"command": "ready_status",
			"is_ready": ready
		};
		EventBus.emit('private-send-message', msg);
	};

	/*
	 * GAME FUNCTIONS
	 */
	const handleEnterGame = () => { // TODO privatize
		EventBus.emit('handle-enter-game');
	};

	const handleLeaveGame = () => {
		EventBus.emit('handle-leave-game');
	};

	const sendChatMessage = ( msg : string ) => {
		const cheatUssage : string = `/dice <d1> <d2> <d3>
/tp <player_id> <tile_id>
/money <player_id> <money>
/property <player_id> <tile_id> <houses> <mortgage>
/clearProperty <tile_id>`;
		if (DEBUG && msg && msg.startsWith('/')) {
			const command = msg.slice(1).split(' ');
			switch (command[0]) {
				case 'dice':
					if (command.length !== 4) {
						EventBus.emit('send-message', cheatUssage);
						break;
					}
					const diceCheat : WSTypes.CheatMessage = {
						"type": "Cheat",
						"cheat": 'MockDice',
						"dice1": parseInt(command[1], 10),
						"dice2": parseInt(command[2], 10),
						"dice_bus": parseInt(command[3], 10)
					};
					EventBus.emit('send-cheat', diceCheat);
					EventBus.emit('send-message', {"type" : "ChatMessage", "msg" : "OK dice"});
					break;
				case 'tp':
					if (command.length !== 3) {
						EventBus.emit('send-message', cheatUssage);
						break;
					}
					const tpCheat : WSTypes.CheatMessage = {
						"type": "Cheat",
						"cheat": 'MockDice',
						"player_id": command[1],
						"square_id": command[2]
					};
					EventBus.emit('send-cheat', tpCheat);
					EventBus.emit('send-message', {"type" : "ChatMessage", "msg" : "OK tp"});
					break;
				case 'money':
					if (command.length !== 3) {
						EventBus.emit('send-message', cheatUssage);
						break;
					}
					const moneyCheat : WSTypes.CheatMessage = {
						"type": "Cheat",
						"cheat": 'SetMoney',
						"player_id": command[1],
						"amount": parseInt(command[2], 10)
					};
					EventBus.emit('send-cheat', moneyCheat);
					EventBus.emit('send-message', {"type" : "ChatMessage", "msg" : "OK money"});
					break;
				case 'property':
					if (command.length !== 5) {
						EventBus.emit('send-message', cheatUssage);
						break;
					}
					const propCheat : WSTypes.CheatMessage = {
						"type": "Cheat",
						"cheat": 'CreateProperty',
						"player_id": command[1],
						"square_id": command[2],
						"houses": parseInt(command[3], 10),
						"mortgage": command[4] === 'true'
					};
					EventBus.emit('send-cheat', propCheat);
					EventBus.emit('send-message', {"type" : "ChatMessage", "msg" : "OK property"});
					break;
				case 'clearProperty':
					if (command.length !== 2) {
						EventBus.emit('send-message', cheatUssage);
						break;
					}
					const clearCheat : WSTypes.CheatMessage = {
						"type": "Cheat",
						"cheat": 'DeleteProperty',
						"square_id": command[1]
					};
					EventBus.emit('send-cheat', clearCheat);
					EventBus.emit('send-message', {"type" : "ChatMessage", "msg" : "OK clearProperty"});
					break;
				default:
					EventBus.emit('send-message', cheatUssage);
			}
		} else {
			const chatMessage = { "type" : "ChatMessage", "msg" : msg };
			EventBus.emit('send-message', chatMessage);
		}
	};

	// ACTIONS
	const actionThrowDices = () => {
		const message = { "type" : "ActionThrowDices" };
		EventBus.emit('send-message', message);
	};

	/**
	 * @fires send-message
	 * @listens to action-move-to
	 * @param GameAskSquare
	 */
	const actionMoveTo = ( data : WSTypes.GameAskSquare ) => {
		const message = {
			"type" : "ActionMoveTo",
			"square" : data.square
		};
		EventBus.emit('send-message', message);
	};

	const actionTakeTram = ( data : WSTypes.GameAskSquare) => {
		const message = {
			"type" : "ActionTakeTram",
			"square" : data.square
		};
		EventBus.emit('send-message', message);
	};

	const actionDropPurchase = ( data : WSTypes.GameAskSquare) => {
		const message = {
			"type" : "ActionDropPurchase",
			"square" : data.square
		};
		EventBus.emit('send-message', message);
	};

	const actionBuySquare = ( data : WSTypes.GameAskSquare) => {
		const message = {
			"type" : "ActionBuySquare",
			"square" : data.square
		};
		EventBus.emit('send-message', message);
	};

	const actionBuild = ( data : WSTypes.GameAskHouses) => {
		const message = {
			"type" : "ActionBuild",
			"square" : data.square,
			"houses" : data.houses
		};
		EventBus.emit('send-message', message);
	};

	const actionDemolish = ( data : WSTypes.GameAskHouses) => {
		const message = {
			"type" : "ActionDemolish",
			"square" : data.square,
			"houses" : data.houses
		};
		EventBus.emit('send-message', message);
	};

	const actionChooseCard = ( data : WSTypes.GameAskFantasy) => {
		const message = {
			"type" : "ActionChooseCard",
			"chosen_revealed_card" : data.revealed
		};
		EventBus.emit('send-message', message);
	};

	const actionSurrender = () => {
		const message = { "type": "ActionSurrender" };
		EventBus.emit('send-message', message);
	};

	const actionTradeProposal = ( data : WSTypes.GameAskTrade ) => {
		const message = {
			"type" : "ActionTradeProposal",
			"player": data.player,
			"destination_user" : data.destination_user,
			"offered_money" : data.offered_money,
			"asked_money" : data.asked_money,
			"offered_properties" : data.offered_properties,
			"asked_properties" : data.asked_properties
		};
		EventBus.emit('send-message', message);
	};

	const actionTradeAnswer = ( data: WSTypes.GameAskTradeAnswer ) => {
		const message = {
			"type" : "ActionTradeAnswer",
			"accept" : data.accept, 
			"player": data.player,
			"game": data.game
		};
		EventBus.emit('send-message', message);
	};

	const actionMortgageSet = ( data : WSTypes.GameAskSquare) => {
		const message = {
			"type" : "ActionMortgageSet",
			"square" : data.square
		};
		EventBus.emit('send-message', message);
	};

	const actionMortgageUnset = ( data : WSTypes.GameAskSquare) => {
		const message = {
			"type" : "ActionMortgageUnset",
			"square" : data.square
		};
		EventBus.emit('send-message', message);
	};

	const actionPayBail = () => {
		const message = { "type": "ActionPayBail" };
		EventBus.emit('send-message', message);
	};

	const actionNextPhase = () => {
		const message = { "type": "ActionNextPhase" };
		EventBus.emit('send-message', message);
	};

	const actionBid = ( data: WSTypes.GameAskBid ) => {
		const message = {
			"type" : "ActionBid",
			"amount" : Number(data.money)
		};
		if (VERBOSE) console.log("Socket: Enviando puja", message);
		EventBus.emit('send-message', message);
	};

	// Do not use - already private
	// RECEIVED MESSAGES
	const routePrivate = ( data : WSTypes.PrivateAction ) => {
		switch (data.action) {
			case "joined":
				const playersMsg : WSTypes.PrivateRoomPlayers = {
					"user": data.user,
					"players": data.players
				};
				EventBus.emit('private-room-player-joined',playersMsg);
				console.log("joined player");
				const settingsMsg : WSTypes.PrivateRoomHostSettings = {
					"bot_level": WSTypes.engspa[data.bot_level as unknown as WSTypes.BotLevel] || data.bot_level,
					"target_players": data.target_players ?? 2
				};
				EventBus.emit('private-room-settings',settingsMsg);
				const ownerMsg : WSTypes.PrivateRoomOwner = {
					"is_owner": data.is_owner
				};
				EventBus.emit('private-room-owner-toggle',ownerMsg);
				break;
			case "player_left":
				const playerMsg : WSTypes.PrivateRoomPlayers = {
					"user": data.user_left,
					"players": data.players
				};
				EventBus.emit('private-room-player-left',playerMsg);
				const owner : WSTypes.PrivateRoomOwner = {
					"is_owner": data.is_owner
				};
				EventBus.emit('private-room-owner-toggle',owner);
				break;
			case "ready_status":
				const msg : WSTypes.PrivateRoomReady = {
					"user": data.user,
					"is_ready": data.is_ready
				};
				EventBus.emit('private-room-ready',msg);
				break;
			case "settings_changed":
				const settingsmsg : WSTypes.PrivateRoomHostSettings = {
					"bot_level": WSTypes.engspa[data.bot_level as unknown as WSTypes.BotLevel] || data.bot_level,
					"target_players": data.target_players ?? 1
				};
				EventBus.emit('private-room-settings',settingsmsg);
				break;
			case "game_start":
				EventBus.emit('handle-enter-game',data.game_id);
				break;
			case "error":
				if (VERBOSE) {
					console.log(data.message);
				}
				break;
			default:
				console.log("Fckng chat message or what ", data.action);
		}
		
	};

	const routeResponse = ( data : WSTypes.GameResponse ) => {
		// response general
		const responseBasic : WSTypes.GameInfoResponse = {
			"money" : data.money,
			"active_phase_player" : data.active_phase_player,
			"active_turn_player" : data.active_turn_player,
			"phase" : data.phase,
			"parking_money": data.parking_money,
			"fantasy_event": data.fantasy_event,
			"positions": data.positions
		};
		EventBus.emit('report-response', responseBasic);

		switch (data.type) {
			case "ResponseMovement":
				const responseMovement : WSTypes.GameInfoMovement = {
					"money" : data.money,
					"active_phase_player" : data.active_phase_player,
					"active_turn_player" : data.active_turn_player,
					"phase" : data.phase,
					"path" : data.path,
					"fantasy_event" : data.fantasy_event
				};
				EventBus.emit('report-response-movement',responseMovement);
				break;
			case "ResponseChooseSquare":
				const responseChooseSquare : WSTypes.GameInfoMovement = {
					"money" : data.money,
					"active_phase_player" : data.active_phase_player,
					"active_turn_player" : data.active_turn_player,
					"phase" : data.phase,
					"path" : data.path,
					"fantasy_event" : data.fantasy_event
				};
				EventBus.emit('report-response-choose-square',responseChooseSquare);
				break;
			case "ResponseThrowDices":
				const responseThrowDices : WSTypes.GameInfoThrowDices = {
					"money" : data.money,
					"active_phase_player" : data.active_phase_player,
					"active_turn_player" : data.active_turn_player,
					"phase" : data.phase,
					"path" : data.path,
					"fantasy_event" : data.fantasy_event,
					"dice1" : data.dice1,
					"dice2" : data.dice2,
					"dice_bus" : data.dice_bus,
					"destinations" : data.destinations,
					"triple" : data.triple,
					"streak" : data.streak
				};
				EventBus.emit('report-response-throw-dices',responseThrowDices);
				break;
			case "ResponseChooseFantasy":
				console.log("EVENTO fantasia response:", data);
				const rawFantasy = (data.fantasy_result as any)?.fantasy_event;
				const responseChooseFantasy : WSTypes.GameInfoFantasy = {
					"money" : data.money,
					"active_phase_player" : data.active_phase_player,
					"active_turn_player" : data.active_turn_player,
					"phase" : data.phase,
					"positions": data.positions,
					"fantasy_result": data.fantasy_result ? {
						fantasy_event: rawFantasy ? {
							fantasy_type: rawFantasy.fantasy_type,
							value: rawFantasy.value,
							card_cost: rawFantasy.card_cost
						} : undefined,
						result: (data.fantasy_result as any).result
					} : { result: null }
				};
				EventBus.emit('report-response-choose-fantasy',responseChooseFantasy);
				break;
			case "ResponseBonus":
				const responseBonus: WSTypes.GameInfoBonus = {
					"money": data.money,
					"active_phase_player": data.active_phase_player,
					"active_turn_player": data.active_turn_player,
					"phase": data.phase,
					"bonuses": data.bonuses || {}, // Aquí vienen los ganadores y cantidades
				};
				EventBus.emit('show-final-results', responseBonus);
				break;
			case "ResponseAuction":
				const auctionInfo :  WSTypes.AuctionData = {
					"square": data.auction?.square,
					"bids": data.auction?.bids,
					"winner": data.auction?.winner,
        			"final_amount": data.auction?.final_amount,
				}
				const responseAuction : WSTypes.GameInfoAuction = {
					"money" : data.money,
					"active_phase_player" : data.active_phase_player,
					"active_turn_player" : data.active_turn_player,
					"phase" : data.phase,
					"auction": auctionInfo
				};
				EventBus.emit('report-response-auction', responseAuction);
				break;
			// default: // + case "Response": // always send for state update
			// 	const responseBasic : WSTypes.GameInfoResponse = {
			// 		"money" : data.money,
			// 		"active_phase_player" : data.active_phase_player,
			// 		"active_turn_player" : data.active_turn_player,
			// 		"phase" : data.phase
			// 	};
			// 	EventBus.emit('report-response',responseBasic);
		}
	};
	
	const routeAction = ( data : WSTypes.GameActionReport ) => {
		switch (data.type) {
			case "ActionThrowDices":
				const reportThrowDices : WSTypes.GameReportSender = {
					"player": data.player
				};
				EventBus.emit('report-action-throw-dices',reportThrowDices);
				break;
			case "ActionMoveTo":
				const reportMoveTo : WSTypes.GameReportSquare = {
					"player": data.player,
					"square" : data.square
				};
				EventBus.emit('report-action-move-to',reportMoveTo);
				break;
			case "ActionTakeTram":
				const reportTakeTram : WSTypes.GameReportSquare = {
					"player": data.player,
					"square" : data.square
				};
				EventBus.emit('report-action-take-tram', reportTakeTram);
				break;
			case "ActionDropPurchase":
				const reportDropPurchase : WSTypes.GameReportSquare = {
					"player": data.player,
					"square" : data.square
				};
				EventBus.emit('report-action-drop-purchase',reportDropPurchase);
				break;
			case "ActionBuySquare":
				const reportBuySquare : WSTypes.GameReportSquare = {
					"player": data.player,
					"square" : data.square
				};
				EventBus.emit('report-action-buy-square',reportBuySquare);
				break;
			case "ActionBuild":
				const reportBuild : WSTypes.GameReportHouses = {
					"player": data.player,
					"square": data.square,
					"houses": data.houses
				};
				EventBus.emit('report-action-build',reportBuild);
				break;
			case "ActionDemolish":
				const reportDemolish : WSTypes.GameReportHouses = {
					"player": data.player,
					"square": data.square,
					"houses": data.houses
				};
				EventBus.emit('report-action-demolish',reportDemolish);
				break;
			case "ActionChooseCard":
				const reportChooseCard : WSTypes.GameReportFantasy = {
					"player": data.player,
					"revealed": data.chosen_revealed_card
				};
				EventBus.emit('report-action-choose-card',reportChooseCard);
				break;
			case "ActionSurrender":
				const reportSurrender : WSTypes.GameReportSender = {
					"player": data.player
				};
				EventBus.emit('report-action-surrender',reportSurrender);
				break;
			case "ActionTradeProposal":
				const reportTradeProposal : WSTypes.GameReportTradeProposal = {
					"game": data.game,
					"player": data.player,
					"destination_user": Number(data.destination_user),
					"offered_money": data.offered_money,
					"asked_money": data.asked_money,
					"offered_properties": data.offered_properties,
					"asked_properties": data.asked_properties
				};
				EventBus.emit('report-action-trade-proposal', reportTradeProposal);
				break;
			case "ActionTradeAnswer":
				const reportTradeAnswer : WSTypes.GameReportTradeAnswer = {
					"player": data.player,
					"accept": data.accept
				};
				EventBus.emit('report-action-trade-answer', reportTradeAnswer);
				break;
			case "ActionMortgageSet":
				const reportMortgageSet : WSTypes.GameReportSquare = {
					"player": data.player,
					"square": data.square
				};
				EventBus.emit('report-action-mortgage-set',reportMortgageSet);
				break;
			case "ActionMortgageUnset":
				const reportMortgageUnset : WSTypes.GameReportSquare = {
					"player": data.player,
					"square": data.square
				};
				EventBus.emit('report-action-mortgage-unset',reportMortgageUnset);
				break;
			case "ActionPayBail":
				const reportPayBail : WSTypes.GameReportSender = {
					"player": data.player
				};
				EventBus.emit('report-action-pay-bail',reportPayBail);
				break;
			case "ActionNextPhase":
				const reportNextPhase : WSTypes.GameReportSender = {
					"player": data.player
				};
				EventBus.emit('report-action-next-phase',reportNextPhase);
				break;
			case "ActionBid":
				const reportBid : WSTypes.GameReportBid = {
					"player": String(data.player),
        			"money": Number(data.amount)
				};
				EventBus.emit('report-action-bid',reportBid);
				break;
			case "Action": // Should never enter here
				const reportAction : WSTypes.GameReportSender = {
					"player": data.player
				};
				EventBus.emit('report-action',reportAction);
				break;
			default:
				if (VERBOSE) {
					console.log("VERBOSE: It's literally impossible to get here as every branch has a break and all gameActionType's possible values have been covered");
				}
				break;
		}
	};


	useEffect(() => {
		EventBus.on('receive-private', routePrivate);
		EventBus.on('private-connect', handlePrivateConnect);
		EventBus.on('private-cancel', handlePrivateCancel);
		EventBus.on('private-start', handlePrivateStart);
		EventBus.on('private-change-settings', handlePrivateChangeSettings);
		EventBus.on('private-set-ready',handlePrivateSetReady);

		// Public
		EventBus.on('public-connect', handlePublicConnect);
		EventBus.on('public-cancel', handlePublicCancel);

		//Game
		EventBus.on('enter-game', handleEnterGame);
		EventBus.on('action-throw-dices', actionThrowDices);
		EventBus.on('action-move-to', actionMoveTo);
		EventBus.on('action-take-tram', actionTakeTram); // Moverte a otra estacion de tranvía
		EventBus.on('action-drop-purchase', actionDropPurchase); // Jugador no compra propiedad -> empieza subasta
		EventBus.on('action-buy-square', actionBuySquare); // Comprar propiedad
		EventBus.on('action-build', actionBuild); // construir casa
		EventBus.on('action-demolish', actionDemolish); // destruir casa
		EventBus.on('action-choose-card', actionChooseCard); // se envía true si se elige la vista, false la oculta
		EventBus.on('action-surrender', actionSurrender); // alguien se declara en bancarrota
		EventBus.on('action-trade-proposal', actionTradeProposal); // jugador manda propuesta a otro
		EventBus.on('action-trade-answer', actionTradeAnswer); // jugador acepta/deniega la propuesta
		EventBus.on('action-mortgage-set', actionMortgageSet); // hipotecar propiedad
		EventBus.on('action-mortgage-unset', actionMortgageUnset); // deshipotecar
		EventBus.on('action-pay-bail', actionPayBail);
		EventBus.on('action-next-phase', actionNextPhase); // se pulsa botón de siguiente fase
		EventBus.on('action-bid', actionBid); // envíar puja cuando estamos en la subasta (solo se envía una puja por player)
		EventBus.on('receive-response', routeResponse);
		EventBus.on('receive-action', routeAction);

		EventBus.on('send-chat-message', sendChatMessage);
		return () => {
			EventBus.off('receive-private', routePrivate);
			EventBus.off('private-connect', handlePrivateConnect);
			EventBus.off('private-cancel', handlePrivateCancel);
			EventBus.off('private-start', handlePrivateStart);
			EventBus.off('private-change-settings', handlePrivateChangeSettings);
			EventBus.off('private-set-ready',handlePrivateSetReady);

			// Public
			EventBus.off('public-connect', handlePublicConnect);
			EventBus.off('public-cancel', handlePublicCancel);

			// Game
			EventBus.off('enter-game', handleEnterGame);
			EventBus.off('action-throw-dices', actionThrowDices);
			EventBus.off('action-move-to', actionMoveTo);
			EventBus.off('action-take-tram', actionTakeTram);
			EventBus.off('action-drop-purchase', actionDropPurchase);
			EventBus.off('action-buy-square', actionBuySquare);
			EventBus.off('action-build', actionBuild);
			EventBus.off('action-demolish', actionDemolish);
			EventBus.off('action-choose-card', actionChooseCard);
			EventBus.off('action-surrender', actionSurrender);
			EventBus.off('action-trade-proposal', actionTradeProposal);
			EventBus.off('action-trade-answer', actionTradeAnswer);
			EventBus.off('action-mortgage-set', actionMortgageSet);
			EventBus.off('action-mortgage-unset', actionMortgageUnset);
			EventBus.off('action-pay-bail', actionPayBail);
			EventBus.off('action-next-phase', actionNextPhase);
			EventBus.off('action-bid', actionBid);
			EventBus.off('receive-response', routeResponse);
			EventBus.off('receive-action', routeAction);

			EventBus.off('send-chat-message', sendChatMessage);
		};
	}, []);

	return null;
};

export default GameService;
