import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const TradingOverlay = () => {
    const [allPlayers, setAllPlayers] = useState<any[]>([]); // Lista completa de la partida
    const [sender, setSender] = useState<any>(null); // Tú
    const [receiver, setReceiver] = useState<any>(null); // otro jugador
    
    const [isMinimised, setIsMinimised] = useState(false);
    const [selectingFor, setSelectingFor] = useState<'me' | 'them' | null>(null);
    
    const [myOffer, setMyOffer] = useState<{money: number, properties: any[]}>({ money: 0, properties: [] });
    const [theirOffer, setTheirOffer] = useState<{money: number, properties: any[]}>({ money: 0, properties: [] });
    
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

    useEffect(() => {
        const handleOpenTrade = (data: any) => {
            setAllPlayers(data.allPlayers);
            setSender(data.sender);
            setReceiver(null);
            setMyOffer({ money: 0, properties: [] });
            setTheirOffer({ money: 0, properties: [] });
        };
        
        const handleTileSelected = (tile: any) => {
            if (selectingFor === 'me') {
                setMyOffer(prev => ({ ...prev, properties: [...prev.properties, tile] }));
            } else {
                setTheirOffer(prev => ({ ...prev, properties: [...prev.properties, tile] }));
            }
            setIsMinimised(false);
            setSelectingFor(null);
        };

        EventBus.on('open-trade', handleOpenTrade);
        EventBus.on('tile-added-to-trade', handleTileSelected);
        return () => { EventBus.off('open-trade'); EventBus.off('tile-added-to-trade'); };
    }, [selectingFor]);

    if (!allPlayers.length || !sender) return null;

    // --- SELECCIÓN DE JUGADOR ---
    if (!receiver) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className="bg-[var(--color-background)] p-10 rounded-[40px] border border-gray-700 shadow-3xl w-[500px] text-center">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-[var(--color-text)] mb-2">¿Con quién negociamos?</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 text-balance">Seleccione un rival para proponerle un intercambio</p>
                    
                    <div className="flex flex-col gap-3 mb-8">
                        {allPlayers.filter(p => p.id !== sender.id).map(player => (
                            <Button key={player.id}
                                onClick={() => setReceiver(player)}
                                className={`flex items-center justify-between p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--color-primary)] 
                                            hover:bg-white/10 transition-all group ${bouncyAnimation}`}>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: player.color }} />
                                    <span className="font-black uppercase text-lg text-white group-hover:text-[var(--color-primary)]">{player.name}</span>
                                </div>
                                <span className="text-gray-600 font-bold text-md uppercase tracking-tighter">Seleccionar</span>
                            </Button>
                        ))}
                    </div>

                    <Button onClick={() => setSender(null)} 
                            className="text-gray-500 hover:text-red-400 text-[14px] font-black uppercase tracking-widest transition-colors">
                        Cancelar
                    </Button>
                </div>
            </div>
        );
    }

    // ---  NEGOCIACIÓN ---
    const startSelection = (who: 'me' | 'them') => {
        setSelectingFor(who);
        setIsMinimised(true);
        EventBus.emit('start-selection-mode', { ownerId: who === 'me' ? sender.id : receiver.id });
    };

    return (
        <>
            {/* Overlay Principal */}
            <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm transition-all 
                            duration-500 ${isMinimised ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}>
                <div className="bg-[var(--color-background)] w-[1000px] rounded-[48px] border border-gray-700 shadow-3xl overflow-hidden flex flex-col">
                    
                    <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white uppercase">Mesa de Negocios</h2>
                        </div>
                        <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl border border-white/10">
                            <span className="text-gray-500 font-bold text-xs">TRATO CON:</span>
                            <span className="text-white font-black uppercase text-lg">{receiver.name}</span>
                            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: receiver.color, color: receiver.color }} />
                        </div>
                    </div>

                    <div className="flex flex-row h-[500px]">
                        <TradeZone 
                            title="Tus Activos" 
                            offer={myOffer} 
                            onAdd={() => startSelection('me')} 
                            onMoneyChange={(v: any) => setMyOffer({...myOffer, money: v})} 
                        />
                        <TradeZone 
                            title={`Activos de ${receiver.name}`} 
                            offer={theirOffer} 
                            onAdd={() => startSelection('them')} 
                            onMoneyChange={(v: any) => setTheirOffer({...theirOffer, money: v})}
                        />
                    </div>

                    <div className="p-8 bg-white/5 border-t border-white/10 flex justify-between items-center">
                        <Button onClick={() => setReceiver(null)} 
                                className="text-gray-500 hover:text-red-400 font-black uppercase text-[14px]">Volver atrás
                        </Button>
                        <Button className={`px-10 py-8 bg-[var(--color-primary)] text-[var(--color-text)] 
                                            font-black uppercase text-[20px] rounded-full shadow-xl ${bouncyAnimation}`}>
                            Enviar Propuesta
                        </Button>
                    </div>
                </div>
            </div>

            {isMinimised && (
                <div className="fixed top-8 right-8 z-[10000] flex flex-col items-end gap-3 transition-all animate-in fade-in slide-in-from-right-8">
                    
                    <div className="bg-white pl-6 pr-4 py-3 rounded-full shadow-2xl flex items-center gap-4 border-b-4 border-r-4 border-[var(--color-background)]">
                        <div className="flex flex-col items-end">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                Modo Selección
                            </span>
                            <span className="text-black font-black uppercase text-sm italic leading-none">
                                {selectingFor === 'me' ? 'Tus propiedades' : `Propiedades de ${receiver.name}`}
                            </span>
                        </div>
                    
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </div>
                    </div>

                    
                    <Button onClick={() => { setIsMinimised(false); setSelectingFor(null); EventBus.emit('stop-selection-mode');}}
                        className={`bg-black/80 hover:bg-black text-white text-[10px] font-black uppercase px-4 py-2 rounded-full 
                                    border border-white/10 backdrop-blur-md transition-all active:scale-95 ${bouncyAnimation}`}>
                        Cancelar Selección
                    </Button>
                </div>
            )}
        </>
    );
};

const TradeZone = ({ title, offer, onAdd, onMoneyChange }: any) => {
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-[1.02] active:scale-[0.98]";

    return (
        <div className="flex-1 p-8 flex flex-col gap-6 bg-white/[0.02] first:border-r first:border-white/5">
            <div className="flex items-center justify-between">
                <div className='flex flex-col gap-1'>
                    <span className={`text-[10px] font-black tracking-[0.2em] text-[var(--color-primary)] uppercase opacity-80`}>
                        Sección de
                    </span>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
                        {title}
                    </h3>
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase bg-white/5 px-2 py-1 rounded-md">
                    {offer.properties.length} Propiedades
                </span>
            </div>
            {/* dinero */}
            <div className="group relative">
                <Input 
                    type="number" 
                    placeholder="0" 
                    className="bg-black/40 border-gray-800 hover:border-gray-700 focus:border-[var(--color-primary)] 
                               py-10 pl-14 pr-6 text-4xl font-black text-white rounded-[24px] transition-all
                               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    onChange={(e) => onMoneyChange(parseInt(e.target.value) || 0)} 
                />
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                    <span className="text-3xl font-black text-[var(--color-primary)] group-focus-within:scale-110 transition-transform">€</span>
                </div>
            </div>

            {/* Propiedades */}
            <div onClick={onAdd}  
                className={`flex-1 border-2 border-dashed border-gray-800/50 rounded-[32px] bg-black/20 
                            p-4 cursor-pointer hover:border-[var(--color-primary)]/50 hover:bg-white/[0.03] 
                            transition-all flex flex-col relative overflow-hidden group/zone ${bouncyAnimation}`}>
                {offer.properties.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl 
                            group-hover/zone:bg-[var(--color-primary)] group-hover/zone:text-black transition-colors">
                            +
                        </div>
                        <div className="text-center">
                            <p className="text-[11px] font-black uppercase tracking-tighter text-white">Añadir Activos</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Toca el tablero</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                        {offer.properties.map((p: any, i: number) => (
                            <div 
                                key={i} 
                                className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 animate-in fade-in slide-in-from-right-4 duration-300"
                                style={{ borderLeft: `4px solid ${p.color}` }}>
                                <span className="text-[11px] font-black text-white uppercase truncate ml-2">
                                    {p.name}
                                </span>
                                <button className="text-gray-600 hover:text-red-400 p-1 transition-colors text-xs font-bold">
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};