import React, { useEffect, useState, useRef } from "react";
import { EventBus } from '@/EventBus';
import { GameAction } from "@/services/types/socket";

const userId = "1";	// TODO

// flags to show more or less output
const WS_ERROR = true;
const SELF_PROTECTION = true;
const VERBOSE = true;

export const WSClient = ( ) => { 

	const socket = useRef<WebSocket | null>(null);
	const gameIdRef = useRef("");
	const userIdRef = useRef("");

	const closeExistingSocket = () => {
	    if (socket.current) {
	        // 1000 standard code for "Normal Closure"
	        socket.current.close(1000, "Cierre por cambio de contexto");
	        socket.current = null;
	    }
	};

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
				case "init_identity":
					break;
				case "chat_message":
					break;
				case "game_state":
					break;
				case "game_action":
					break;
				case "game_response":
					break;
				default:
					if (SELF_PROTECTION) {
						console.log("SELF PROTECTION: mensaje desconocido",data);	
					}

			}
		};

	};

	const handleSendMessage = ( msg : GameAction ) => {
		if (socket.current && socket.current.readyState === WebSocket.OPEN) {
			socket.current.send(JSON.stringify(msg));
		} else if (WS_ERROR) {
			console.log("SELF PROTECTION: tried to send message through closed ws");
		}
	};

	useEffect(() => {
		EventBus.on('handle-public-connect', handlePublicRoom);
		EventBus.on('handle-enter-game', handleGame);
		EventBus.on('send-message', handleSendMessage);
		return () => {
			EventBus.off('handle-public-connect', handlePublicRoom);
			EventBus.off('handle-enter-game', handleGame);
			EventBus.off('send-message', handleSendMessage);
			closeExistingSocket();
		};
	}, []);

	return null;
};

export default WSClient;
