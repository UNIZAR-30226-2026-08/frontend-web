import { useEffect, useRef, useState, useMemo } from 'react';
import * as Phaser from 'phaser';
import { GameConfig } from '../../phaser/config';
import { PlayerHUD } from '@/components/layout/PlayerHUD';
import { FantasyOverlay } from "./FantasyOverlay";
import { PropertyOverlay } from "./PropertyOverlay";
import { CornerOverlay } from "./CornerOverlay";
import { ServiceOverlay } from "./ServiceOverlay";
import { AuctionOverlay } from './AuctionOverlay';
import { TradingOverlay  } from './TradingOverlay';
import { ControlsHUD } from '@/components/layout/ControlsHUD';
import { EventBus } from '@/EventBus';

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
        <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-[var(--color-primary)]">
            <div id="phaser-container" className="flex items-center justify-center w-full h-full [&>canvas]:mx-auto" />

            <ControlsHUD />

            <div 
                className="absolute right-[3vw] top-1/2 -translate-y-1/2 flex flex-col gap-[6vh] pointer-events-none z-10 origin-right transition-transform duration-150"
                style={{ transform: `translateY(-50%) scale(${dynamicScale})` }}
            >
                {players?.map((player) => (
                    <div key={player.id} className="pointer-events-auto">
                        <PlayerHUD 
                            playerId={player.id} 
                            initialName={player.name} 
                            initialColor={player.color} 
                            initialBalance={player.balance}
                        />
                    </div>
                ))}
            </div>
            <FantasyOverlay />
            <PropertyOverlay />
            <CornerOverlay />
            <ServiceOverlay />
            <AuctionOverlay />
            <TradingOverlay />
        </div>
    );
};
