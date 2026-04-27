import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventBus } from "@/EventBus";
import { useAuth } from "@/context/AuthContext";
// @ts-ignore 
import { generatePrivateCode, checkPrivateCode } from "@/api/lobbyServices";
const ModeContent = ({ mode }) => (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-110 pointer-events-none", style: {
                backgroundSize: "200% 200%",
                backgroundPosition: mode.pos,
            } }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent pointer-events-none" }), _jsxs("div", { className: "absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 px-6 text-white pointer-events-none", children: [_jsx("span", { className: "text-5xl font-black uppercase italic tracking-tighter leading-none", children: mode.title }), mode.sub && (_jsx("span", { className: "text-sm font-bold uppercase opacity-60 tracking-[0.3em] mt-2 whitespace-normal leading-tight", children: mode.sub }))] })] }));
export function PrivateRoom() {
    const codeRef = useRef(null);
    const navigate = useNavigate();
    const backgroundImageUrls = {
        join: "/src/assets/images/join.png",
        host: "/src/assets/images/host.png",
    };
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    const modes = [
        { id: 'join', title: "Unirse", sub: "Introduce el código y únete a la sala", pos: "0% 0%", imageUrl: backgroundImageUrls.join },
        { id: 'host', title: "Crear", sub: "Crea una sala para que se unan tus amigos", pos: "100% 0%", imageUrl: backgroundImageUrls.host },
    ];
    const [activeMode, setActiveMode] = useState(null);
    const [displayedImage, setDisplayedImage] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const { token } = useAuth();
    useEffect(() => {
        const handleConnectResponse = (ok) => {
            if (ok) {
                navigate('/lobby');
            }
            else {
                if (codeRef.current) {
                    // full room
                    codeRef.current.setCustomValidity("No hay hueco para jugar en la sala con ese código");
                    codeRef.current.reportValidity();
                }
            }
        };
        EventBus.on('private-connect-response', handleConnectResponse);
        return () => {
            EventBus.off('private-connect-response', handleConnectResponse);
        };
    }, [navigate]);
    const handleButtonClick = (modeId) => {
        setActiveMode(modeId);
        if (modeId === 'join') {
            setDisplayedImage(backgroundImageUrls.join);
        }
        else if (modeId === 'host') {
            setDisplayedImage(backgroundImageUrls.host);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (activeMode === 'host') {
            console.log("host");
            // ask for code
            if (token) {
                generatePrivateCode(token, (newCode) => {
                    setRoomCode(newCode);
                    EventBus.emit('private-connect', newCode);
                    console.log('correct new room login:', newCode);
                });
            }
        }
        else {
            if (activeMode === 'join') {
                console.log("join");
                const cInput = codeRef.current;
                if (!cInput)
                    return;
                // room does not exist
                if (!checkPrivateCode(token, roomCode)) { // /lobby/check-code// !data.exists
                    codeRef.current?.setCustomValidity("No hay ninguna sala activa con ese código");
                    codeRef.current?.reportValidity();
                    return;
                }
                else {
                    EventBus.emit('private-connect', roomCode);
                    console.log('correct old room login:', roomCode);
                }
            }
        }
        return;
    };
    return (_jsxs("div", { className: "relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none", children: [_jsx(PageHeader, { title: "Selecciona el modo" }), _jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-1 grid-rows-1 gap-10 py-10 px-10 flex justify-items-center ", style: {
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                    backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                    backgroundRepeat: "repeat",
                    backgroundBlendMode: "overlay",
                }, children: [_jsx("div", { className: "grid grid-cols-2 gap-4 h-[200px] w-[750px] items-center mt-3", children: modes.map((mode) => (_jsx("div", { className: `
                                relative w-full h-full overflow-hidden
                                rounded-[7rem] border-4 
                                flex items-center justify-center
                                ${activeMode === mode.id ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-400 text-gray-800 scale-90 z-0 grayscale'}
                                ${bouncyAnimation}
                            `, children: _jsx(Button, { type: "button", onClick: () => handleButtonClick(mode.id), className: `
                                    w-full h-full p-0 
                                    hover:bg-opacity-80 transition-all duration-200
                                    ${activeMode === mode.id ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-400 text-gray-800'}
                                `, children: _jsx(ModeContent, { mode: mode }) }) }, mode.id))) }), _jsx("div", { className: "flex justify-center mb-18", children: displayedImage && (_jsx("img", { src: displayedImage, alt: "Modo seleccionado", className: "w-[1000px] h-full" })) }), _jsxs("div", { className: "w-full flex flex-col items-center gap-6 mb-4", children: [activeMode === 'join' && (_jsx("div", { className: "animate-in slide-in-from-bottom-4 duration-500", children: _jsx(Input, { id: "room-code", ref: codeRef, placeholder: "123456789", value: roomCode, onChange: (e) => {
                                        setRoomCode(e.target.value);
                                        if (codeRef.current)
                                            codeRef.current.setCustomValidity("");
                                    }, className: "w-[200px] h-16 text-center text-[22px] font-bold border-[5px] \n                                border-[var(--color-bordes)] text-black select-text relative z-50" }) })), _jsx(Button, { type: "submit", variant: 'magnate', disabled: !activeMode, className: `
                            text-[var(--color-text)] text-[28px] uppercase font-bold w-[250px]
                            ${bouncyAnimation}
                            ${!activeMode ? 'bg-zinc-300 opacity-50' : 'bg-[var(--color-primary)] shadow-2xl'}
                        `, children: "Confirmar" })] })] })] }));
}
