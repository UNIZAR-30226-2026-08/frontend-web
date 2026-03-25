import { useState, useEffect, useRef } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';

const BONUS_STEPS = [
    { id: 'properties', label: 'Más casas construidas' },
    { id: 'services', label: 'Más casillas recorridas' },
    { id: 'cash', label: 'Liquidez' }
];

export function GameOverOverlay() {
    const [players, setPlayers] = useState<any[]>([]);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isVisible, setIsVisible] = useState(false);
    
    const [displayPoints, setDisplayPoints] = useState<Record<string, number>>({});

    // --- LÓGICA DEBUG ---
    useEffect(() => {
        const handleDebugKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'g') {
                const mockData = [
                    { id: '001', name: 'Juls', color: '#f94144', basePoints: 600, bonuses: { properties: 500, services: 200, cash: 300 } },
                    { id: '002', name: 'Nico', color: '#f9c74f', basePoints: 850, bonuses: { properties: 100, services: 400, cash: 150 } },
                    { id: '003', name: 'lucas', color: '#90be6d', basePoints: 400, bonuses: { properties: 800, services: 100, cash: 50 } },
                    { id: '004', name: 'ma', color: '#2c7da0', basePoints: 400, bonuses: { properties: 800, services: 100, cash: 50 } }
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
            const initialPoints: Record<string, number> = {};
            data.forEach(p => initialPoints[p.id] = p.basePoints);
            
            setPlayers(data.map(p => ({ ...p, currentPoints: p.basePoints })));
            setDisplayPoints(initialPoints);
            setIsVisible(true);
            
            setTimeout(() => setStepIndex(0), 9000);
        };

        EventBus.on('show-final-results', handleResults);
        return () => { EventBus.off('show-final-results'); };
    }, []);

    // // --- SECUENCIA DE BONUS ---
    useEffect(() => {
        if (stepIndex >= 0 && stepIndex < BONUS_STEPS.length) {
            const bonusId = BONUS_STEPS[stepIndex].id;

            setPlayers(prev => prev.map(p => ({
                ...p,
                currentPoints: p.currentPoints + (p.bonuses[bonusId] || 0)
            })));

            const timer = setTimeout(() => setStepIndex(prev => prev + 1), 4000);
            return () => clearTimeout(timer);
        }
    }, [stepIndex]);

    // // --- ANIMACIÓN DE NÚMEROS (Interpolación simple) ---
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setDisplayPoints(prev => {
    //             const next = { ...prev };
    //             let needsUpdate = false;

    //             players.forEach(p => {
    //                 if (next[p.id] < p.currentPoints) {
    //                     // Sube los puntos de 5 en 5 (o ajusta la velocidad aquí)
    //                     const diff = p.currentPoints - next[p.id];
    //                     next[p.id] += Math.ceil(diff / 10); 
    //                     needsUpdate = true;
    //                 }
    //             });

    //             return needsUpdate ? next : prev;
    //         });
    //     }, 30); // 30ms para una animación fluida
    //     return () => clearInterval(interval);
    // }, [players]);

    if (!isVisible) return null;

    const sortedPlayers = [...players].sort((a, b) => b.currentPoints - a.currentPoints);
    const maxPoints = Math.max(...players.map(p => p.currentPoints), 1000);

    return (
        <div className="fixed inset-0 z-[1000] backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] w-full max-w-2xl p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-8 border-white">
                
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

                <div className="space-y-10">
                    {sortedPlayers.map((player, index) => {
                        const widthPercentage = (player.currentPoints / maxPoints) * 100;
                        const pointsToShow = displayPoints[player.id] || player.basePoints;
                        
                        return (
                            <div key={player.id} className="relative">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[22px] font-black text-slate-300">#{index + 1}</span>
                                        <span className="text-[22px] font-extrabold text-slate-800">{player.name}</span>
                                    </div>
                                    <span className="text-[22px] font-black tabular-nums text-slate-900">
                                        {pointsToShow} <small className="text-[16px] text-slate-400">M</small>
                                    </span>
                                </div>
                                
                                <div className="h-10 w-full bg-slate-100 rounded-2xl p-1.5 shadow-inner border-2 border-slate-50">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                        style={{ 
                                            width: `${widthPercentage}%`, 
                                            backgroundColor: player.color }}>
                                        <div className="absolute inset-0 bg-white/20 skew-x-[-20deg] translate-x-[-50%] animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                
                <div className="mt-12 flex justify-center">
                    <Button 
                        onClick={() => window.location.reload()}
                        className="bg-[var(--color-primary)] text-white px-8 py-8 rounded-full 
                            font-black uppercase text-[20px]">
                        Continuar
                    </Button>
                </div>
                
            </div>
        </div>
    );
}