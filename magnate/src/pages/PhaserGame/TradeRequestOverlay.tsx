import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { EventBus } from '@/EventBus';


const TradeHeader = ({ player, isSender }: { player: any, isSender: boolean }) => (
    <div className={`p-8 pb-4 flex flex-col gap-1 ${isSender ? 'items-start' : 'items-end text-right'}`}>
        <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase opacity-80">
            {isSender ? 'Te ofrece' : 'Te pide'}
        </span>
        <div className={`flex items-center gap-4 ${isSender ? 'flex-row' : 'flex-row-reverse'}`}>
            <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black italic shadow-lg border-2 border-white" 
                style={{ backgroundColor: player?.color || '#cbd5e1', color: '#fff' }}>
                {player?.name?.charAt(0)}
            </div>
            <div className="flex flex-col">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
                    {player?.name}
                </h3>
            </div>
        </div>
    </div>
);

export const TradeRequestOverlay = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [proposal, setProposal] = useState<any>(null);

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
        const handleShow = (data: any) => {
            setProposal(data);
            setIsOpen(true);
        };
        EventBus.on('show-trade-request', handleShow);
        
        return () => { EventBus.off('show-trade-request', handleShow); };
    }, []);

    if (!isOpen || !proposal) return null;

    const SummaryZone = ({ title, money, properties, isPositive }: any) => (
        <div className="flex flex-col gap-5 py-4 w-full">
            <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400">{title}</span>
                <div className="h-[1px] flex-1 bg-gray-100 ml-4"></div>
            </div>

            {/* Parte del dinero */}
            <div className="bg-white border-2 border-slate-200 rounded-[30px] py-6 px-7 flex justify-between items-center shadow-sm">
                <span className={`text-3xl font-black ${isPositive ? 'text-[var(--color-primary)]' : 'text-red-500'}`}>
                    {money}
                </span>
                <span className="text-2xl font-black text-slate-300">M</span>
            </div>

            {/* Parte de las propiedades */}
            <div className="min-h-[250px] border-2 border-slate-200 rounded-[32px] p-4 bg-white/50 flex flex-col gap-2 overflow-y-auto max-h-[300px]">
                {properties.length > 0 ? (
                    properties.map((prop: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prop.color || '#3b82f6' }} />
                            <p className="text-[11px] font-black uppercase text-slate-700 truncate">{prop.name || `Propiedad ${prop}`}</p>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full opacity-30 italic text-sm">Sin propiedades</div>
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[1000] bg-black/10 backdrop-blur-sm flex items-center justify-center p-6 select-none animate-in fade-in duration-300">
            <div className="rounded-[60px] w-full max-w-2xl p-1 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-4 border-white overflow-hidden" style={stripedBackgroundStyle}>
                
                <div className="flex flex-col">
                    {/* Header Principal */}
                    <div className="text-center pt-10">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">Propuesta de Trato</h2>
                        <div className="h-1 w-32 bg-[var(--color-primary)] mx-auto mt-2 rounded-full" />
                    </div>

                    <div className="flex justify-between px-10 gap-10">
                        <div className="flex-1">
                            <TradeHeader player={{offerPlayer: proposal.offeringPlayer, color: proposal.playerColor}} isSender={true} />
                            <SummaryZone 
                                title="Lo que recibes" 
                                money={proposal.offeredMoney} 
                                properties={proposal.offeredProperties || []} 
                                isPositive={true}
                            />
                        </div>

                        <div className="flex-1">
                            <TradeHeader player={{name: "Tú", color: "#64748b"}} isSender={false} />
                            <SummaryZone 
                                title="Lo que entregas" 
                                money={proposal.askedMoney} 
                                properties={proposal.askedProperties || []} 
                                isPositive={false}
                            />
                        </div>
                    </div>

                    <div className="p-10 flex gap-4 justify-center">
                        <Button onClick={() => setIsOpen(false)}
                                className={`w-[160px] h-[60px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[16px] 
                                        rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`}>
                                Rechazar
                        </Button>
                        <Button onClick={() => {
                                // TODO: actualizar propiedades
                                setIsOpen(false);
                            }}
                            className={`w-[160px] h-[60px] bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase text-[16px] 
                                            rounded-full ${bouncyAnimation}`}>
                                Aceptar Trato
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};