import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Howl } from 'howler';

export type AudioChannel = 'bg' | 'ui' | 'sfx';
export type SoundId = 'bg_menu' | 'bg_game' | 'button_back' | 'button_main' | 'button_ok' | 
		'slidebar_up' | 'slidebar_down' | 'toggle_settings' | 
		'bankrupt' | 'boat_horn' | 'message_send' | 'tram_bell' |
		'bookmark' | 'card_place_1' | 'card_slide' | 
		'dice_grab' | 'dice_shake' | 'dice_throw' | 'end_of_game' | 'fantasy' | 
		'house_build' | 'house_down' | 'jail_door' | 'jail_turn_in' | 'message_incoming' | 
		'money_lose' | 'money_win' | 'parking' | 'player_token_hop' | 
		'player_choose' | 'trade_shift' |
		'mortgage' | 'toast' | 'timeout' | 'auction_end' |
		'trade_turned_down' | 'trade_accepted' | 'turn_banner_in' | 'turn_banner_out';

interface AudioRegistryItem {
	howl: Howl;
	channel: AudioChannel;
}

const audioRegistry: Record<SoundId, AudioRegistryItem> = {
	bg_menu: {
		howl: new Howl({src: ['/sounds/menu_bg.mp3'], loop: true }),
		channel: 'bg'
	},
	bg_game: {
		howl: new Howl({src: ['/sounds/game_bg.mp3'], loop: true }),
		channel: 'bg'
	},
	button_back: {
		howl: new Howl({src: [
			'/sounds/sfx/button_back.ogg'
			]}),
		channel: 'ui'
	},
	button_main: {
		howl: new Howl({src: [
			'/sounds/sfx/button_main.mp3'
			]}),
		channel: 'ui'
	},
	button_ok: {
		howl: new Howl({src: [
			'/sounds/sfx/button_ok.ogg'
			]}),
		channel: 'ui'
	},
	slidebar_down: {
		howl: new Howl({src: [
			'/sounds/sfx/slidebar_down.ogg'
			]}),
		channel: 'ui'
	},
	slidebar_up: {
		howl: new Howl({src: [
			'/sounds/sfx/slidebar_up.ogg'
			]}),
		channel: 'ui'
	},
	toggle_settings: {
		howl: new Howl({src: [
			'/sounds/sfx/toggle_settings.mp3'
			]}),
		channel: 'ui'
	},
	bankrupt: {
		howl: new Howl({src: [
			'/sounds/sfx/bankrupt.mp3',
		]}),
		channel: 'sfx'
	},
	boat_horn: { // TODO over bridge
		howl: new Howl({src: [
			'/sounds/sfx/boat_horn.mp3',
		]}),
		channel: 'sfx'
	},
	bookmark: {
		howl: new Howl({src: [
			'/sounds/sfx/bookmark_card-shove-2.ogg',
		]}),
		channel: 'sfx'
	},
	card_place_1: {
		howl: new Howl({src: [
			'/sounds/sfx/card_place_1.ogg',
		]}),
		channel: 'sfx'
	},
	card_slide: {
		howl: new Howl({src: [
			'/sounds/sfx/card_slide.ogg',
		]}),
		channel: 'sfx'
	},
	dice_grab: {
		howl: new Howl({src: [
			'/sounds/sfx/dice_grab.ogg',
		]}),
		channel: 'sfx'
	},
	dice_shake: {
		howl: new Howl({src: [
			'/sounds/sfx/dice_shake.ogg',
		]}),
		channel: 'sfx'
	},
	dice_throw: {
		howl: new Howl({src: [
			'/sounds/sfx/dice_throw.ogg',
		]}),
		channel: 'sfx'
	},
	end_of_game: {
		howl: new Howl({src: [
			'/sounds/sfx/end_of_game.mp3',
		]}),
		channel: 'sfx'
	},
	fantasy: {
		howl: new Howl({src: [
			'/sounds/sfx/fantasy.mp3',
		]}),
		channel: 'sfx'
	},
	house_build: {
		howl: new Howl({src: [
			'/sounds/sfx/house_build.mp3',
		]}),
		channel: 'sfx'
	},
	house_down: {
		howl: new Howl({src: [
			'/sounds/sfx/house_down.mp3',
		]}),
		channel: 'sfx'
	},
	jail_door: {
		howl: new Howl({src: [
			'/sounds/sfx/jail_door.mp3',
		]}),
		channel: 'sfx'
	},
	jail_turn_in: {
		howl: new Howl({src: [
			'/sounds/sfx/jail_turn_in.mp3',
		]}),
		channel: 'sfx'
	},
	message_incoming: { // TODO
		howl: new Howl({src: [
			'/sounds/sfx/message_incoming.ogg',
		]}),
		channel: 'sfx'
	},
	message_send: { // TODO
		howl: new Howl({src: [
			'/sounds/sfx/message_send.ogg',
		]}),
		channel: 'sfx'
	},
	money_lose: {
		howl: new Howl({src: [
			'/sounds/sfx/money_lose.mp3',
		]}),
		channel: 'sfx'
	},
	money_win: {
		howl: new Howl({src: [
			'/sounds/sfx/money_win.mp3',
		]}),
		channel: 'sfx'
	},
	parking: {
		howl: new Howl({src: [
			'/sounds/sfx/parking.mp3',
		]}),
		channel: 'sfx'
	},
	player_token_hop: {
		howl: new Howl({src: [
			'/sounds/sfx/player_token_hop.ogg',
		]}),
		channel: 'sfx'
	},
	trade_turned_down: {
		howl: new Howl({src: [
			'/sounds/sfx/trade_turned_down.ogg',
		]}),
		channel: 'sfx'
	},
	trade_accepted: {
		howl: new Howl({src: [
			'/sounds/sfx/trade_accepted.mp3',
		]}),
		channel: 'sfx'
	},
	timeout: {
		howl: new Howl({src: [
			'/sounds/sfx/timeout_boop.mp3',
		]}),
		channel: 'sfx'
	},
	auction_end: {
		howl: new Howl({src: [
			'/sounds/sfx/auction_end.mp3',
		]}),
		channel: 'sfx'
	},
	player_choose: {
		howl: new Howl({src: [
			'/sounds/sfx/chips-handle-4.ogg',
		]}),
		channel: 'sfx'
	},
	trade_shift: { 
		howl: new Howl({src: [
			'/sounds/sfx/trade_shift.ogg',
		]}),
		channel: 'sfx'
	},
	turn_banner_in: {
		howl: new Howl({src: [
			'/sounds/sfx/turn_banner_in.mp3',
		]}),
		channel: 'sfx'
	},
	turn_banner_out: {
		howl: new Howl({src: [
			'/sounds/sfx/turn_banner_out.mp3',
		]}),
		channel: 'sfx'
	},
	mortgage: {
		howl: new Howl({src: [
			'/sounds/sfx/mortgage_klink.mp3',
		]}),
		channel: 'sfx'
	},
	toast: {
		howl: new Howl({src: [
			'/sounds/sfx/toast.mp3',
		]}),
		channel: 'sfx'
	},
	tram_bell: {
		howl: new Howl({src: [
			'/sounds/sfx/tram_bell.mp3'
		]}),
		channel: 'sfx'
	}
};

interface AudioContextType {
	playSound: (soundId: SoundId) => number | undefined;
	stopSound: (soundId: SoundId) => void;
	fadeOutSound: (soundId: SoundId, duration?: number) => void;
	fadeInSound: (soundId: SoundId, duration?: number) => void;
	changeMusic: (newMusicId: SoundId, duration?: number) => void;
	stopChannel: (channelName: AudioChannel) => void;
	volumes: Record<AudioChannel, number>; 
	updateVolume: (Channel: AudioChannel, value:number | string) => void;
	mutes: Record<AudioChannel, boolean>;
	toggleMute: (channel: AudioChannel) => void;	
	setMute: (channel: AudioChannel, mode?: boolean) => void;	
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
	children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
	// Initial state of channels
	const [volumes, setVolumes] = useState({ bg:0.5, sfx:0.8, ui:1.0 });
	const [mutes, setMutes] = useState({ bg:false, sfx:false, ui:false });

	// Update volume
	useEffect(() => {
		Object.values(audioRegistry).forEach(({ howl, channel }) => {
			const isMuted = mutes[channel];
			const vol = volumes[channel];
			howl.volume(isMuted ? 0 : vol);
		});
	}, [volumes, mutes]);

	const playSound = (soundId: SoundId) => {
		const sound = audioRegistry[soundId];
		if (!sound) return; // Did not exist
		return sound.howl.play();
	};

	const stopSound = (soundId: SoundId) => {
		if (audioRegistry[soundId]) audioRegistry[soundId].howl.stop();
	};

	const stopChannel = (channelName: AudioChannel) => {
		(Object.keys(audioRegistry) as SoundId[]).forEach(key => {
			const { howl, channel } = audioRegistry[key];
			if (channel === channelName) {
				howl.stop();
			}
		});
	};

	const fadeOutSound = (soundId: SoundId, duration = 1000) => {
		const sound = audioRegistry[soundId];
		if (!sound) return;

		const currentVol = sound.howl.volume();
		sound.howl.fade(currentVol, 0, duration);

		setTimeout(() => {
			sound.howl.stop();
			// In case we replay next time
			sound.howl.volume(currentVol);
		}, duration);
	};

	const fadeInSound = (soundId: SoundId, duration = 1000) => {
		const sound = audioRegistry[soundId];
		if (!sound) return;

		const currentVol = mutes[sound.channel] ? 0 : volumes[sound.channel];
		sound.howl.volume(0);
		sound.howl.play();
		sound.howl.fade(0, currentVol, duration);
	};

	// Only if it's not already playing
	const changeMusic = (newMusicId: SoundId, duration = 2000) => {
		const newMusic = audioRegistry[newMusicId];
		if (!newMusic) return;
		if (!newMusic.howl.playing()) {
			const changeChannel = newMusic.channel;
			(Object.keys(audioRegistry) as SoundId[]).forEach(soundId => {
				const { howl, channel } = audioRegistry[soundId];
				if (channel === changeChannel && howl.playing()) {
					fadeOutSound(soundId, duration);
				}
			});
			fadeInSound(newMusicId,duration);
		}
	};

	const updateVolume = (channel: AudioChannel, value: number | string) => {
		const newVolume = parseFloat(String(value));
		setVolumes(prev => ({ ...prev, [channel]: newVolume }));
	};

	const toggleMute = (channel: AudioChannel) => {
		setMutes(prev => ({ ...prev, [channel]: !prev[channel] }));
	};

	const setMute = (channel: AudioChannel, mode = true) => {
		setMutes(prev => ({ ...prev, [channel]: mode }));
	};

	return (
		<AudioContext.Provider value={{
			playSound, stopSound, stopChannel,
			changeMusic, fadeInSound, fadeOutSound,
			volumes, updateVolume, 
			mutes, toggleMute, setMute
		}}>
			{children}
		</AudioContext.Provider>
	);
};

export const useAudio = (): AudioContextType => {
	const context = useContext(AudioContext);
	if (context === undefined) {
		throw new Error('useAudio debe usarse dentro de un AudioProvider');
	}
	return context;
}

// Outside the audio context for direct use in Phaser scenes and other non-React code
export const playSoundEffect = (soundId: SoundId): number | undefined => {
	const sound = audioRegistry[soundId];
	if (!sound) return;
	return sound.howl.play();
}
