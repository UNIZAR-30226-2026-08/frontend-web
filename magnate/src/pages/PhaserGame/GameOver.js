import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion'; // Para movimiento
import bonusConfig from '../../../public/data/finalCategories.json';
import { GameLogicManager } from '@/phaser/managers/GameLogicManager';
export function GameOver() {
    const [players, setPlayers] = useState([]);
    const [bonusSequence, setBonusSequence] = useState([]);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    const stripedBackgroundStyle = {
        backgroundImage: `
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
        const handleResults = (data) => {
            const model = GameLogicManager.getInstance().model;
            if (!model)
                return;
            const initialPlayers = model.orderedPlayers.map((id) => {
                const p = model.getPlayer(id);
                const currentBalance = p?.balance || 0;
                return {
                    id: String(id),
                    name: p?.name || `Jugador ${id}`,
                    color: p?.color ? `#${p.color.toString(16).padStart(6, '0')}` : "#222222",
                    currentPoints: currentBalance * 0.75,
                    baseBalance: currentBalance
                };
            });
            const sequence = Object.entries(data.bonuses || {}).map(([key, info]) => {
                const config = bonusConfig[key];
                return {
                    id: key,
                    label: config?.title || info.display_name,
                    description: config?.description || "",
                    amount: info.bonus_amount,
                    winners: info.winners.map(String)
                };
            });
            setPlayers(initialPlayers);
            setBonusSequence(sequence);
            setIsVisible(true);
            setTimeout(() => setStepIndex(0), 2000);
        };
        EventBus.on('show-final-results', handleResults);
        return () => { EventBus.off('show-final-results'); };
    }, []);
    useEffect(() => {
        if (stepIndex >= 0 && stepIndex < bonusSequence.length) {
            const currentBonus = bonusSequence[stepIndex];
            setPlayers(prev => prev.map(p => {
                if (currentBonus.winners.includes(p.id)) {
                    return { ...p, currentPoints: p.currentPoints + currentBonus.amount };
                }
                return p;
            }));
            const timer = setTimeout(() => setStepIndex(prev => prev + 1), 3000);
            return () => clearTimeout(timer);
        }
    }, [stepIndex, bonusSequence]);
    if (!isVisible)
        return null;
    const sortedPlayers = [...players].sort((a, b) => b.currentPoints - a.currentPoints);
    const maxPoints = Math.max(...players.map(p => p.currentPoints), 1) || 1000;
    const isFinished = stepIndex >= bonusSequence.length;
    return (_jsx("div", { className: "fixed inset-0 z-[1000] backdrop-blur-sm flex items-center justify-center p-6", children: _jsxs("div", { className: "rounded-[60px] w-full max-w-2xl p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-2 border-white", style: stripedBackgroundStyle, children: [_jsx("div", { className: "text-center mb-8 h-[120px] flex flex-col justify-center", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -20, opacity: 0 }, transition: { duration: 0.4 }, children: [_jsx("span", { className: "text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-1", children: !isFinished ? "Calculando puntuación..." : "Partida Finalizada" }), _jsx("h1", { className: "text-[38px] font-black italic uppercase text-slate-900 leading-tight", children: !isFinished ? bonusSequence[stepIndex]?.label : "Resultados Finales" }), !isFinished && bonusSequence[stepIndex]?.description && (_jsx("p", { className: "text-slate-500 font-medium text-[20px] mt-2", children: bonusSequence[stepIndex].description }))] }, stepIndex) }) }), _jsx("div", { className: "space-y-10 relative", children: _jsx(AnimatePresence, { children: players.length > 0 ? (sortedPlayers.map((player, index) => {
                            const safeMaxPoints = maxPoints <= 0 ? 1 : maxPoints;
                            const widthPercentage = (player.currentPoints / safeMaxPoints) * 100;
                            return (_jsxs(motion.div, { layout: true, className: "relative", transition: { type: "spring", stiffness: 200, damping: 50 }, children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "text-[22px] font-black text-slate-400", children: ["#", index + 1] }), _jsx("span", { className: "text-[22px] font-extrabold text-slate-800", children: player.name })] }), _jsxs("span", { className: "text-[22px] font-black tabular-nums text-slate-800", children: [_jsx(AnimatedCounter, { value: Math.floor(player.currentPoints) }), _jsx("small", { className: "text-[18px] text-slate-400", children: " M" })] })] }), _jsx("div", { className: "h-10 w-full bg-slate-300 rounded-full p-1.5 shadow-inner border-2 border-white/50", children: _jsx(motion.div, { className: "h-full rounded-full relative overflow-hidden", initial: { width: "0%" }, animate: { width: `${Math.max(widthPercentage, 2)}%` }, transition: { duration: 1, ease: "easeOut" }, style: { backgroundColor: player.color }, children: _jsx("div", { className: "absolute inset-0 bg-white/20 skew-x-[-20deg] translate-x-[-50%] animate-pulse" }) }) })] }, player.id));
                        })) : ( // por si algo no va bien sale esto
                        _jsx("div", { className: "flex justify-center items-center h-20 text-slate-400 italic", children: "Cargando estad\u00EDsticas..." })) }) }), _jsx("div", { className: "mt-12 flex justify-center", children: _jsx(Button, { onClick: () => {
                            EventBus.emit('handle-leave-game');
                            navigate('/home');
                        }, className: `bg-[var(--color-primary)] text-white px-7 py-7 rounded-full font-black uppercase text-[20px] ${bouncyAnimation}`, children: "Continuar" }) })] }) }));
}
function AnimatedCounter({ value }) {
    const [displayValue, setDisplayValue] = useState(value);
    useEffect(() => {
        const controls = { current: displayValue };
        const duration = 1000;
        const start = performance.now();
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(displayValue + (value - displayValue) * progress);
            setDisplayValue(current);
            if (progress < 1)
                requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value]);
    return _jsx(_Fragment, { children: displayValue });
}
