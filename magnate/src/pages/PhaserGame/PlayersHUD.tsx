import React, { useState, useEffect } from 'react';
import { PlayerHUD } from '@/components/layout/PlayerHUD';
import { useAudio } from '@/context/AudioContext';
import { EventBus } from '@/EventBus';

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
    isClickable = true, 
    onPlayerClick 
}: PlayersHUDProps) => {
    const { playSound } = useAudio();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleHide = () => setIsVisible(false);
        const handleShow = () => setIsVisible(true);

        EventBus.on('hide-players-hud', handleHide);
        EventBus.on('show-players-hud', handleShow);

        return () => {
            EventBus.off('hide-players-hud', handleHide);
            EventBus.off('show-players-hud', handleShow);
        };
    }, []);

    const handlePlayerClick = (playerId: string) => {
        if (isClickable) {
            playSound('player_token_hop');
            
            const targetPlayer = players.find(p => p.id === playerId);
            const me = players[0]; 
            if (targetPlayer && me) {
                EventBus.emit('open-trading-mode', { 
                    sender: me,
                    receiver: targetPlayer,
                    allPlayers: players
                });
            }
            onPlayerClick?.(playerId);
        }
    };

    return (
        <div 
            className="absolute right-[3vw] top-1/2 flex flex-col gap-[6vh] pointer-events-none z-10 origin-right transition-transform duration-300 ease-in-out group/list"
            style={{ 
                transform: `translateY(-50%) translateX(${isVisible ? '0' : '150%'}) scale(${dynamicScale})` 
            }}
        >
            {players?.map((player) => (
                <div key={player.id} className="pointer-events-auto">
                    <PlayerHUD 
                        playerId={player.id} 
                        initialName={player.name} 
                        initialColor={player.color} 
                        initialBalance={player.balance}
                        isClickable={isClickable}
                        onClick={() => handlePlayerClick(player.id)}
                    />
                </div>
            ))}
        </div>
    );
};
