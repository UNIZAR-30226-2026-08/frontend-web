import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { GameConfig } from '../../phaser/config';
import { PlayerHUD } from '@/components/layout/PlayerHUD';
import { FantasyOverlay } from "./FantasyOverlay";

import { EventBus } from '@/EventBus'

// TODO: A lo mejor mover esto a otro sitio
interface PlayerInitData {
    id: string;
    name: string;
    color: string;
}

export const PhaserGame = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const [players, setPlayers] = useState<PlayerInitData[]>([]);

    useEffect(() => {
        const handleSetupPlayers = (playerList: PlayerInitData[]) => {
            setPlayers(playerList);
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
        <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-[var(--color-background)]">
            
            <div id="phaser-container" className="flex items-center justify-center w-full h-full [&>canvas]:mx-auto" />

            <div className="absolute top-84 right-8 flex flex-col gap-8 pointer-events-none z-10">
                
                {players.map((player) => (
                    <div key={player.id} className="pointer-events-auto">
                        <PlayerHUD 
                            playerId={player.id} 
                            initialName={player.name} 
                            initialColor={player.color} 
                        />
                    </div>
                ))}

            </div>
            <FantasyOverlay />
        </div>
    );
};
