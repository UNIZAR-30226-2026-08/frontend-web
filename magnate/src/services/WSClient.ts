import React, { useEffect, useState, useRef } from "react";
import { EventBus } from '@/EventBus';
import { GameAction } from "@/services/types/socket";

const userId = "1";	// TODO

/**
 * When true, informs of errors related to websocket connection
 */
const WS_ERROR = true;

/**
 * When true, informs of errors related to format which should have already
 * been taken care of by superior classes (see {@link GameService})
 */
const SELF_PROTECTION = true;

/**
 * When true, outputs information useful for debugging.
 */
const VERBOSE = true;

/**
 * @module WebSocketService
 * WebSocket client for backend communication. 
 * There should not be any need to be used by any other front end developers.
 * It handles matchmaking of both public and private rooms and of game lagic.
 */
export const WSClient = ( ) => { 

	/** 
	 * References socket object to handle every communication with backend API.
	 * Persistent between renderizations (useRef).
	 */
	const socket = useRef<WebSocket | null>(null);

	const gameIdRef = useRef("");
	const userIdRef = useRef("");

	// Meant to be a private function. Self-descriptive.
	const closeExistingSocket = () => {
	    if (socket.current) {
	        // 1000 standard code for "Normal Closure"
	        socket.current.close(1000, "Cierre por cambio de contexto");
	        socket.current = null;
	    }
	};

	/**
	 * Connect to public room and handle every communication related
	 * Updates {@link gameIdRef}
	 * @fires many many event buses TODO
	 */
	const handlePublicRoom = () => {
		if (VERBOSE) {
			console.log("DEBUG: entered handlePublicRoom");
		}

		closeExistingSocket();

		// url for private room (param <roomid>)
		//const url = `ws://localhost:8000/ws/queue/private/${roomid}`;
		const url = `ws://localhost:8000/ws/queue/public/`;
		socket.current = new WebSocket(url);

		socket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (VERBOSE) {
				console.log("SALA PUBLICA Mensaje recibido");
				console.log(data);
			}
			if (data.action === "match_found") {
				console.log("Tomo game id:",data.game_id);
				gameIdRef.current = data.game_id;
			}
			else if (data.action === "error") {
				console.log(data.message);
			}
			else {
				console.log("No se corresponde con nada esperado. Mensaje: ",data);
			}
		};

	};

	/**
	 * Connects to game with ID {@link gameIdRef}
	 * @throws {Error} if {@link gameIdRef} is null
	 * Handles all communication related to that game.
	 * @fires many many event buses TODO
	 */
	const handleGame = () => {
		if (VERBOSE) {
			console.log("DEBUG: entered handleGame");
		}

		if (!gameIdRef.current && SELF_PROTECTION) {
			console.log("SELF PROTECTION: No available game id");	
		}

		closeExistingSocket();

		const gameId = gameIdRef.current;
		const url = `ws://localhost:8000/ws/game/${gameId}/`
		socket.current = new WebSocket(url);

		socket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (VERBOSE) {
				console.log("JUEGO mensaje recibido");
				console.log(data);
			}
			switch(data.event_type) {
				case "error":
					if (WS_ERROR) {
						console.log(data.message);
					}
					break;
				case "init_identity": // in the meantine, user id is hard coded
					break;
				case "chat_message": 
					// TODO Safety check de abajo - no sería mejor player i.e. userid??
					if (data.game === gameIdRef.current) {
						const chatMessage : ChatMessageContent = {
							"user": data.user,
							"msg":  data.msg
						};
						EventBus.emit('new-chat-message',chatMessage);
					} else if (VERBOSE) {
						console.err("VERBOSE: Este mensaje no es para este chat".);
					}
					break;
				case "game_state": 	// reupload state TODO
					break;
				case "game_action": 
					// TODO safety check: data.data.player is among global state's players
					if (data.data.game === gameIdRef.current) {// && data.data.player ... ) {
						EventBus.emit('receive-action',data.data);
					} else if (VERBOSE) {
						//console.err("VERBOSE: game id or action sender do not align with current game.");
						console.log("VERBOSE: No need to report my own actions");
					}
					break;
				case "game_response":
					EventBus.emit('receive-response',data.data);
					break;
				default:
					if (SELF_PROTECTION) {
						console.log("SELF PROTECTION: mensaje desconocido",data);	
					}

			}
		};

	};

	/**
	 * Sends any kind of message to the current {@link socket}
	 * @param msg - A dictionary with the desired format (see {@link GameService} for insights)
	 * @throws {Error} if used when socket is closed on WS_ERROR flag set true
	 * @fires many many event buses TODO
	 * @listens other many event buses TODO
	 */
	const backendSendMessage = ( msg : GameAction ) => {
		if (socket.current && socket.current.readyState === WebSocket.OPEN) {
			socket.current.send(JSON.stringify(msg));
		} else if (WS_ERROR) {
			console.log("SELF PROTECTION: tried to send message through closed ws");
		}
	};

	useEffect(() => {
		EventBus.on('handle-public-connect', handlePublicRoom);
		EventBus.on('handle-enter-game', handleGame);
		EventBus.on('send-message', backendSendMessage);
		return () => {
			EventBus.off('handle-public-connect', handlePublicRoom);
			EventBus.off('handle-enter-game', handleGame);
			EventBus.off('send-message', backendSendMessage);
			closeExistingSocket();
		};
	}, []);

	return null;
};

export default WSClient;
