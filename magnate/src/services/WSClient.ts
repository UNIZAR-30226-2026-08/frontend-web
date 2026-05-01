import React, { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { EventBus } from '@/EventBus';
import { GameAction, PrivateCommand, ChatMessageContent } from "@/services/types/socket";
import { useAuth } from '@/context/AuthContext';

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

	const [inside, setInsideFlag] = useState<boolean>(false);
	const insideRef = useRef<boolean>(false);
	const gameIdRef = useRef("");
	const playersIdsRef = useRef([]);

    const { token } = useAuth();

	const location = useLocation();

	// against 2 emissions of events on reload browser button clicked
	// const hasAttemptedReconnection = useRef(false);

	// Meant to be a private function. Self-descriptive.
	// 4100 context change. 
	// 4101 public cancel. 
	// 4102 private cancel.
	// 4103 game left.
	const closeExistingSocket = (sockcode : number=4100) => {
	    if (socket.current) {
			if (sockcode===4101 && socket.current.readyState === WebSocket.OPEN) {
				socket.current.send(JSON.stringify({"action":"cancel"}));
			}

	        // 1000 standard code for "Normal Closure" TODO more generic msg
	        socket.current.close(sockcode, "");
	        socket.current = null;
			playersIdsRef.current = [];
	    }
	};

	/**
	 * Connect to public room and handle every communication related
	 * Updates {@link gameIdRef}
	 * @fires many many event buses TODO
	 */
	const handlePublicRoom = () => {
		if (socket.current && (socket.current.readyState === 0 || socket.current.readyState === 1)) {
			if (VERBOSE) console.log("DEBUG: ya hay un intento de conexión en curso.");
			return;
		}

		if (VERBOSE) {
			console.log("DEBUG: entered handlePublicRoom");
		}
		//closeExistingSocket();

		if (!token && VERBOSE) {
			console.log("NO COOKIE/TOKEN: login before entering room.");
			console.log(token);
		}
		const url = `ws://localhost:8000/ws/queue/public/?token=${token}`;
		socket.current = new WebSocket(url);

		socket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (VERBOSE) {
				console.log("SALA PUBLICA Mensaje recibido");
				console.log(data);
			}
			if (data.action === "match_found") {
				if (VERBOSE) { console.log("Tomo game id:",data.game_id); }
				// EventBus.emit('handle-enter-game', data.game_id);
				// if (socket.current) {
				// 	socket.current.onclose = null;
				// 	socket.current.close();
				// 	socket.current = null;
				// }
				insideRef.current = true;
				EventBus.emit('you-may-now-enter-the-game');
				gameIdRef.current = data.game_id;
				//sessionStorage.setItem('activeGameId', data.game_id);

				setTimeout(() => {
					EventBus.emit('handle-enter-game', data.game_id);
				}, 100);
			}
			else if (data.action === "error") {
				console.log(data.message);
			}
			else {
				console.log("No se corresponde con nada esperado. Mensaje: ",data);
			}
		};

		socket.current.onclose = (event) => {
			if (VERBOSE) {
				switch(event.code) {
					case 4001:
						console.log("PUBLIC 4001 - Game started");
						break;
					case 4002:
						console.log("PUBLIC 4002 - Unauthorized, user not authenticated");
						break;
					case 4000:
						console.log("PUBLIC 4000 - User canceled the operation");
						break;
					default:
						console.log("PUBLIC socket closed OK");
				}
			}
		};

	};

	/**
	 * Connect to private room and handle every communication related
	 * Updates {@link gameIdRef}
	 * @fires many many event buses TODO
	 */
	const handlePrivateRoom = (roomid: string) => {
		if (VERBOSE) {
			console.log("DEBUG: entered handlePrivateRoom");
		}
		//closeExistingSocket();

		if (!token && VERBOSE) {
			console.log("NO COOKIE/TOKEN: login before entering room.");
		}
		const url = `ws://localhost:8000/ws/queue/private/${roomid}/?token=${token}`;
		socket.current = new WebSocket(url);
		socket.current.onopen = (event) => { EventBus.emit('private-connect-response', true); };

		//sessionStorage.setItem('roomCode', roomid);

		socket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (VERBOSE) {
				console.log("SALA PRIVADA Mensaje recibido");
				console.log(data);
			}
			if (data.action === "room_created") { // not even covered in docu. Kinda cheating
				gameIdRef.current = data.room_code;
				//sessionStorage.setItem('activeGameId', data.room_code);
			} else {
				EventBus.emit('receive-private',data);	
			}
		};

		socket.current.onclose = (event) => {
			if (VERBOSE) {
				switch(event.code) {
					case 4001:
						console.log("PRIVATE 4001 - Game started");
						EventBus.emit('private-connect-response', true);
						break;
					case 4002:
						console.log("PRIVATE 4002 - Unauthorized");
						EventBus.emit('private-connect-response', false);
						break;
					case 4003:
						console.log("PRIVATE 4003 - Room not found, full or user already in room");
						EventBus.emit('private-connect-response', false);
						break;
					default:
						console.log("PRIVATE socket closed OK");
				}
			}
		};

	};

	/**
	 * Connects to game with ID {@link gameIdRef}
	 * @throws {Error} if {@link gameIdRef} is null
	 * Handles all communication related to that game.
	 * @fires many many event buses TODO
	 */
	const handleGame = (game_id: string) => {
		gameIdRef.current = game_id;
		//sessionStorage.setItem('activeGameId', game_id);
		if (VERBOSE) {
			console.log("DEBUG: entered handleGame");
		}

		if (!gameIdRef.current && SELF_PROTECTION) {
			console.log("SELF PROTECTION: No available game id");	
		}

		if (!token && VERBOSE) {
			console.log("NO COOKIE/TOKEN: login before entering game.");
		}
		const url = `ws://localhost:8000/ws/game/${game_id}/?token=${token}`
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
						// It'd b Better to use the API in fact, deprecated(?)
					break;
				case "chat_message": 
                    console.log(playersIdsRef);
                    // FIXME
					// if (data.game === gameIdRef.current && playersIdsRef.current.includes(data.user) ) {
					if (data.game === gameIdRef.current) {
						const chatMessage : ChatMessageContent = {
							"user": data.user,
							"msg":  data.msg
						};
						EventBus.emit('new-chat-message',chatMessage);
					} else if (VERBOSE) {
						console.log("VERBOSE: Este mensaje no es para este chat.");
					}
					break;
				case "game_state":
					const gameStateData = data.game_state;
					if (gameStateData && gameStateData.id === gameIdRef.current) {
						console.log("--> ESTADO DEL JUEGO RECIBIDO:");
       					console.log(gameStateData);
						if (gameStateData.players && (playersIdsRef.current.length === 0)) {
							playersIdsRef.current = gameStateData.players;
						}
                        EventBus.emit('new-game-state', gameStateData);
						if (!inside) {
							EventBus.emit('you-may-now-enter-the-game');
							setInsideFlag(true);
						}
                    
					} else if (VERBOSE) {
						console.log("VERBOSE: This message is not for this game id");
					}
					break;
				case "game_action": 
					if (data.data.game === gameIdRef.current) {
						EventBus.emit('receive-action',data.data);
						
						if (VERBOSE) {
							console.log(`WS: Acción recibida y emitida (${data.data.type}) del jugador ${data.data.player}`);
						}
					} else if (VERBOSE) {
						console.log("VERBOSE: No need to report my own actions");
					}
					break;
				case "game_response":
					EventBus.emit('receive-response', data.data);
					break;
				default:
					if (SELF_PROTECTION) {
						console.log("SELF PROTECTION: mensaje desconocido",data);	
					}
			}
		};

		socket.current.onclose = (event) => {
			if (VERBOSE) {
				switch(event.code) {
					case 4002:
						console.log("GAME 4002 - Unauthorized or missing kwargs");
						break;
					case 4003:
						console.log("GAME 4003 - User is not a participant in this game");
						break;
					default:
						console.log("GAME socket closed OK");
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
	const gameSendMessage = ( msg : GameAction ) => {
		if (socket.current && socket.current.readyState === WebSocket.OPEN) {
			socket.current.send(JSON.stringify(msg));
		} else if (WS_ERROR) {
			console.log("SELF PROTECTION: tried to send message through closed ws");
		}
	};

	// Copied above function
	const privateSendMessage = ( msg : PrivateCommand ) => {
		if (socket.current && socket.current.readyState === WebSocket.OPEN) {
			socket.current.send(JSON.stringify(msg));
		} else if (WS_ERROR) {
			console.log("SELF PROTECTION: tried to send message through closed ws");
		}
	};

	useEffect(() => {
		const validGameRoutes = ['/lobby', '/phaser-game', '/loading'];
		const isGameRoute = validGameRoutes.some(route => location.pathname.includes(route));
		if (!isGameRoute && socket.current && socket.current.readyState === WebSocket.OPEN) {
			console.log("Out of game");
			closeExistingSocket(4100);
		} 
		/*
		else if (!hasAttemptedReconnection.current) {
			hasAttemptedReconnection.current = true;

			const path = location.pathname;
			if (path.includes('/phaser-game')) {
				const gameId = sessionStorage.getItem('activeGameId');
				if (gameId) {
					gameIdRef.current = gameId;
					EventBus.emit('handle-enter-game', gameId);
				}
			} else if (path.includes('/loading')) {
				EventBus.emit('handle-public-connect');
			} else if (path.includes('/lobby')) {
				const roomCode = sessionStorage.getItem('roomCode');
				if (roomCode) {
					EventBus.emit('handle-private-connect', roomCode);
				}
			}	
		}
	   */
		EventBus.on('handle-public-connect', handlePublicRoom);
		EventBus.on('handle-public-cancel', () => { closeExistingSocket(4101);} );
		EventBus.on('handle-private-cancel', () => { 
			//sessionStorage.removeItem('roomCode');
			closeExistingSocket(4102);
		} );
		EventBus.on('handle-leave-game', () => { 
			//sessionStorage.removeItem('activeGameId');
			insideRef.current = false;
			setInsideFlag(false);
			closeExistingSocket(4103);
		} );
		EventBus.on('handle-enter-game', handleGame);
		EventBus.on('send-message', gameSendMessage);
		EventBus.on('handle-private-connect', handlePrivateRoom);
		EventBus.on('private-send-message', privateSendMessage);
		return () => {
			EventBus.off('handle-public-connect', handlePublicRoom);
			EventBus.off('handle-public-cancel');
			EventBus.off('handle-private-cancel');
			EventBus.off('handle-leave-game');
			EventBus.off('handle-enter-game', handleGame);
			EventBus.off('send-message', gameSendMessage);
			EventBus.off('handle-private-connect', handlePrivateRoom);
			EventBus.off('private-send-message', privateSendMessage);
		};
	}, [token, location.pathname]);

	return null;
};

export default WSClient;
