import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventBus } from '@/EventBus';
export const AuctionResults = () => {
    const [resultsData, setResultsData] = useState(null);
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
        const handleShowResults = (data) => {
            setResultsData(data);
        };
        EventBus.on('show-auction-overlay-results', handleShowResults);
        return () => {
            EventBus.off('show-auction-overlay-results', handleShowResults);
        };
    }, []);
    if (!resultsData)
        return null;
    const { property, winner, participants, finalCount, isTie } = resultsData;
    const losers = winner ? participants.filter((p) => p.id !== winner.id) : participants;
    const noBids = participants[0].bid === 0;
    const handleClose = () => {
        setResultsData(null);
        EventBus.emit('close-overlay');
    };
    return (_jsx("div", { className: "fixed inset-0 z-[10001] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300", children: _jsx("div", { className: "relative shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-[50px] overflow-hidden w-[550px] border border-gray-500", style: stripedBackgroundStyle, children: _jsxs("div", { className: "p-10 flex flex-col items-center", children: [_jsx("div", { className: "mb-6", children: _jsx("span", { className: "text-slate-500 text-[12px] font-black uppercase italic tracking-widest block", children: "Subasta Finalizada" }) }), _jsx("h2", { className: "text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-1 text-center", children: isTie || noBids ? "No hay ganador" : "¡Adjudicado!" }), _jsx("p", { className: "text-slate-800 font-black uppercase tracking-widest text-sm mb-10 mt-3 opacity-60", children: property?.name || 'Propiedad' }), winner && (_jsx("div", { className: "w-full mb-8 relative", children: _jsxs("div", { className: "bg-white border-2 border-slate-100 rounded-[32px] p-8 shadow-[0_15px_30px_rgba(0,0,0,0.05)] flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-4 h-4 rounded-full shadow-inner", style: { backgroundColor: winner.color } }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1", children: "Nuevo propietario" }), _jsx("p", { className: "text-3xl font-black text-slate-900 uppercase tracking-tight", children: winner.name })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1", children: "Inversi\u00F3n" }), _jsxs("p", { className: "text-5xl font-black text-slate-900 select-none", children: [finalCount, "M"] })] })] }) })), _jsxs("div", { className: "w-full max-h-[200px] overflow-y-auto space-y-2 mb-10 pr-2", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-3", children: "Otras pujas" }), losers.map((player) => (_jsxs("div", { className: "flex justify-between items-center px-6 py-4 bg-white/90 border border-slate-100 rounded-2xl", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-2 h-2 rounded-full", style: { backgroundColor: player.color } }), _jsx("span", { className: "font-bold text-slate-600 text-sm uppercase", children: player.name })] }), _jsxs("span", { className: "font-black text-slate-400", children: [player.bid, "M"] })] }, player.id)))] }), _jsx(Button, { onClick: handleClose, className: `w-[150px] h-[50px] text-xl font-black uppercase rounded-full 
                                    bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] shadow-xl ${bouncyAnimation}`, children: "Aceptar" })] }) }) }));
};
