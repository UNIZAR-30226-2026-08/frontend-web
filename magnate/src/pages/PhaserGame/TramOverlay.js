import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';
import { GameLogicManager } from '@/phaser/managers/GameLogicManager';
export const TramOverlay = () => {
    // ESTADOS DEL OVERLAY
    const [isOpen, setIsOpen] = useState(false);
    const [currentTileId, setCurrentTileId] = useState(null);
    const [selectedTram, setSelectedTram] = useState(null);
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    const stripedBackgroundStyle = { backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)),
            repeating-linear-gradient(
                -45deg,
                #ffffff,
                #ffffff 20px,
                #f3f4f6 20px,
                #f3f4f6 40px )`,
        backgroundSize: 'cover'
    };
    const { playSound } = useAudio();
    useEffect(() => {
        // From CornerOverlay if click on "Gestionar Desplazamiento"
        const handleOpen = (data) => {
            setCurrentTileId(data);
            setIsOpen(false);
            setSelectedTram(null);
            EventBus.emit('dark-mode', true);
            EventBus.emit('start-tram-selection'); // light board and wait for click
        };
        const handleTramSelected = (tileData) => {
            playSound('tram_bell');
            console.log("entré a handleTramSelected");
            if (!isOpen) {
                console.log("no está open");
                setSelectedTram(tileData);
                setIsOpen(true);
            }
        };
        EventBus.on('open-tram-overlay', handleOpen);
        EventBus.on('tram-tile-selected', handleTramSelected);
        return () => {
            EventBus.off('open-tram-overlay', handleOpen);
            EventBus.off('tram-tile-selected', handleTramSelected);
        };
    }, [isOpen, playSound]);
    // Restart tile selection
    const reOpenOverlay = () => {
        setIsOpen(false);
        setSelectedTram(null);
        EventBus.emit('dark-mode', true);
        EventBus.emit('start-tram-selection'); // light tiles and wait for click
    };
    const confirmTramTravel = () => {
        console.log("dentro de tram travel");
        const cost = (selectedTram.id === currentTileId) ? 0 : 30;
        console.log(selectedTram.id);
        const gameModel = GameLogicManager.getInstance().model;
        const myId = gameModel.myId;
        const me = gameModel.getPlayer(myId);
        if (me && me.balance < cost) {
            EventBus.emit('show-toast', {
                message: `No tienes suficientes créditos (${cost}M necesarios)`,
            });
            return;
        }
        EventBus.emit('action-take-tram', {
            square: selectedTram.id
        });
        setIsOpen(false);
        setSelectedTram(null);
        setCurrentTileId(null);
        EventBus.emit('dark-mode', false);
    };
    return (_jsx("div", { className: "fixed inset-0 z-[9999] pointer-events-none", children: selectedTram && (_jsx("div", { className: "fixed inset-0 z-[1002] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto", children: _jsx("div", { className: "w-[350px] animate-in zoom-in-95 duration-300 ease-out", children: _jsx("div", { className: "rounded-[40px] flex flex-col overflow-hidden shadow-2xl border-2 border-gray-200", style: stripedBackgroundStyle, children: _jsxs("div", { className: "flex flex-col items-center gap-8 p-10 text-center", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-2xl font-black italic uppercase text-slate-800 tracking-tighter leading-tight", children: 'Estación de tranvía' }), _jsx("p", { className: "text-[12px] font-bold text-[var(--color-primary)] uppercase tracking-widest", children: selectedTram.id === currentTileId
                                            ? `Tu estación actual: ${selectedTram.subText}`
                                            : `Destino: ${selectedTram.subText}` })] }), _jsxs("div", { className: "flex flex-col gap-4 w-full", children: [_jsx(Button, { onClick: confirmTramTravel, className: `w-full h-[50px] bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase text-[14px] tracking-wide rounded-full shadow-lg flex items-center justify-center px-4 ${bouncyAnimation}`, children: _jsxs("div", { className: "flex flex-col items-center leading-tight", children: [_jsx("span", { children: selectedTram.id === currentTileId
                                                        ? 'Permanecer aquí'
                                                        : 'Cambiar de estación' }), selectedTram.id !== currentTileId && (_jsx("span", { className: "text-[12px] opacity-80 font-bold tracking-tighter", children: "Coste: 30M" }))] }) }), _jsx(Button, { onClick: reOpenOverlay, className: `w-full h-[40px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[14px] tracking-wider rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`, children: "Elegir otra estaci\u00F3n" })] })] }) }) }) })) }));
};
