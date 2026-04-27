import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { PlayerHUD } from '@/components/layout/PlayerHUD';
import { useAudio } from '@/context/AudioContext';
import { EventBus } from '@/EventBus';
export const PlayersHUD = ({ players: initialPlayers, dynamicScale, onPlayerClick }) => {
    const { playSound } = useAudio();
    const [playersList, setPlayersList] = useState(initialPlayers);
    const [isVisible, setIsVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [canClick, setCanClick] = useState(false);
    useEffect(() => {
        const handleModelUpdate = (gameModel) => {
            if (!gameModel || !gameModel.players)
                return;
            const updatedPlayers = Object.values(gameModel.players).map((p) => ({
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
        const handleShow = () => { setIsVisible(true); };
        const handleDarkMode = (active) => { setIsDarkMode(active); };
        const handleSetClickable = (active) => { setCanClick(active); };
        EventBus.on('model-updated', handleModelUpdate);
        EventBus.on('hide-players-hud', handleHide);
        EventBus.on('show-players-hud', handleShow);
        EventBus.on('dark-mode', handleDarkMode);
        EventBus.on('set-hud-clickable', handleSetClickable);
        return () => {
            EventBus.off('model-updated', handleModelUpdate);
            EventBus.off('hide-players-hud', handleHide);
            EventBus.off('show-players-hud', handleShow);
            EventBus.off('dark-mode', handleDarkMode);
            EventBus.off('set-hud-clickable', handleSetClickable);
        };
    }, []);
    const handlePlayerClick = (playerId) => {
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
                    sender: me, // quien inicia tradeo
                    receiver: targetPlayer, // el otro jugador
                });
                EventBus.emit('set-hud-clickable', false);
                EventBus.emit('show-selection-notice', null);
            }
            onPlayerClick?.(playerId);
        }
    };
    return (_jsx("div", { className: `absolute right-[3vw] top-1/2 flex flex-col gap-[6vh] z-10 origin-right transition-transform duration-300 ease-in-out group/list
                ${isDarkMode
            ? (canClick ? 'opacity-100 scale-100' : 'opacity-30 scale-95')
            : 'opacity-100 scale-100'}`, style: {
            transform: `translateY(-50%) translateX(${isVisible ? '0' : '150%'}) scale(${dynamicScale})`,
            pointerEvents: !isVisible ? 'none' : (canClick || !isDarkMode ? 'auto' : 'none')
        }, children: playersList?.map((player) => (_jsx("div", { className: canClick ? "pointer-events-auto cursor-pointer" : "pointer-events-none", children: _jsx(PlayerHUD, { playerId: player.id, initialName: player.name, initialColor: player.color, initialBalance: player.balance, 
                //propertiesCount={player.properties?.length || 0}
                isClickable: canClick, onClick: () => handlePlayerClick(player.id) }) }, player.id))) }));
};
