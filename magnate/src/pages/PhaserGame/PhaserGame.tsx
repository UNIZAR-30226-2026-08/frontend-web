import { useEffect, useRef, useState, useMemo } from 'react';
import * as Phaser from 'phaser';
import { GameConfig } from '../../phaser/config';
import { FantasyOverlay } from "./FantasyOverlay";
import { PropertyOverlay } from "./PropertyOverlay";
import { CornerOverlay } from "./CornerOverlay";
import { ServiceOverlay } from "./ServiceOverlay";
import { AuctionOverlay } from './AuctionOverlay';
import { TradingOverlay  } from './TradingOverlay';
import { TradeRequestOverlay } from './TradeRequestOverlay';
import { TramOverlay  } from './TramOverlay';
import { TurnInJailOverlay  } from './TurnInJailOverlay';
import { PlayersHUD } from './PlayersHUD';
import { ControlsHUD } from './ControlsHUD';
import { ChatHUD } from './ChatHUD';
import { EventBus } from '@/EventBus';
import { useAudio } from "@/context/AudioContext";
import { PropertyAdminOverlay } from './PropertyAdminOverlay';
import { GameOver } from './GameOver';

import { BannerMessage } from '@/components/layout/BannerMessage';
import { ToastMessage } from '@/components/layout/ToastMessage';

import { SecretaryAnimation } from './SecretaryAnimation';

interface PlayerInitData {
    id: string;
    name: string;
    color: string;
    balance: number;
}

export const PhaserGame = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const [players, setPlayers] = useState<PlayerInitData[]>([]);
    const [windowSize, setWindowSize] = useState({ 
        width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
        height: typeof window !== 'undefined' ? window.innerHeight : 1080 
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { changeMusic, playSound } = useAudio();

    useEffect(() => {
        changeMusic('bg_game', 1000);

        const handlePlaySfx = (soundId: any) => {
            playSound(soundId);
        };

        EventBus.on('play-sfx', handlePlaySfx);

        return () => {
            EventBus.off('play-sfx', handlePlaySfx);
        };
    }, [changeMusic, playSound]);

    const dynamicScale = useMemo(() => {
        const baseHeight = 1080;
        const ratio = windowSize.height / baseHeight;
        return Math.min(Math.max(ratio, 1.0), 1.6);
    }, [windowSize.height]);

    useEffect(() => {
        const handleSetupPlayers = (playerList: PlayerInitData[]) => {
            setPlayers(playerList);
            EventBus.emit('players-received');
        };
        
        EventBus.on('setup-players', handleSetupPlayers);

        if (!gameRef.current) {
            gameRef.current = new Phaser.Game(GameConfig);
        }

        return () => {
            EventBus.off('setup-players', handleSetupPlayers);
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-[var(--color-black)]">
            <div 
                id="phaser-container" 
                className="relative z-10 flex items-center justify-center w-full h-full [&>canvas]:mx-auto" 
            />

            <BannerMessage />
            <ToastMessage />

            <SecretaryAnimation />

            <ControlsHUD />
            <ChatHUD />
            <PlayersHUD players={players} dynamicScale={dynamicScale} />

            <FantasyOverlay />
            <PropertyOverlay />
            <CornerOverlay />
            <ServiceOverlay />
            <AuctionOverlay />
            <TradingOverlay />
            <TradeRequestOverlay />
            <TramOverlay />
            <TurnInJailOverlay />
            <PropertyAdminOverlay />
            <GameOver />
        </div>
    );
};
