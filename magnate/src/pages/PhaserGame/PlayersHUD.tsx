import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerHUD } from '@/components/layout/PlayerHUD';
import { useAudio } from '@/context/AudioContext';
import { EventBus } from '@/EventBus';
import { PlayerModel } from '@/phaser/models/PlayerModel';
import { useItemData } from '@/context/ItemContext';

interface PlayersHUDProps {
    players: PlayerModel[];
    dynamicScale: number;
    onPlayerClick?: (playerId: string) => void;
}

export const PlayersHUD = ({ players: initialPlayers, dynamicScale, onPlayerClick }: PlayersHUDProps) => {
    const { playSound } = useAudio();
    const { getItemInfo } = useItemData();
    const [playersList, setPlayersList] = useState<any[]>(initialPlayers);
    const [isVisible, setIsVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [canClick, setCanClick] = useState(false);
    const [activeEmojis, setActiveEmojis] = useState<{ [key: string]: string }>({});

    const playerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const emojiTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

    const emitCoordinates = useCallback(() => {
        const positions: Record<string, { x: number, y: number }> = {};
        
        Object.entries(playerRefs.current).forEach(([id, el]) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                positions[id] = {
                    x: rect.left,
                    y: rect.top + (rect.height / 2)
                };
            }
        });

        if (Object.keys(positions).length > 0) {
            // console.log("Card pos: ", positions);
            EventBus.emit('player-hud-positions', positions);
        }
    }, []);

	useEffect(() => {
		setPlayersList(initialPlayers);	
	}, [initialPlayers]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            emitCoordinates();
        }, 350);

        window.addEventListener('resize', emitCoordinates);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', emitCoordinates);
        };
    }, [playersList, isVisible, dynamicScale, emitCoordinates]);

    useEffect(() => {
        const handleSinglePlayerUpdate = (updatedPlayer: any) => {
            setPlayersList(prev => prev.map(p => 
                p.id === updatedPlayer.id ? { ...p, ...updatedPlayer } : p
            ));
        };
        const handleModelUpdate = (gameModel: any) => {
            if (!gameModel || !gameModel.players) return;
            const updatedPlayers = Object.values(gameModel.players).map((p: any) => ({
                id: p.id,
                name: p.name,
                balance: p.balance,
                properties: p.properties,
                
                color: typeof p.color === 'number' 
                    ? `#${p.color.toString(16).padStart(6, '0')}` 
                    : p.color
            }));
            setPlayersList(updatedPlayers);
        };
        const handleHide = () => setIsVisible(false);
        const handleShow = () => {setIsVisible(true);}
        const handleDarkMode = (active: boolean) => { setIsDarkMode(active); };
        const handleSetClickable = (active: boolean) => { setCanClick(active); };

        EventBus.on('player-updated', handleSinglePlayerUpdate);
        EventBus.on('model-updated', handleModelUpdate);
        EventBus.on('hide-players-hud', handleHide);
        EventBus.on('show-players-hud', handleShow);
        EventBus.on('dark-mode', handleDarkMode);
        EventBus.on('set-hud-clickable', handleSetClickable);

        return () => {
            EventBus.off('player-updated', handleSinglePlayerUpdate);
            EventBus.off('model-updated', handleModelUpdate);
            EventBus.off('hide-players-hud', handleHide);
            EventBus.off('show-players-hud', handleShow);
            EventBus.off('dark-mode', handleDarkMode);
            EventBus.off('set-hud-clickable', handleSetClickable);
        };
    }, []);

    useEffect(() => {
        const handleIncomingMessage = (event: any) => {
            const { playerId, text } = event;
            if (typeof text === 'string' && text.startsWith('/emoji ')) {
                const emojiId = Number(text.split(' ')[1]);
                const info = getItemInfo(emojiId);

                if (info) {
                    setActiveEmojis(prev => ({ ...prev, [playerId]: info.url }));

                    if (emojiTimeouts.current[playerId]) {
                        clearTimeout(emojiTimeouts.current[playerId]);
                    }

                    emojiTimeouts.current[playerId] = setTimeout(() => {
                        setActiveEmojis(prev => {
                            const newState = { ...prev };
                            delete newState[playerId];
                            return newState;
                        });
                    }, 4000);
                }
            }
        };

        EventBus.on('receive-chat-message', handleIncomingMessage);
        return () => {
            EventBus.off('receive-chat-message', handleIncomingMessage);
        };
    }, [getItemInfo]);

    const handlePlayerClick = (playerId: string) => {
        if (canClick) {
            playSound('player_choose');
            
            const targetPlayer = playersList.find(p => p.id === playerId);
            const myId = localStorage.getItem('myId');
            const me = playersList.find(p => p.id === myId);

            if (playerId === myId) {
                EventBus.emit('show-toast', { 
                    message: "No puedes iniciar un intercambio contigo mismo",
                    duration: 3000 
                });
                EventBus.emit('show-selection-notice', null);
                return;
            }

            if (targetPlayer && me) {
                EventBus.emit('show-trading-mode', {
                    sender: me, 
                    receiver: targetPlayer, 
                });
                EventBus.emit('set-hud-clickable', false);
                EventBus.emit('show-selection-notice', null);
            }
            onPlayerClick?.(playerId);
        }
    };

    return (
        <div 
            className={`fixed right-[3vw] top-1/2 flex flex-col gap-[6vh] z-10 origin-right transition-transform duration-300 ease-in-out group/list
                ${isDarkMode 
                ? (canClick ? 'opacity-100 scale-100' : 'opacity-30 scale-95')
                : 'opacity-100 scale-100'}`}
            style={{ 
                transform: `translateY(-50%) translateX(${isVisible ? '0' : '150%'}) scale(${dynamicScale})`,
                pointerEvents: !isVisible ? 'none' : (canClick || !isDarkMode ? 'auto' : 'none')
            }}
        >
            {playersList?.map((player) => {
                const isEmojiActive = activeEmojis[String(player.id)];

                return (
                    <div 
                        key={player.id} 
                        ref={(el) => { playerRefs.current[player.id] = el; }}
                        className={`relative w-fit ${canClick ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
                    >
                        {isEmojiActive && (
                            <div 
                                className="absolute top-1/2 left-0 -translate-y-[100%] -translate-x-[25%] z-[100] pointer-events-none"
                            >
                                <div className="animate-bounce flex items-center justify-center">
                                    <img 
                                        src={isEmojiActive} 
                                        alt="emoji" 
                                        className="w-14 h-14 object-contain drop-shadow-xl" 
                                    />
                                </div>
                            </div>
                        )}
                        <PlayerHUD 
                            playerId={player.id} 
                            initialName={player.name} 
                            initialColor={player.color} 
                            initialBalance={player.balance}
                            isClickable={canClick}
                            onClick={() => handlePlayerClick(player.id)}
                        />
                    </div>
                );
            })}
        </div>
    );
};
