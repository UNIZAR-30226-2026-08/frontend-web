import React, { useEffect, useState, useRef } from "react";
import { EventBus } from '@/EventBus';
import { GameAction } from "@/services/types/socket";

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

	/*
	 * GAME FUNCTIONS
	 */
	const handleEnterGame = () => { // TODO privatize
		EventBus.emit('handle-enter-game');
	};
	const handleThrowDices = () => {
		const message = { "type" : "ActionThrowDices" };
		EventBus.emit('send-message', message);
	};

	useEffect(() => {
		EventBus.on('public-connect', handlePublicConnect);
		EventBus.on('enter-game', handleEnterGame);
		EventBus.on('action-throw-dices', handleThrowDices);
		return () => {
			EventBus.off('public-connect', handlePublicConnect);
			EventBus.off('enter-game', handleEnterGame);
			EventBus.off('action-throw-dices', handleThrowDices);
		};
	}, []);

	return null;
};

export default GameService;
