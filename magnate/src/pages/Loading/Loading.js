import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import ShaderLoading from '@/components/ui/shader';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { EventBus } from '@/EventBus';
export function Loading({ onBack }) {
    const navigate = useNavigate();
    const handleExitQueue = () => {
        console.log("Cancelando cola pública: clic en botón atrás");
        EventBus.emit('handle-public-cancel');
        if (onBack) {
            onBack();
        }
        else {
            navigate(-1);
        }
    };
    useEffect(() => {
        EventBus.emit('handle-public-connect');
        const handleEnterGame = () => {
            navigate('/phaser-game');
        };
        EventBus.on('you-may-now-enter-the-game', handleEnterGame);
        return () => {
            EventBus.off('you-may-now-enter-the-game', handleEnterGame);
        };
    }, [navigate]);
    return (_jsxs("div", { className: 'flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat relative', style: { backgroundImage: "url('/images/bg_city.jpg')" }, children: [_jsx("div", { className: 'absolute inset-0 bg-black/60 backdrop-blur-[8px]' }), _jsx("div", { className: "absolute top-8 left-8 z-50", children: _jsx(Button, { variant: "ghost", onClick: handleExitQueue, "aria-label": "Go back", sound: "button_back", className: "z-60 bg-[var(--color-black)] hover:bg-[var(--color-black)] rounded-full flex items-center justify-center ml-2 w-20 h-20 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] transform-gpu transition-transform duration-200 ease-in-out hover:scale-110", children: _jsx("img", { src: "/icons/back-arrow1.svg", className: "w-12 h-12 sm:w-16 sm:h-16 block select-none", alt: "Back" }) }) }), _jsxs("div", { className: 'relative z-10 flex flex-col items-center justify-center min-h-screen', children: [_jsx("img", { src: "images/logo.png", alt: "Logo", className: "w-full max-w-2xl h-auto" }), _jsx("div", { className: "flex flex-row text-white/80 text-2xl font-black uppercase italic tracking-[0.2em] mt-8 bg-black/20 \n                                px-6 py-2 rounded-full backdrop-blur-sm border border-white/10", children: _jsx(ShaderLoading, { text: "ESPERANDO JUGADORES...", size: 22, jump: 6, color: "var(--color-text)", delayOffset: 0 }) })] })] }));
}
