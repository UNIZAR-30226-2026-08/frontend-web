import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { EventBus } from '@/EventBus';


const TradeHeader = ({ player, isSender, isMe }: { player: any, isSender: boolean, isMe?: boolean }) => (
    <div className={`py-6 pb-2 flex flex-col ${isSender ? 'items-start' : 'items-end'}`}>
        <div className={`flex items-center gap-4 ${isSender ? 'flex-row' : 'flex-row-reverse'}`}>
            <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white shrink-0" 
                style={{ backgroundColor: player?.color, color: '#fff' }}>
            </div>
            <div className={`flex flex-col ${isSender ? 'items-start text-left' : 'items-end text-right'}`}>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 leading-[0.9]">
                    {isMe ? 'Tú' : player?.name}
                </h3>
                <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase opacity-90 mt-1">
                    {isSender ? 'Lo que entregas' : 'Lo que recibes'}
                </span>
            </div>
        </div>
    </div>
);

const SummaryZone = ({ money, properties, isPositive }: any) => {
        const validProperties = properties?.filter((p: any) => p && p.name && p.name.trim() !== "") || [];

        return (
            <div className="flex flex-col gap-5 py-4 w-full">
                {/* Parte del dinero */}
                <div className="bg-white border-2 border-slate-200 rounded-[30px] py-6 px-7 flex justify-between items-center shadow-sm">
                    <span className={`text-3xl font-black ${isPositive ? 'text-[var(--color-primary)]' : 'text-red-500'}`}>
                        {money}
                    </span>
                    <span className="text-2xl font-black text-slate-300">M</span>
                </div>

                {/* Parte de las propiedades */}
                <div className="h-[250px] border-2 border-slate-200 rounded-[32px] p-4 bg-white/50 flex flex-col gap-2 overflow-y-auto">
                    {validProperties.length > 0 ? (
                        validProperties.map((prop: any, i: number) => (
                            <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm w-full animate-in fade-in slide-in-from-right-2 duration-200">
                                <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ backgroundColor: prop.color || '#cbd5e1'}} />
                                <p className="text-[11px] font-black uppercase text-slate-700 leading-tight break-words">
                                    {prop.name}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 italic uppercase text-[16px] text-slate-800">
                            <span>Sin propiedades</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

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
            console.log("Entrando en request de tradeo", data);
            setProposal(data);
            setIsOpen(true);
        };

        EventBus.on('show-trade-request', handleShow);
        return () => { 
            EventBus.off('show-trade-request', handleShow); 
        };
    }, []);

    const handleAnswer = (accepted: boolean) => {
        if (!proposal) return;
        console.log("en trade request, la propuesta ha sido:", accepted);
        
        EventBus.emit('action-trade-answer', {
            accept: accepted,
            player: proposal.offeringPlayer.id
        });

        setIsOpen(false);
        setProposal(null);
    };

    if (!isOpen || !proposal) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-black/10 backdrop-blur-sm flex items-center justify-center p-6 select-none animate-in fade-in duration-300">
            <div className="rounded-[60px] w-full max-w-2xl p-1 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-4 border-white overflow-hidden" style={stripedBackgroundStyle}>
                
                <div className="flex flex-col">
                    {/* Header Principal */}
                    <div className="text-center pt-10">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">Propuesta de Trato</h2>
                        <div className="h-1 w-48 bg-gray-200 mx-auto mt-2 rounded-full" />
                    </div>

                    <div className="flex justify-between px-12 gap-12 items-start">
                        <div className="flex-1 flex flex-col">
                            <TradeHeader player={proposal.askedPlayer} isSender={true} isMe={true} />
                            <SummaryZone 
                                money={proposal.askedMoney} 
                                properties={proposal.askedProperties || []} 
                                isPositive={false}
                            />

                        </div>

                        <div className="flex-1 flex flex-col">
                            <TradeHeader player={proposal.offeringPlayer} isSender={false}  isMe={false} />
                            <SummaryZone 
                                money={proposal.offeredMoney} 
                                properties={proposal.offeredProperties || []} 
                                isPositive={true}
                            />
                        </div>
                    </div>

                    <div className="p-10 flex gap-4 justify-center">
                        <Button onClick={() => handleAnswer(false)}
								sound="trade_turned_down"
                                className={`w-[160px] h-[60px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[16px] 
                                        rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`}>
                                Rechazar
                        </Button>
                        <Button onClick={() => handleAnswer(true)}
							sound="trade_accepted"
                            className={`w-[160px] h-[60px] bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase text-[16px] 
                                            rounded-full ${bouncyAnimation}`}>
                                Aceptar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
