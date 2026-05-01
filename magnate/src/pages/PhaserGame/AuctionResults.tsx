import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventBus } from '@/EventBus';


export const AuctionResults = () => { 
    const [resultsData, setResultsData] = useState<any>(null);

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
        const handleShowResults = (data: any) => {
            setResultsData(data);
        };

        EventBus.on('show-auction-overlay-results', handleShowResults);
        return () => {
            EventBus.off('show-auction-overlay-results', handleShowResults);
        };
    }, []);

    if (!resultsData) return null;

    const { property, winner, participants, finalCount, isTie } = resultsData;
    const losers = winner ? participants.filter((p: any) => p.id !== winner.id) : participants;
    const noBids = participants[0].bid === 0;

    const handleClose = () => {
        setResultsData(null);
        EventBus.emit('close-overlay');
    };

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-[50px] overflow-hidden w-[550px] border border-gray-500"
                style={stripedBackgroundStyle}>                
                
                <div className="p-10 flex flex-col items-center">
                    <div className="mb-6">
                        <span className="text-slate-500 text-[12px] font-black uppercase italic tracking-widest block">
                            Subasta Finalizada
                        </span>
                    </div>
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-1 text-center">
                        {isTie || noBids ? "No hay ganador" : "¡Adjudicado!"}
                    </h2>
                    <p className="text-slate-800 font-black uppercase tracking-widest text-sm mb-10 mt-3 opacity-60">
                        {property?.name || 'Propiedad'}
                    </p>

                    {winner && (
                        <div className="w-full mb-8 relative">
                            <div className="bg-white border-2 border-slate-100 rounded-[32px] p-8 shadow-[0_15px_30px_rgba(0,0,0,0.05)] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: winner.color }} />
                                    <div>
                                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Nuevo propietario</p>
                                        <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">{winner.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Inversión</p>
                                    <p className="text-5xl font-black text-slate-900 select-none">{finalCount}M</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="w-full max-h-[200px] overflow-y-auto space-y-2 mb-10 pr-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-3">Otras pujas</p>
                        {losers.map((player : any) => (
                            <div key={player.id} className="flex justify-between items-center px-6 py-4 bg-white/90 border border-slate-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: player.color }} />
                                    <span className="font-bold text-slate-600 text-sm uppercase">{player.name}</span>
                                </div>
                                <span className="font-black text-slate-400">{player.bid}M</span>
                            </div>
                        ))}
                    </div>

                    <Button 
                        onClick={handleClose}
                        className={`w-[150px] h-[50px] text-xl font-black uppercase rounded-full 
                                    bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] shadow-xl ${bouncyAnimation}`}>
                        Aceptar
                    </Button>
                </div>
            </div>
        </div>
    );
};