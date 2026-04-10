// GameServices para gestionar la conexión de los websockets
// https://medium.com/@rojin.dumre98/implementing-websockets-in-django-react-d114deac0abe las últimas 3 img son el frontend
// https://github.com/Joshyvibe/chatapp-with-django-react/blob/main/frontend/src/components/Conversation.jsx 


import React, { useEffect, useState, useRef } from "react";

const GameServices = ( { session_id = "ftpcsxeizo53du77zuuoqvp9uns2v9j4", player_id = "1" } ) => { 
	const socket = usedRef(null);
	const [message, setMessage] = useState([]); 

	useEffect(() => {
		const url = 'ws://127.0.0.1:8000/ws/queue/';
		socket.current = new WebSocket(url);

		// Listen for messages
		socket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const.log("Mensaje de Django:",data);
			if (data.action === "match_found") {
				connectToGame(data.game_id);
			}

			// concat to log history
			setMessages((prev) => [...prev, data.message || data]);
		};

		socket.current.onopen = () => {
			console.log("WebSocket connection opened:", socket.current);
		};

		socket.current.onerror = (event) => {
			console.log("WebSocket error:", event);
		};

		socket.current.onclose = (event) => {
			console.log("WebSocket connection closed:", event);
		};

		return () => {
			if (socket.current) {
				socket.current.close();
			}
		};
	}, []);

	/*
	useEffect(() => {
		if (socket.current) {
			socket.current.onmessage = (event) => {
				console.log("Message received:", event.data);
				//const eventData = JSON.parse(event.data);
			};
		}
		return () => {
			if (socket.current) {
				socket.current.onmessage = null;
			}
		};
	}, [socket]);

	const handleDiscussionSubmit = (event) => {
		event.preventDefault(); // do not refresh page

		let sendMessage = async () => {
		
			const data = { field1 : "hello" };
			socket.current.send(JSON.stringify(data));
		};
		
		sendMessage();
	};
    */

   	const sendMessage = (text) => {
		if (socket.current && socket.current.readyState === WebSocket.OPEN) {
			const payload = {};
			socket.current.send(JSON.stringify(payload));
		} else {
			console.warn("El socket no está listo");
		}
	};

	return { message, sendMessage }; // ni zorra de qué devolver
};

export default GameServices;
