import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';

// --- HEADER ---
const TradeHeader = ({ player, isSender }: { player: any, isSender: boolean }) => (
    <div className={`p-8 pb-4 flex flex-col gap-1 ${isSender ? 'items-start' : 'items-end text-right'}`}>
        <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase opacity-80">
            {isSender ? 'Tus activos' : 'Sus activos'}
        </span>
        <div className={`flex items-center gap-4 ${isSender ? 'flex-row' : 'flex-row-reverse'}`}>
            <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black italic 
                        shadow-lg border-2 border-white" 
                style={{ 
                    backgroundColor: player?.color || '#cbd5e1', 
                    color: '#fff',
                    textShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}>
            </div>
            <div className="flex flex-col">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
                    {player?.name}
                </h3>
                <span className={`text-[10px] font-bold text-[var(--color-primary)] opacity-70 ${isSender ? 'text-left' : 'text-right'}`}>
                    {isSender ? 'ESTÁS OFRECIENDO' : 'ESTÁS PIDIENDO'}
                </span>
            </div>
        </div>
    </div>
);

export const TradingOverlay = () => {
	const { playSound } = useAudio();

    const [allPlayers, setAllPlayers] = useState<any[]>([]);
    const [sender, setSender] = useState<any>(null);
    const [receiver, setReceiver] = useState<any>(null);
    
    const [isMinimised, setIsMinimised] = useState(false);
    const [selectingFor, setSelectingFor] = useState<'me' | 'them' | null>(null);
    
    const [myOffer, setMyOffer] = useState<{money: number, properties: any[]}>({ money: 0, properties: [] });
    const [theirOffer, setTheirOffer] = useState<{money: number, properties: any[]}>({ money: 0, properties: [] });
    
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
    const [showProperties, setShowProperties] = useState(false);

    useEffect(() => {

        const handleOpenTrade = (data: any) => {
            setAllPlayers(data.allPlayers || []);
            setSender(data.sender);
            //setReceiver(data.receiver);
            // TODO: pruebas, vendrá de backend
            const propReceiver = {
                ...data.receiver,
                properties: data.receiver?.properties || [   
                    { id: "013", name: "Cafetería de matemáticas", color: "#3b82f6" }, 
                    { id: "023", name: "ITA", color: "#c73bf6" },
                    { id: "021", name: "I3A", color: "#f6f03b" },
                    { id: "031", name: "I3A", color: "#f6f03b" },
                    { id: "026", name: "Circe", color: "#f6f03b" },
                    { id: "037", name: "Circe", color: "#f88000" },]};
            setReceiver(propReceiver);
            setMyOffer({ money: 0, properties: [] }); 
            setTheirOffer({ money: 0, properties: propReceiver.properties });
            setTheirOffer({ money: 0, properties: [] });
            setIsMinimised(false);
            setShowProperties(false);
            EventBus.emit('set-hud-clickable', false);
        };
        
        const handleTileSelected = (tile: any) => {
           if (selectingFor === 'them') {
                setTheirOffer(prev => {
                    const isAlreadyAdded = prev.properties.some(p => p.id === tile.id);
                    if (isAlreadyAdded) return prev;
                    return { ...prev, properties: [...prev.properties, tile] };
                });
            } else if (selectingFor === 'me') {
                setMyOffer(prev => {
                    const isAlreadyAdded = prev.properties.some(p => p.id === tile.id);
                    if (isAlreadyAdded) return prev;
                    return { ...prev, properties: [...prev.properties, tile] };
                });
            }
			playSound('trade_shift');
            setIsMinimised(false);
            setSelectingFor(null);
            setShowProperties(true);
            EventBus.emit('dark-mode', true);
            
        };

        EventBus.on('open-trading-mode', handleOpenTrade);
        EventBus.on('tile-added-to-trade', handleTileSelected);
        
        return () => { 
            EventBus.off('open-trading-mode', handleOpenTrade); 
            EventBus.off('tile-added-to-trade', handleTileSelected); 
        };
    }, [selectingFor, playSound]);

    const closeTrading = () => {
        setSender(null);
        setReceiver(null);
        setIsMinimised(false);
        setSelectingFor(null);
        EventBus.emit('dark-mode', false);
        EventBus.emit('set-hud-clickable', false);
    };

    const startSelection = (who: 'me' | 'them') => {
        const player = who === 'me' ? sender : receiver;
        setSelectingFor(who);
        setIsMinimised(true);

        EventBus.emit('dark-mode', true);

        EventBus.emit('start-selection-mode', { 
            ownerId: player.id, 
            propertyIds: player.properties?.map((p: any) => p.id || p) || []
        });
    };

    const handleRemoveProperty = (propertyId: string, side: 'me' | 'them') => {
        if (side === 'me') {
            setMyOffer(prev => ({...prev, properties: prev.properties.filter(p => p.id !== propertyId) }));
        } else {
            setTheirOffer(prev => ({...prev, properties: prev.properties.filter(p => p.id !== propertyId) }));
        }
    };

    if (!sender || !receiver) return null;

    return (
        <>
           {isMinimised && (
                <div className="fixed z-[1001] pointer-events-auto animate-in slide-in-from-right-5 top-10 right-10">
                    <div className="px-8 py-8 rounded-[30px] backdrop-blur-md flex flex-col items-center gap-2"
                        style={stripedBackgroundStyle} >
                        
                        <div className="text-center">
                           <h4 className="text-slate-800 font-black italic uppercase tracking-tighter text-sm">
                                {selectingFor === 'me' ? (
                                    <span className="text-[var(--color-background)] text-[16px]">Tus propiedades</span>
                                ) : (
                                    <>
                                        <span className="text-[var(--color-background)] text-[16px] block mb-1">Propiedades de:</span>
                                        <span className="text-slate-400 text-[16px] leading-none">
                                            {receiver?.name}
                                        </span>
                                    </>
                                )}
                            </h4>
                        </div>
                                    
                        <Button 
                            onClick={() => { 
                                setIsMinimised(false); 
                                EventBus.emit('dark-mode', true);
                            }} 
                            className={`bg-[var(--color-primary)] text-[var(--color-text)] font-black text-[12px] px-5 py-2 rounded-full uppercase 
                                    ${bouncyAnimation}`}>
                            Volver al trato
                        </Button>

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Click en el tablero
                        </span>
                    </div>
                </div>
            )}
            <div className={`fixed inset-0 z-[1000] pointer-events-none flex justify-between py-8 px-6 transition-all duration-500 
                        ${isMinimised ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                
                {/* panel jugador que inicia tradeo */}
                <aside className="pointer-events-auto w-[300px] animate-in slide-in-from-left-20 duration-700 ease-out">
                    <div className="h-full rounded-[40px] flex flex-col overflow-hidden"
                        style={stripedBackgroundStyle}>
                        <TradeHeader player={sender} isSender={true} />
                        <div className="flex-1 overflow-y-auto px-8">
                            <TradeZone 
                                title="Tu Dinero"
                                offer={myOffer}
                                playerProperties={sender.properties}
                                onAdd={() => startSelection('me')} 
                                onMoneyChange={(v: number) => setMyOffer({...myOffer, money: v})}
                                onRemoveProperty={(id: string) => handleRemoveProperty(id, 'me')}
                                showProperties={showProperties}
                            />
                        </div>
                        <div className="flex justify-center items-center p-8">
                            <Button onClick={closeTrading} 
								sound="trade_turned_down"
                                className={`w-[200px] h-[60px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[14px] 
                                        rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`}>
                                Cancelar negociación
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* panel rival */}
                <aside className="pointer-events-auto w-[300px] animate-in slide-in-from-right-20 duration-700 ease-out">
                    <div className="h-full rounded-[40px] flex flex-col overflow-hidden"
                        style={stripedBackgroundStyle}>
                        <TradeHeader player={receiver} isSender={false} />
                        <div className="flex-1 overflow-y-auto px-8">
                            <TradeZone 
                                title={`Oferta de ${receiver.name}`}
                                offer={theirOffer} 
                                playerProperties={receiver.properties}
                                onAdd={() => startSelection('them')} 
                                onMoneyChange={(v: number) => setTheirOffer({...theirOffer, money: v})}
                                onRemoveProperty={(id: string) => handleRemoveProperty(id, 'them')}
                                showProperties={showProperties}
                            />
                        </div>
                        <div className="flex justify-center items-center p-8">
                            <Button onClick={closeTrading}
							sound="trade_accepted"
                            className={`w-[150px] h-[60px] bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase text-[14px] 
                                            rounded-full ${bouncyAnimation}`}>
                                Proponer Trato
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
};

const TradeZone = ({ title, offer, onAdd, onMoneyChange, playerProperties = [], onRemoveProperty, showProperties}: any) => {
    
    const hasProperties = playerProperties && playerProperties.length > 0;
    const paperStyle = {
        background: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.05)'
    };

    return (
        <div className="flex flex-col gap-5 py-4">
            <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    {title}
                </span>
                <div className="h-[1px] flex-1 bg-gray-100 ml-4"></div>
            </div>

            <div className="relative group">
                <Input 
                    placeholder="0"
                    className="w-full bg-white border-2 border-slate-400 rounded-[30px] py-8 px-7 text-xl font-bold text-slate-900 outline-none 
                    focus:border-slate-700 transition-all placeholder:text-slate-400 shadow-sm"
                    value={offer.money || ''}
                    onChange={(e) => onMoneyChange(parseInt(e.target.value) || 0)}
                />
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                    <span className="text-2xl font-black text-[var(--color-primary)]">€</span>
                </div>
            </div>

            {/* propiedades */}
            <div style={paperStyle}
                className={`min-h-[350px] border-2 border-slate-200 rounded-[32px] p-4 transition-all flex flex-col justify-between
                    ${!hasProperties ? 'opacity-70 grayscale' : ''}`}>
                
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] p-1">
                    {showProperties && offer.properties.length > 0 ? (
                        offer.properties.map((prop: any) => (
                            <div key={prop.id} 
                                className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100" >
                                <div className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: prop.color || '#cbd5e1' }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black uppercase text-slate-700 leading-tight whitespace-normal break-words">
                                        {prop.name}
                                    </p>
                                </div>
                               
                                <Button onClick={() => onRemoveProperty(prop.id)}
                                    className="hover:bg-red-50 text-red-400 rounded-full">
                                    <span className="text-md font-bold">✕</span>
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-20">
                            <p className="text-[14px] font-black uppercase tracking-widest text-gray-700">
                                {hasProperties ? 'Selecciona activos' : 'Sin propiedades disponibles'}
                            </p>
                        </div>
                    )}
                </div>

                {hasProperties && (
                    <Button 
                        onClick={() => onAdd(playerProperties, showProperties)}
                        className="mt-4 w-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 
                                 rounded-full py-6 font-black uppercase text-[11px] tracking-widest
                                 hover:border-[var(--color-primary)] transition-all active:scale-95 group" >
                        <span className="text-[var(--color-primary)] text-sm mr-2">+</span>
                        Añadir Propiedades
                    </Button>
                )}
            </div>
        </div>
    );
};
