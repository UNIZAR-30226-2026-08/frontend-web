import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EventBus } from "@/EventBus";
const ModeContent = ({ mode, gridImageUrl }) => (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-110 pointer-events-none", style: {
                backgroundImage: `url(${gridImageUrl})`,
                backgroundSize: "200% 200%",
                backgroundPosition: mode.pos,
            } }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" }), _jsx("div", { className: "absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 text-white pointer-events-none", children: _jsx("span", { className: "text-5xl font-black uppercase italic tracking-tighter leading-none", children: mode.title }) })] }));
/**
 * Private room lobby
 * For room owner, handles number of users and bots (TODO bot difficulty level)
 * For every player in the room, toggles ready state to begin game
 * @module Pages/Lobby
 * @return complete Lobby page
 */
export function Lobby() {
    const gridImageUrl = "src/assets/bg_city_white.jpg";
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    const navigate = useNavigate();
    const [imOwner, setImOwner] = useState(true); // TODO - check who is owner in logs
    const [imReady, setImReady] = useState(false);
    const [copied, setCopied] = useState(false); // para el icono de copiar código
    const roomCode = "123456"; // TODO: cambiar cuando esté conectado
    const players = [
        { title: "usuario1", pos: "0% 0%", isBot: false },
        { title: "usuario2", pos: "100% 0%", isBot: false },
        // { title: "usuario3", pos: "0% 100%"},
        // { title: "usuario4", sub: "Amarillo", pos: "0% 100%"},
    ];
    const [difficulty, setDifficulty] = useState('Medio');
    const [lobbyPlayers, setLobbyPlayers] = useState(players);
    const addBot = (index) => {
        if (lobbyPlayers[index])
            return;
        const newBot = { title: `bot ${index + 1}`, pos: "0% 100%", isBot: true };
        const newPlayers = [...lobbyPlayers];
        newPlayers[index] = newBot;
        setLobbyPlayers(newPlayers);
    };
    const removeBot = (index) => {
        const newPlayers = [...lobbyPlayers];
        //newPlayers[index] = null;
        setLobbyPlayers(newPlayers);
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };
    const lobbySlots = Array.from({ length: 4 }, (_, i) => lobbyPlayers[i] || null);
    const activePlayersCount = lobbyPlayers.filter(player => player !== null).length;
    const handleVoluntaryLeave = () => {
        EventBus.emit('private-cancel');
        navigate(-1);
    };
    useEffect(() => {
        const handleOwnerToggle = (data) => {
            //setImOwner(data.is_owner);
            if (data.is_owner) {
                setImReady(true);
                EventBus.emit('private-set-ready', true);
            }
        };
        const handlePlayerJoined = (data) => { };
        const handlePlayerLeft = (data) => { };
        const handleRoomSettings = (data) => { };
        const handleSomeoneReady = (data) => { };
        const handleEnter = () => navigate('/phaser-game');
        EventBus.on('you-may-now-enter-the-game', handleEnter);
        EventBus.on('private-room-owner-toggle', handleOwnerToggle);
        EventBus.on('private-room-player-joined', handlePlayerJoined);
        EventBus.on('private-room-player-left', handlePlayerLeft);
        EventBus.on('private-room-settings', handleRoomSettings);
        EventBus.on('private-room-ready', handleSomeoneReady);
        return () => {
            EventBus.off('you-may-now-enter-the-game', handleEnter);
            EventBus.off('private-room-owner-toggle', handleOwnerToggle);
            EventBus.off('private-room-player-joined', handlePlayerJoined);
            EventBus.off('private-room-player-left', handlePlayerLeft);
            EventBus.off('private-room-settings', handleRoomSettings);
            EventBus.off('private-room-ready', handleSomeoneReady);
        };
    }, [navigate]);
    const handleButtonClick = () => {
        if (imOwner) {
            EventBus.emit('private-set-ready', true); // TODO
            EventBus.emit('private-start');
        }
        else {
            const nextReadyState = !imReady;
            setImReady(nextReadyState);
            EventBus.emit('private-set-ready', nextReadyState);
        }
    };
    return (_jsxs("div", { className: "relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none", children: [_jsx(PageHeader, { title: "Lobby", onBack: handleVoluntaryLeave }), _jsxs("div", { className: "grid grid-cols-1 grid-rows-1 gap-10 py-10 px-10", style: {
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                    backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                    backgroundRepeat: "repeat",
                    backgroundBlendMode: "overlay",
                }, children: [_jsx("div", { className: "flex justify-end w-full max-w-7xl mx-auto pr-4", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsxs("span", { className: "text-zinc-500 uppercase font-black tracking-widest text-[11px] flex items-center gap-2 mb-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" }), "Nivel de los Bots"] }), _jsxs("div", { className: "relative group", children: [_jsx("select", { value: difficulty, onChange: (e) => setDifficulty(e.target.value), className: "appearance-none bg-white border-4 border-zinc-200 rounded-full px-8 py-3 \n                                    font-black uppercase text-sm text-zinc-700 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.05)] \n                                    transition-all cursor-pointer pr-14 \n                                    hover:border-[var(--color-primary)] focus:outline-none focus:ring-transparent", style: {
                                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e")`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "right 1.2rem center",
                                                backgroundSize: "1.2em"
                                            }, children: ['Muy fácil', 'Fácil', 'Medio', 'Difícil', 'Muy difícil', 'Experto'].map((level) => (_jsx("option", { value: level, className: "font-sans normal-case text-base text-zinc-900", children: level }, level))) }), _jsx("div", { className: "absolute inset-0 rounded-full pointer-events-none group-hover:ring-2 group-hover:ring-[var(--color-primary)]/20 transition-all" })] })] }) }), _jsx("div", { className: "grid grid-cols-4 gap-5 h-[300px] items-center mt-20", children: lobbySlots.map((slot, index) => (_jsx("div", { className: `
                            relative w-full h-full overflow-hidden
                            rounded-[7rem] border-4  group
                            flex items-center justify-center
                            ${slot ? 'border-solid border-white shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)] bg-zinc-200' : 'bg-zinc-100/90 border-dashed'}
                        `, children: slot ? (_jsxs(_Fragment, { children: [_jsx(Button, { className: "w-full h-full p-0 bg-transparent hover:bg-transparent cursor-default", children: _jsx(ModeContent, { mode: slot, gridImageUrl: gridImageUrl }) }), slot.isBot && (_jsx(Button, { onClick: () => removeBot(index), className: "absolute flex items-center justify-center opacity-0 group-hover:opacity-100\n                                        transition-opacity duration-300 cursor-pointer", children: _jsx("span", { className: "text-zinc-300 text-6xl font-light hover:text-white transition-colors", children: "\u2715" }) }))] })) : (
                            // No hay jugador
                            _jsxs("div", { className: "flex flex-col items-center justify-center w-full h-full p-6", children: [_jsxs("div", { className: "flex flex-col items-center opacity-30", children: [_jsx("div", { className: "w-12 h-12 border-4 border-zinc-400 rounded-full border-t-transparent animate-spin mb-4" }), _jsx("span", { className: "font-bold uppercase tracking-widest text-zinc-500", children: "Esperando..." })] }), _jsx("div", { className: "absolute bottom-10", children: _jsx(Button, { onClick: () => addBot(index), className: `bg-[var(--color-primary)] text-[var(--color-text)] text-[16px] font-black uppercase px-6 py-2 rounded-full
                                                    ${bouncyAnimation}`, children: "+ A\u00F1adir Bot" }) })] })) }, index))) }), _jsxs("div", { className: "flex flex-col items-center gap-6 mt-6 mb-14", children: [_jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsx("span", { className: "text-zinc-500 uppercase font-bold tracking-widest text-xs", children: "C\u00F3digo de la sala" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h1", { className: "text-5xl font-black tracking-tighter text-[var(--color-primary)] drop-shadow-sm leading-none", children: roomCode }), _jsxs(Button, { onClick: copyToClipboard, className: "group relative p-2 rounded-full transition-all flex items-center justify-center", title: "Copiar c\u00F3digo", children: [_jsx("span", { className: `transition-all duration-200 ${copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`, children: _jsx("img", { src: "/icons/copy-regular-full.svg", className: "w-10 h-10 text-zinc-500", alt: "Copiar" }) }), copied && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center animate-in zoom-in duration-300", children: _jsx("img", { src: "/icons/copy-solid-full.svg", className: "w-10 h-10 text-zinc-500", alt: "Copiado" }) }))] })] }), _jsxs("span", { className: "text-zinc-400 uppercase font-bold tracking-widest text-[14px] mt-2", children: ["Jugadores en sala: ", activePlayersCount, " / 4"] })] }), _jsx(Button, { type: "submit", variant: 'magnate', onClick: handleButtonClick, className: `bg-[var(--color-primary)] text-[var(--color-text)] text-[30px] uppercase font-bold w-[320px] h-14
                    ${bouncyAnimation}`, children: imOwner ? "Comenzar juego" : (imReady ? "Listo" : "No listo") })] })] })] }));
}
