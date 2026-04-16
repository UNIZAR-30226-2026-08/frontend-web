import React, { useEffect, useState, useRef } from "react";
import { EventBus } from '@/EventBus';
import * as WSTypes from "@/services/types/socket";

// flags to show more or less output
const SELF_PROTECTION = true;
const VERBOSE = true;

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
		const msg : PrivateCommand = {"command": "start_game"};
		EventBus.emit('private-send-message', msg);
	};

	const handlePrivateChangeSettings = (data : PrivateRoomHostSettings) => {
		const msg : PrivateCommand = {
			"command": "update_settings",
			"bot_level": msg.bot_evel,
			"target_players": msg.target_players
		};	
		EventBus.emit('private-send-message', msg);
	};

	const handlePrivateSetReady = (ready:boolean = true) => {
		const msg : PrivateCommand = {
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
		const chatMessage = { "type" : "ChatMessage", "msg" : msg };
		EventBus.emit('send-message', chatMessage);
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

	const actionBuild = ( data : WSTypes.GameAskHouse) => {
		const message = {
			"type" : "ActionBuild",
			"square" : data.square,
			"houses" : data.houses
		};
		EventBus.emit('send-message', message);
	};

	const actionDemolish = ( data : WSTypes.GameAskHouse) => {
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
			"type" : "ActionChooseCard",
			"destination_user" : data.destination_user,
			"offered_money" : data.offreded_money,
			"asked_money" : data.asked_money,
			"offered_properties" : data.offered_properties,
			"asked_properties" : data.asked_properties
		};
		EventBus.emit('send-message', message);
	};

	const actionTradeAnswer = ( data: WSTypes.GameAskTradeAnswer ) => {
		const message = {
			"type" : "ActionChooseCard",
			"choose" : data.accept
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
			"type" : "ActionMortgageUnset",
			"amount" : data.money
		};
		EventBus.emit('send-message', message);
	};

	// Do not use - already private
	// RECEIVED MESSAGES
	const routePrivate = ( data : PrivateAction ) => {
		switch (data.action) {
			case "joined":
				const playersMsg : PrivateRoomPlayers = {
					"user": data.user,
					"players": data.players
				};
				EventBus.emit('private-room-player-joined',playersMsg);
				const settingsMsg : PrivateRoomHostSettings = {
					"bot_level": data.bot_level,
					"target_players": data.target_players
				};
				EventBus.emit('private-room-settings',settingsMsg);
				const ownerMsg : PrivateRoomOwner = {
					"is_owner": data.is_owner
				};
				EventBus.emit('private-room-owner-toggle',ownerMsg);
				break;
			case "player_left":
				const playerMsg : PrivateRoomPlayers = {
					"user": data.user_left,
					"players": data.players
				};
				EventBus.emit('private-room-player-left',playerMsg);
				const owner : PrivateRoomOwner = {
					"is_owner": data.is_owner
				};
				EventBus.emit('private-room-owner-toggle',owner);
				break;
			case "ready_status":
				const msg : PrivateRoomReady = {
					"user": data.user,
					"is_ready": data.is_ready
				};
				EventBus.emit('private-room-ready',msg);
				break;
			case "settings_changed":
				const settingsmsg : PrivateRoomHostSettings = {
					"bot_level": data.bot_level,
					"target_players": data.target_players
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
			case "ResponseChooseFantasy":
				const responseChooseFantasy : WSTypes.GameInfoFantasy = {
					"money" : data.money,
					"active_phase_player" : data.active_phase_player,
					"active_turn_player" : data.active_turn_player,
					"phase" : data.phase,
					"fantasy_result": data.fantasy_result,
					"positions": data.positions
				};
				EventBus.emit('report-response-choose-fantasy',responseChooseFantasy);
			case "ResponseAuction":
				const responseAuction : WSTypes.GameInfoAuction = {
					"money" : data.money,
					"active_phase_player" : data.active_phase_player,
					"active_turn_player" : data.active_turn_player,
					"phase" : data.phase,
					"winner" : data.winner,
					"bids": data.bids
				};
				EventBus.emit('report-response-auction',responseAuction);
			default: // + case "Response": // always send for state update
				const responseBasic : WSTypes.GameInfoResponse = {
					"money" : data.money,
					"active_phase_player" : data.active_phase_player,
					"active_turn_player" : data.active_turn_player,
					"phase" : data.phase
				};
				EventBus.emit('report-response',responseBasic);
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
				EventBus.emit('report-action-take-tram',reportTakeTram);
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
			case "ActionSellSquare":
				const reportSellSquare : WSTypes.GameReportSquare = {
					"player": data.player,
					"square" : data.square
				};
				EventBus.emit('report-action-sell-square',reportSellSquare);
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
					"player": data.player,
					"destination_user": data.destination_user,
					"offered_money": data.offered_money,
					"asked_money": data.asked_money,
					"offered_properties": data.offered_properties,
					"asked_properties": data.asked_properties
				};
				EventBus.emit('report-action-trade-proposal',reportTradeProposal);
				break;
			case "ActionTradeAnswer":
				const reportTradeAnswer : WSTypes.GameReportTradeAnswer = {
					"player": data.player,
					"accept": data.choose
				};
				EventBus.emit('report-action-trade-answer',reportTradeAnswer);
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
					"player": data.player,
					"money": data.amount
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
		EventBus.on('action-take-tram', actionTakeTram);
		EventBus.on('action-drop-purchase', actionDropPurchase);
		EventBus.on('action-buy-square', actionBuySquare);
		EventBus.on('action-build', actionBuild);
		EventBus.on('action-demolish', actionDemolish);
		EventBus.on('action-choose-card', actionChooseCard);
		EventBus.on('action-surrender', actionSurrender);
		EventBus.on('action-trade-proposal', actionTradeProposal);
		EventBus.on('action-trade-answer', actionTradeAnswer);
		EventBus.on('action-mortgage-set', actionMortgageSet);
		EventBus.on('action-mortgage-unset', actionMortgageUnset);
		EventBus.on('action-pay-bail', actionPayBail);
		EventBus.on('action-next-phase', actionNextPhase);

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

			EventBus.off('receive-response', routeResponse);
			EventBus.off('receive-action', routeAction);

			EventBus.off('send-chat-message', sendChatMessage);
		};
	}, []);

	return null;
};

export default GameService;
