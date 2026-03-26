import { useState, useEffect } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion'; // Para movimiento

const BONUS_STEPS = [ // TODO: vendrá del backend o en json
    { id: 'properties', label: 'Más casas construidas' },
    { id: 'tiles', label: 'Más casillas recorridas' },
    { id: 'cash', label: 'Más alquileres pagados' }
];

export function GameOver() {
    const [players, setPlayers] = useState<any[]>([]);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isVisible, setIsVisible] = useState(false);

    // --- LÓGICA DEBUG ---
    useEffect(() => {
        const handleDebugKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'g') {
                const mockData = [ // TODO: vendrá del backend
                    { id: '001', name: 'Juls', color: '#f94144', basePoints: 600, bonuses: { properties: 400, tiles: 200, cash: 300 } },
                    { id: '002', name: 'Nico', color: '#f9c74f', basePoints: 800, bonuses: { properties: 100, tiles: 400, cash: 100 } },
                    { id: '003', name: 'lucas', color: '#90be6d', basePoints: 400, bonuses: { properties: 750, tiles: 100, cash: 50 } },
                    { id: '004', name: 'ma', color: '#2c7da0', basePoints: 400, bonuses: { properties: 100, tiles: 100, cash: 50 } }
                ];
                EventBus.emit('show-final-results', mockData);
            }
        };
        window.addEventListener('keydown', handleDebugKey);
        return () => window.removeEventListener('keydown', handleDebugKey);
    }, []);

    // --- RECIBIR DATOS ---
    useEffect(() => {
        const handleResults = (data: any[]) => {
            setPlayers(data.map(p => ({ ...p, currentPoints: p.basePoints })));
            setIsVisible(true);
            setTimeout(() => setStepIndex(0), 2500); 
        };

        EventBus.on('show-final-results', handleResults);
        return () => { EventBus.off('show-final-results'); };
    }, []);

    // --- SECUENCIA DE BONUS ---
    useEffect(() => {
        if (stepIndex >= 0 && stepIndex < BONUS_STEPS.length) {
            const bonusId = BONUS_STEPS[stepIndex].id;

            setPlayers(prev => prev.map(p => ({
                ...p,
                currentPoints: p.currentPoints + (p.bonuses[bonusId] || 0)
            })));

            const timer = setTimeout(() => setStepIndex(prev => prev + 1), 3000);
            return () => clearTimeout(timer);
        }
    }, [stepIndex]);

    if (!isVisible) return null;

    const sortedPlayers = [...players].sort((a, b) => b.currentPoints - a.currentPoints);
    const maxPoints = Math.max(...players.map(p => p.currentPoints), 1000);
    
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

    return (
        <div className="fixed inset-0 z-[1000] backdrop-blur-sm flex items-center justify-center p-6" >
            <div className="rounded-[60px] w-full max-w-2xl p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-2 border-white"
                style = {stripedBackgroundStyle}>
                
                <div className="text-center mb-4">
                    <span className="text-[14px] font-bold uppercase tracking-widest text-slate-400">
                        {stepIndex < BONUS_STEPS.length ? "Calculando puntuación..." : "Partida Finalizada"}
                    </span>
                    <h1 className="text-[35px] font-black italic uppercase text-slate-900 mt-2">
                        {stepIndex >= 0 && stepIndex < BONUS_STEPS.length 
                            ? BONUS_STEPS[stepIndex].label 
                            : "Resultados"}
                    </h1>
                </div>

                <div className="space-y-10 relative">
                    <AnimatePresence>
                        {sortedPlayers.map((player, index) => {
                            const widthPercentage = (player.currentPoints / maxPoints) * 100;
                            
                            return (
                                <motion.div key={player.id} className="relative" layout 
                                    transition={{ type: "spring", stiffness: 200, damping: 50 }}>

                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[22px] font-black text-slate-400">#{index + 1}</span>
                                            <span className="text-[22px] font-extrabold text-slate-800">{player.name}</span>
                                        </div>
                                        <span className="text-[22px] font-black tabular-nums text-slate-800">
                                            <AnimatedCounter value={player.currentPoints} />
                                            <small className="text-[18px] text-slate-400"> M</small>
                                        </span>
                                    </div>
                                    
                                    <div className="h-10 w-full bg-slate-300 rounded-full p-1.5 shadow-inner border-2 ">
                                        <motion.div 
                                            className="h-full rounded-full relative overflow-hidden"
                                            animate={{ width: `${widthPercentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            style={{ backgroundColor: player.color }}>
                                            <div className="absolute inset-0 bg-white/20 skew-x-[-20deg] translate-x-[-50%] animate-pulse" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                <div className="mt-12 flex justify-center">
                    <Button 
                        onClick={() => window.location.reload()}
                        className={`bg-[var(--color-primary)] text-white px-7 py-7 rounded-full font-black uppercase text-[20px] ${bouncyAnimation}`}>
                        Continuar
                    </Button>
                </div>
            </div>
        </div>
    );
}

function AnimatedCounter({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const controls = { current: displayValue };
        const duration = 1000; 
        const start = performance.now();

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(displayValue + (value - displayValue) * progress);
            
            setDisplayValue(current);

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <>{displayValue}</>;
}