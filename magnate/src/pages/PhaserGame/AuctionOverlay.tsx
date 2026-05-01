import { useEffect, useState, useRef } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { PropertyCardContent } from '@/components/layout/PropertyLayout';
import { ServiceCardContent } from '@/components/layout/ServiceLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'
import { useAudio } from '@/context/AudioContext';

export const AuctionOverlay = () => {
	//const { playSound } = useAudio();
    
    const [auctionData, setAuctionData] = useState<any>(null); // Datos de la subasta (pujas, propiedad)
    const [myBalance, setMyBalance] = useState<number>(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15); // Cuenta atrás visual
    const [phase, setPhase] = useState<string>(""); // Fase actual del juego
    const [manualAmount, setManualAmount] = useState<string>(''); // Lo que el usuario escribe en el input
    
    const bidRef = useRef(0);
    const hasSubmittedRef = useRef(false);
    const myId = useRef(localStorage.getItem('myId') || "");

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
        bidRef.current = currentBid;
    }, [currentBid]);

    useEffect(() => {
        // fase en la que estamos

        const handleAuctionData = (data: any) => {
            console.log("INICIO subasta", data);
            setAuctionData(data);
            setTimeLeft(15);
            setCurrentBid(0);
            setPhase(data.phase);
            setMyBalance(data.myBalance || 0);
            hasSubmittedRef.current = false; // Resetear para nueva subasta
        };

        EventBus.on('show-auction-overlay', handleAuctionData);

        return () => { 
            EventBus.off('show-auction-overlay', handleAuctionData);
         };
    }, []);

    useEffect(() => {
        // Bloqueo: si no hay subasta, no hacemos nada
        if (!auctionData || timeLeft < 0) return;

        if (timeLeft <= 1 && auctionData) {
            console.log("Enviando puja final:", bidRef.current);
            setAuctionData(null);
            sendFinalBid();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, auctionData, phase]);

    // --- funciones subasta ---
    // Maneja los botones de incremento
    const handleBid = (amount: number) => {
        setCurrentBid(prev => {
            const next = prev + amount;
            // Bloqueo: si la nueva puja supera el balance, nos quedamos en el balance máximo
            return next <= myBalance ? next : myBalance; 
        });
    };

    // Maneja la puja escrita manualmente en el Input
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseInt(manualAmount);
        if (!isNaN(value) && value > 0) {
            const finalValue = value > myBalance ? myBalance : value;
            setCurrentBid(finalValue);
            setManualAmount('');
        }
    };

    const sendFinalBid = () => {
        if (hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        EventBus.emit('action-bid', { 
            money: bidRef.current 
        });
    };

    // no pujar por menos de lo que hay
    const isManualBidInvalid = !manualAmount || parseInt(manualAmount) <= 0 ||  parseInt(manualAmount) > myBalance;
    if (!auctionData) return null;
    const isSpecial = auctionData.special;
    // Primera pantalla de subasta
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="flex flex-row items-center gap-12 p-10 rounded-[50px] border border-gray-500 shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                style={stripedBackgroundStyle}>
                
                <div className="rotate-[-4deg]">
                    <GameCard 
                        isFlipped={true}
                        front={
                            isSpecial ? (
                                <ServiceCardContent data={auctionData.property} />
                            ) : (
                                <PropertyCardContent data={auctionData.property} />
                            )
                        }
                        back={<div />} 
                    />
                </div>

                <div className="flex flex-col items-center text-[var(--color-background)] w-[400px]">
                    <h2 className="text-[40px] font-black italic uppercase tracking-tighter mb-2 leading-none">Subasta a ciegas</h2>
                    <h2 className='text-[14px] leading-tight text-gray-400 font-bold uppercase italic px-2 mb-4'>¿Cuánto estás dispuesto a pagar?</h2>
                    
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 border-[var(--color-primary)] mb-6  
                            ${timeLeft <= 5 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-[var(--color-primary)]'}`}>
                            <span className={`
                                text-2xl font-bold transition-colors duration-300
                                ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-[var(--color-background)]'} `}>
                                {timeLeft}
                            </span>
                    </div>

                    <div className="bg-white/5 w-full rounded-2xl p-6 border border-white/10 mb-6 text-center">
                        <p className="text-gray-400 uppercase text-[12px] font-bold tracking-[0.2em] mb-1">Puja Actual</p>
                        <p className="text-6xl font-black text-[var(--color-primary)] leading-none">{currentBid}M</p>
                    </div>

                    
                    <form onSubmit={handleManualSubmit} className="w-full mb-4">
                        <div className="relative flex items-center">
                            <Input 
                                value={manualAmount}
                                onChange={(e) => setManualAmount(e.target.value)}
                                placeholder={`Mín. ${currentBid + 1}`}
                                className="w-full bg-white border-2 border-slate-400 rounded-2xl py-8 px-7 text-xl font-bold text-slate-900 outline-none 
                                focus:border-slate-700 transition-all placeholder:text-slate-400 shadow-sm" />
                            <Button 
                                type="submit"
                                disabled={isManualBidInvalid}
                                className={`absolute right-3 px-6 py-3 rounded-xl font-black uppercase text-sm transition-all ${bouncyAnimation}
                                    ${isManualBidInvalid 
                                        ? 'bg-slate-250 text-slate-400 cursor-not-allowed' 
                                        : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] shadow-lg'}`} >
                                Pujar
                            </Button>
                        </div>
                    </form>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {[10, 50].map(amount => (
                            <Button 
                                key={amount}
                                onClick={() => handleBid(amount)}
                                className="py-7 bg-white hover:bg-slate-50 border-2 border-slate-400 rounded-2xl 
                                            font-black text-slate-500 text-lg transition-all active:scale-95 shadow-sm">
                                +{amount}M
                            </Button>
                        ))}
                    </div>

                    {/* <Button 
                        onClick={handleGoToResults}
                        className="mt-8 text-gray-600 hover:text-red-400 text-[14px] uppercase font-bold tracking-widest transition-colors">
                        Retirarse de la subasta
                    </Button> */}
                </div>
            </div>
        </div>
    );
};
