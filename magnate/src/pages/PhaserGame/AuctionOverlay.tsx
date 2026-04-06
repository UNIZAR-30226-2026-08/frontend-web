import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { PropertyCardContent } from '@/components/layout/PropertyLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'
import { useAudio } from '@/context/AudioContext';

export const AuctionOverlay = () => {
	const { playSound } = useAudio();
    
    const [auctionData, setAuctionData] = useState<any>(null);
    const [currentBid, setCurrentBid] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [manualAmount, setManualAmount] = useState<string>('');
    const [showResults, setShowResults] = useState(false);
    const [players, setPlayers] = useState<any[]>([]); // TODO: lista de jugadores que recibiremos

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
        const handleShowProp = (data: any) => { // TODO: para jugadores
            if (data.players) {
                setPlayers(data.players);
            }
        };
        const handleStartAuction = (data: any) => {
            setAuctionData(data);
            setCurrentBid(Math.floor(data.price / 2)); // precio empieza a la mitad
            setTimeLeft(15); // timer empieza a 15
            setShowResults(false);
            if (data.players) setPlayers(data.players);
        };
        
        EventBus.on('show-property-card', handleShowProp);
        EventBus.on('start-auction', handleStartAuction);
        return () => { 
            EventBus.off('start-auction', handleStartAuction);
            EventBus.on('show-property-card', handleShowProp);
         };
    }, []);

    useEffect(() => {
        if (!auctionData || showResults || timeLeft <= 0) {
            if (timeLeft === 0 && !showResults) handleGoToResults();
            return;
        }
		if (timeLeft <= 5){
			playSound('timeout');
		}

        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, auctionData, showResults, playSound]);

    const handleBid = (amount: number) => {
        setCurrentBid(prev => prev + amount);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseInt(manualAmount);
        if (!isNaN(value) && value > currentBid) {
            setCurrentBid(value);
            setManualAmount('');
        }
    };
    
    const handleGoToResults = () => {
		playSound('auction_end');
        setShowResults(true);
        // EventBus.emit('auction-finished', { winner: 'Player 1', amount: currentBid }); // TODO: avisar phaser quien ha ganado
    };

    if (!auctionData) return null;

    // no pujar por menos de lo que hay
    const isManualBidInvalid = parseInt(manualAmount) <= currentBid || manualAmount === '';
    
    if (showResults) {
        // TODO: llegará una lista de jugadores
        const players = [
            { name: 'Player 1', bid: currentBid, isWinner: true, color: '#f94144' },
            { name: 'Player 2', bid: 20, isWinner: false, color: '#f9c74f' },
            { name: 'Player 3', bid: 10, isWinner: false, color: '#90be6d' },
            { name: 'Player 4', bid: 10, isWinner: false, color: '#2c7da0' },
        ];
        const winner = players.find(p => p.isWinner);
        const losers = players.filter(p => !p.isWinner);

        return (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className="relative shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-[50px] overflow-hidden w-[550px] border border-gray-500"
                    style={stripedBackgroundStyle}>                
                    
                    <div className="p-10 flex flex-col items-center">
                        <div className="mb-6">
                            <span className="text-slate-500 text-[12px] font-black uppercase italic tracking-widest block">
                                Subasta Finalizada
                            </span>
                        </div>
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-1 text-center">
                            ¡Adjudicado!
                        </h2>
                        <p className="text-slate-800 font-black uppercase tracking-widest text-sm mb-10 mt-3 opacity-60">
                            {auctionData.name}
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
                                        <p className="text-5xl font-black text-slate-900 select-none">{winner.bid}€</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="w-full space-y-2 mb-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-3">Otras pujas</p>
                            {losers.map((player, idx) => (
                                <div key={idx} className="flex justify-between items-center px-6 py-4 bg-white/90 border border-slate-170 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: player.color }} />
                                        <span className="font-bold text-slate-600 text-sm uppercase">{player.name}</span>
                                    </div>
                                    <span className="font-black text-slate-400">{player.bid}€</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            onClick={() => {
                                setAuctionData(null);
                                EventBus.emit('close-overlay');
                            }}
                            className={`w-[150px] h-[50px] text-xl font-black uppercase rounded-full 
                                        bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] shadow-xl ${bouncyAnimation}`}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    // Primera pantalla de subasta
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="flex flex-row items-center gap-12 p-10 rounded-[50px] border border-gray-500 shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                style={stripedBackgroundStyle}>
                
                <div className="rotate-[-4deg]">
                    <GameCard 
                        isFlipped={true}
                        front={<PropertyCardContent data={auctionData} />}
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
                        <p className="text-6xl font-black text-[var(--color-primary)] leading-none">{currentBid}€</p>
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
                                +{amount}€
                            </Button>
                        ))}
                    </div>

                    <Button 
                        onClick={handleGoToResults}
                        className="mt-8 text-gray-600 hover:text-red-400 text-[14px] uppercase font-bold tracking-widest transition-colors">
                        Retirarse de la subasta
                    </Button>
                </div>
            </div>
        </div>
    );
};
