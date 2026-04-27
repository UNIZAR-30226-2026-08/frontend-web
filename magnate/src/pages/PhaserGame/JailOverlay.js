import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';
export const JailOverlay = () => {
    const [propData, setpropData] = useState(null);
    const [hasRolled, setHasRolled] = useState(false);
    const [decisionData, setDecisionData] = useState(null);
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
        const handleOpen = (data) => {
            setpropData(data);
            setDecisionData(null);
            setHasRolled(false);
            EventBus.emit('dark-mode', true);
        };
        const handleDecision = (data) => {
            setDecisionData(data);
        };
        EventBus.on('open-jail-overlay', handleOpen);
        EventBus.on('show-jail-decision-popup', handleDecision);
        return () => {
            EventBus.off('open-jail-overlay', handleOpen);
            EventBus.off('show-jail-decision-popup', handleDecision);
        };
    }, []);
    if (!propData && !decisionData)
        return null;
    const confirmDecision = () => {
        if (!decisionData)
            return;
        if (decisionData.mode === 'pay') {
            EventBus.emit('execute-jail-bail-payment', { amount: 50 });
            EventBus.emit('execute-in-jail-travel', { targetId: decisionData.tileId });
        }
        close();
        EventBus.emit('clear-dice');
    };
    const reOpenSelection = () => {
        setDecisionData(null);
        EventBus.emit('dark-mode', true);
        EventBus.emit('jail-re-enable-selection');
    };
    const close = () => {
        setpropData(null);
        setDecisionData(null);
        EventBus.emit('dark-mode', false);
        EventBus.emit('close-overlay');
    };
    console.log("turno; ", decisionData?.turnCount);
    return (_jsxs("div", { className: "fixed inset-0 z-[99999] flex items-center justify-center bg-black/10 backdrop-blur-sm p-6 animate-in fade-in duration-300", children: [decisionData && (_jsxs("div", { className: "w-full max-w-sm rounded-[40px] p-10 flex flex-col items-center gap-6 border-2 border-slate-400 animate-in zoom-in-95", style: stripedBackgroundStyle, children: [_jsx("h3", { className: "text-2xl font-black uppercase italic text-slate-800 text-center", children: decisionData.mode === 'stay' ? '¿Quedarse?' : '¿Avanzar?' }), _jsx("p", { className: "text-slate-500 font-bold text-center leading-tight", children: decisionData.mode === 'stay'
                            ? "Permanecerás en Secretaría y pasarás el turno."
                            : `Pagarás 50M para ir a ${decisionData.tileName}.` }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(Button, { onClick: confirmDecision, className: `text-[14px] h-12 bg-[var(--color-primary)] text-white rounded-full font-black uppercase ${bouncyAnimation}`, children: "Confirmar" }), decisionData.turnCount <= 3 && (_jsx(Button, { onClick: reOpenSelection, className: `h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[14px] rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`, children: "Elegir otra casilla" }))] })] })), propData && !decisionData && (_jsxs("div", { className: "w-full max-w-sm rounded-[50px] border-4 border-white overflow-hidden bg-cover shadow-2xl", style: stripedBackgroundStyle, children: [_jsx("div", { className: "pt-10 text-center", children: _jsx("h2", { className: "text-3xl font-black italic uppercase text-slate-800 tracking-tighter", children: propData?.isPrisoner ? 'Secretaría' : 'Solo Visitas' }) }), _jsx("div", { className: "p-10 flex flex-col items-center gap-6", children: !propData?.isPrisoner ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-slate-500 font-bold text-center", children: "Est\u00E1s de visita. No tienes deudas pendientes." }), _jsx(Button, { onClick: close, className: `h-12 px-10 bg-[var(--color-primary)] text-white rounded-full font-black uppercase text-lg ${bouncyAnimation}`, children: "Continuar" })] })) : (_jsxs("div", { className: "w-full space-y-4", children: [_jsxs("div", { className: "bg-white/60 p-4 rounded-3xl border border-slate-200 text-center", children: [_jsx("p", { className: "text-[10px] font-black uppercase text-slate-400 tracking-widest", children: "Condena en curso" }), _jsx("p", { className: "text-sm font-bold text-slate-700", children: propData.turnCount >= 3 ? "¡Último turno! Salida obligatoria." : `Turno ${propData.turnCount} de 3` })] }), _jsx("div", { className: "flex flex-col gap-3 w-full items-center", children: _jsx(Button, { disabled: hasRolled, onClick: () => {
                                            setHasRolled(true);
                                            EventBus.emit('start-jail-roll-sequence');
                                            setpropData(null);
                                        }, className: `w-38 h-10 bg-[var(--color-primary)] text-white rounded-full font-black uppercase text-[18px] ${bouncyAnimation}`, children: "Tirar dados" }) })] })) })] }))] }));
};
