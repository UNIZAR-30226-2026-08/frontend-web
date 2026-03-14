import React from 'react';
import { PlayerHUD } from '@/components/layout/PlayerHUD';

interface PlayerInitData {
    id: string;
    name: string;
    color: string;
    balance: number;
}

interface PlayersHUDProps {
    players: PlayerInitData[];
    dynamicScale: number;
    isClickable?: boolean;
    onPlayerClick?: (playerId: string) => void;
}

export const PlayersHUD = ({ 
    players, 
    dynamicScale, 
    isClickable = true, // TODO: Conectar esto
    onPlayerClick 
}: PlayersHUDProps) => {
    return (
        <div 
            className="absolute right-[3vw] top-1/2 -translate-y-1/2 flex flex-col gap-[6vh] pointer-events-none z-10 origin-right transition-transform duration-150 group/list"
            style={{ transform: `translateY(-50%) scale(${dynamicScale})` }}
        >
            {players?.map((player) => (
                <div key={player.id} className="pointer-events-auto">
                    <PlayerHUD 
                        playerId={player.id} 
                        initialName={player.name} 
                        initialColor={player.color} 
                        initialBalance={player.balance}
                        isClickable={isClickable}
                        onClick={() => onPlayerClick?.(player.id)}
                    />
                </div>
            ))}
        </div>
    );
};;
