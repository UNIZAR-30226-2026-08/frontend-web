import { useState, useEffect, useRef } from 'react';
import { EventBus } from '@/EventBus';

interface PlayerHUDProps {
    playerId: string;
    initialName: string;
    initialColor: string;
    initialBalance: number;
    isClickable?: boolean;
    onClick?: () => void;
}

export const PlayerHUD = ({ 
    playerId, 
    initialName, 
    initialColor, 
    initialBalance,
    isClickable = false,
    onClick
}: PlayerHUDProps) => {
    const [balance, setBalance] = useState(initialBalance);
    const [properties, setProperties] = useState<string[]>([]);
    const prevBalance = useRef(initialBalance);

    useEffect(() => {
        const handlePlayerUpdate = (data: any) => {
            if (data.id === playerId) {
                if (data.balance !== undefined && data.balance !== prevBalance.current) {
                    setBalance(data.balance);
                    prevBalance.current = data.balance;
                }
                if (data.properties !== undefined) setProperties(data.properties);
            }
        };

        EventBus.on('player-updated', handlePlayerUpdate);
        return () => EventBus.off('player-updated', handlePlayerUpdate);
    }, [playerId]);

    const interactionClasses = isClickable 
        ? "cursor-pointer hover:scale-110 active:scale-95 group-hover/list:opacity-50 hover:!opacity-100 z-10 hover:z-20" 
        : "";

    return (
        <div 
            className={`relative pointer-events-auto transition-all duration-300 ${interactionClasses}`}
            onClick={isClickable ? onClick : undefined}
            role={isClickable ? "button" : "presentation"}
        >
            <div 
                className="flex flex-col text-white shadow-2xl"
                style={{ 
                    width: 'clamp(240px, 18vw, 320px)', 
                    background: `linear-gradient(135deg, ${initialColor} 50%, ${initialColor}dd 100%)`,
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 20px 50%)',
                    padding: '12px 14px 12px 42px',
                    filter: 'drop-shadow(0px 6px 8px rgba(0,0,0,0.4))'
                }}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] uppercase opacity-70 font-bold tracking-widest leading-none mb-1">
                            Jugador
                        </span>
                        <h3 className="m-0 text-[16px] font-black uppercase italic tracking-tighter leading-none drop-shadow-sm">
                            {initialName}
                        </h3>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-baseline gap-0.5 border border-white/10 shadow-inner">
                        <span className="text-[10px] text-yellow-400 font-bold">$</span>
                        <span className="text-xl font-mono font-black tabular-nums tracking-tighter">
                            {balance.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-90">
                            {properties.length} Propiedades
                        </span>
                    </div>
                    
                    <span className="text-[8px] opacity-40 font-mono">#{playerId.slice(-4)}</span>
                </div>
            </div>
        </div>
    );
};
