import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { EventBus } from '@/EventBus';
export const PlayerHUD = ({ playerId, initialName, initialColor, initialBalance, isClickable = false, onClick }) => {
    const [balance, setBalance] = useState(initialBalance);
    const [properties, setProperties] = useState([]);
    const prevBalance = useRef(initialBalance);
    useEffect(() => {
        const handlePlayerUpdate = (data) => {
            if (data.id === playerId) {
                if (data.balance !== undefined && data.balance !== prevBalance.current) {
                    setBalance(data.balance);
                    prevBalance.current = data.balance;
                }
                if (data.properties !== undefined)
                    setProperties(data.properties);
            }
        };
        EventBus.on('player-updated', handlePlayerUpdate);
        return () => { EventBus.off('player-updated', handlePlayerUpdate); };
    }, [playerId]);
    const interactionClasses = isClickable
        ? "cursor-pointer hover:scale-110 active:scale-95 group-hover/list:opacity-50 hover:!opacity-100 z-10 hover:z-20"
        : "";
    return (_jsx("div", { className: `relative pointer-events-auto transition-all duration-300 ${interactionClasses}`, onClick: isClickable ? onClick : undefined, role: isClickable ? "button" : "presentation", children: _jsx("div", { style: {
                width: 'clamp(240px, 18vw, 320px)',
                background: '#ffffff',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 20px 50%)',
                padding: '4px',
                filter: 'drop-shadow(0px 6px 0px rgba(0,0,0,0.3))'
            }, children: _jsxs("div", { className: "flex flex-col text-white h-full w-full", style: {
                    background: `linear-gradient(135deg, ${initialColor} 50%, ${initialColor}dd 100%)`,
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 20px 50%)',
                    padding: '9px 11px 9px 39px'
                }, children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex flex-col min-w-0", children: [_jsx("span", { className: "text-[9px] uppercase opacity-70 font-bold tracking-widest leading-none mb-1", children: "Jugador" }), _jsx("h3", { className: "m-0 text-[16px] font-black uppercase italic tracking-tighter leading-none drop-shadow-sm", children: initialName })] }), _jsxs("div", { className: "bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-baseline gap-0.5 border border-white/10 shadow-inner", children: [_jsx("span", { className: "text-xl font-mono font-black tabular-nums tracking-tighter", children: balance.toLocaleString() }), _jsx("span", { className: "text-[12px] text-yellow-400 font-bold", children: "M" })] })] }), _jsxs("div", { className: "mt-3 pt-2 border-t border-white/10 flex items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-1.5", children: _jsxs("span", { className: "text-[10px] font-black uppercase tracking-wider opacity-90", children: [properties.length, " Propiedades"] }) }), _jsxs("span", { className: "text-[8px] opacity-40 font-mono", children: ["#", playerId.slice(-4)] })] })] }) }) }));
};
