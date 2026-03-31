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
    // isClickable?: boolean;
    onPlayerClick?: (playerId: string) => void;
}

export const PlayersHUD = ({ 
    players,  
    dynamicScale, //isClickable = false, 
    onPlayerClick 
}: PlayersHUDProps) => {
    const { playSound } = useAudio();
    const [isVisible, setIsVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [canClick, setCanClick] = useState(false);

    useEffect(() => {
       
        const handleHide = () => setIsVisible(false);
        const handleShow = () => {setIsVisible(true);}
        const handleDarkMode = (active: boolean) => { setIsDarkMode(active); };
        const handleSetClickable = (active: boolean) => { setCanClick(active); };

        EventBus.on('hide-players-hud', handleHide);
        EventBus.on('show-players-hud', handleShow);
        EventBus.on('dark-mode', handleDarkMode);
        EventBus.on('set-hud-clickable', handleSetClickable);

        return () => {
            EventBus.off('hide-players-hud', handleHide);
            EventBus.off('show-players-hud', handleShow);
            EventBus.off('dark-mode', handleDarkMode);
            EventBus.off('set-hud-clickable', handleSetClickable);
        };
    }, []);

    const handlePlayerClick = (playerId: string) => {
        if (canClick) {
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
            className={`absolute right-[3vw] top-1/2 flex flex-col gap-[6vh] z-10 origin-right transition-transform duration-300 ease-in-out group/list
                ${isDarkMode 
                ? (canClick ? 'opacity-100 scale-100' : 'opacity-30 scale-95')
                : 'opacity-100 scale-100'}`}
            style={{ 
                transform: `translateY(-50%) translateX(${isVisible ? '0' : '150%'}) scale(${dynamicScale})`,
                pointerEvents: !isVisible ? 'none' : (canClick || !isDarkMode ? 'auto' : 'none')
            }}
        >
            {players?.map((player) => (
                <div key={player.id} 
                    className={canClick ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}>
                    <PlayerHUD 
                        playerId={player.id} 
                        initialName={player.name} 
                        initialColor={player.color} 
                        initialBalance={player.balance}
                        isClickable={canClick}
                        onClick={() => handlePlayerClick(player.id)}
                    />
                </div>
            ))}
        </div>
    );
};
