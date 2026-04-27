import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { PropertyCardContent } from '@/components/layout/PropertyLayout';
import { ServiceCardContent } from '@/components/layout/ServiceLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export const AuctionOverlay = () => {
    //const { playSound } = useAudio();
    const [auctionData, setAuctionData] = useState(null); // Datos de la subasta (pujas, propiedad)
    const [myBalance, setMyBalance] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15); // Cuenta atrás visual
    const [phase, setPhase] = useState(""); // Fase actual del juego
    const [manualAmount, setManualAmount] = useState(''); // Lo que el usuario escribe en el input
    const bidRef = useRef(0);
    const hasSubmittedRef = useRef(false);
    const myId = useRef(localStorage.getItem('myId') || "");
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
    useEffect(() => {
        bidRef.current = currentBid;
    }, [currentBid]);
    useEffect(() => {
        // fase en la que estamos
        const handleAuctionData = (data) => {
            console.log("INICIO subasta", data);
            setAuctionData(data);
            setTimeLeft(15);
            setCurrentBid(0);
            setPhase(data.phase);
            setMyBalance(data.myBalance || 0);
            hasSubmittedRef.current = false; // Resetear para nueva subasta
        };
        EventBus.on('show-auction-overlay', handleAuctionData);
        return () => {
            EventBus.off('show-auction-overlay', handleAuctionData);
        };
    }, []);
    useEffect(() => {
        // Bloqueo: si no hay subasta, no hacemos nada
        if (!auctionData || timeLeft < 0)
            return;
        if (timeLeft <= 1 && auctionData) {
            console.log("Enviando puja final:", bidRef.current);
            setAuctionData(null);
            sendFinalBid();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, auctionData, phase]);
    // --- funciones subasta ---
    // Maneja los botones de incremento
    const handleBid = (amount) => {
        setCurrentBid(prev => {
            const next = prev + amount;
            // Bloqueo: si la nueva puja supera el balance, nos quedamos en el balance máximo
            return next <= myBalance ? next : myBalance;
        });
    };
    // Maneja la puja escrita manualmente en el Input
    const handleManualSubmit = (e) => {
        e.preventDefault();
        const value = parseInt(manualAmount);
        if (!isNaN(value) && value > 0) {
            const finalValue = value > myBalance ? myBalance : value;
            setCurrentBid(finalValue);
            setManualAmount('');
        }
    };
    const sendFinalBid = () => {
        if (hasSubmittedRef.current)
            return;
        hasSubmittedRef.current = true;
        EventBus.emit('action-bid', {
            money: bidRef.current
        });
    };
    // no pujar por menos de lo que hay
    const isManualBidInvalid = !manualAmount || parseInt(manualAmount) <= 0 || parseInt(manualAmount) > myBalance;
    if (!auctionData)
        return null;
    const isSpecial = auctionData.special;
    // Primera pantalla de subasta
    return (_jsx("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center bg-black/10 backdrop-blur-sm", children: _jsxs("div", { className: "flex flex-row items-center gap-12 p-10 rounded-[50px] border border-gray-500 shadow-[0_30px_60px_rgba(0,0,0,0.2)]", style: stripedBackgroundStyle, children: [_jsx("div", { className: "rotate-[-4deg]", children: _jsx(GameCard, { isFlipped: true, front: isSpecial ? (_jsx(ServiceCardContent, { data: auctionData.property })) : (_jsx(PropertyCardContent, { data: auctionData.property })), back: _jsx("div", {}) }) }), _jsxs("div", { className: "flex flex-col items-center text-[var(--color-background)] w-[400px]", children: [_jsx("h2", { className: "text-[40px] font-black italic uppercase tracking-tighter mb-2 leading-none", children: "Subasta a ciegas" }), _jsx("h2", { className: 'text-[14px] leading-tight text-gray-400 font-bold uppercase italic px-2 mb-4', children: "\u00BFCu\u00E1nto est\u00E1s dispuesto a pagar?" }), _jsx("div", { className: `flex items-center justify-center w-16 h-16 rounded-full border-4 border-[var(--color-primary)] mb-6  
                            ${timeLeft <= 5 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-[var(--color-primary)]'}`, children: _jsx("span", { className: `
                                text-2xl font-bold transition-colors duration-300
                                ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-[var(--color-background)]'} `, children: timeLeft }) }), _jsxs("div", { className: "bg-white/5 w-full rounded-2xl p-6 border border-white/10 mb-6 text-center", children: [_jsx("p", { className: "text-gray-400 uppercase text-[12px] font-bold tracking-[0.2em] mb-1", children: "Puja Actual" }), _jsxs("p", { className: "text-6xl font-black text-[var(--color-primary)] leading-none", children: [currentBid, "M"] })] }), _jsx("form", { onSubmit: handleManualSubmit, className: "w-full mb-4", children: _jsxs("div", { className: "relative flex items-center", children: [_jsx(Input, { value: manualAmount, onChange: (e) => setManualAmount(e.target.value), placeholder: `Mín. ${currentBid + 1}`, className: "w-full bg-white border-2 border-slate-400 rounded-2xl py-8 px-7 text-xl font-bold text-slate-900 outline-none \n                                focus:border-slate-700 transition-all placeholder:text-slate-400 shadow-sm" }), _jsx(Button, { type: "submit", disabled: isManualBidInvalid, className: `absolute right-3 px-6 py-3 rounded-xl font-black uppercase text-sm transition-all ${bouncyAnimation}
                                    ${isManualBidInvalid
                                            ? 'bg-slate-250 text-slate-400 cursor-not-allowed'
                                            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] shadow-lg'}`, children: "Pujar" })] }) }), _jsx("div", { className: "grid grid-cols-2 gap-4 w-full", children: [10, 50].map(amount => (_jsxs(Button, { onClick: () => handleBid(amount), className: "py-7 bg-white hover:bg-slate-50 border-2 border-slate-400 rounded-2xl \n                                            font-black text-slate-500 text-lg transition-all active:scale-95 shadow-sm", children: ["+", amount, "M"] }, amount))) })] })] }) }));
};
