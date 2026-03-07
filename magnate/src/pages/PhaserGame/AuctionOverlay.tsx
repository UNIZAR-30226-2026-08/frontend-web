import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { PropertyCardContent } from '@/components/layout/PropertyLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'

export const AuctionOverlay = () => {
    
    const [auctionData, setAuctionData] = useState<any>(null);
    const [currentBid, setCurrentBid] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [manualAmount, setManualAmount] = useState<string>('');
    const [showResults, setShowResults] = useState(false);
    const [players, setPlayers] = useState<any[]>([]); // TODO: lista de jugadores que recibiremos

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

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
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, auctionData, showResults]);

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
                <div className="relative bg-[var(--color-background)] p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[48px] overflow-hidden w-[650px]">
                
                    <div className="bg-[var(--color-background)] p-10 rounded-[44px] border border-[var(--color-background)] flex flex-col items-center">
                        
                        <div className="bg-white/5 border border-white/10 px-4 py-1 rounded-full mb-4">
                            <span className="text-[var(--color-primary)] text-xs font-black uppercase tracking-[0.3em]">Subasta terminada</span>
                        </div>

                        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2 text-center">
                            ¡Adjudicado!
                        </h2>
                        
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-[16px] mb-8">
                            {auctionData.title}
                        </p>

                        {/* winner */}
                        {winner && (
                            <div className="w-full mb-6 relative group">
                                <div className="absolute -inset-1 from-[var(--color-primary)] to-amber-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative flex items-center justify-between p-6 bg-[#1a1a1a] border border-white/10 rounded-3xl">
                                    
                                    <div className="flex items-center gap-5">
                                        <div>
                                            <p className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest mb-0.5">Nuevo Propietario</p>
                                            <p className="text-2xl font-black text-white uppercase">{winner.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-0.5">Inversión</p>
                                        <p className="text-4xl font-black text-white">{winner.bid}€</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* losers */}
                        <div className="w-full grid grid-cols gap-3 mb-10">
                            {losers.map((player, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: player.color }} />
                                        <span className="font-bold text-gray-400 text-sm uppercase tracking-tight">{player.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-200">{player.bid}€</span>
                                </div>
                            ))}
                        </div>

                        <Button onClick={() => setAuctionData(null)}
                            className={`w-35 py-7 text-[20px] font-black uppercase rounded-full bg-[var(--color-primary)] text-[var(--color-text)]  ${bouncyAnimation}`}>
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
            <div className="flex flex-row items-center gap-12 bg-[var(--color-background)] p-10 rounded-[40px] border border-gray-700 shadow-3xl scale-90">
                
                <div className="rotate-[-4deg]">
                    <GameCard 
                        isFlipped={true}
                        front={<PropertyCardContent data={auctionData} />}
                        back={<div />} 
                    />
                </div>

                <div className="flex flex-col items-center text-white w-[400px]">
                    <h2 className="text-[40px] font-black italic uppercase tracking-tighter mb-2 leading-none">Subasta a ciegas</h2>
                    <h2 className='text-[14px] leading-tight text-gray-400 font-bold uppercase italic px-2 mb-4'>¿Cuánto estás dispuesto a pagar?</h2>
                    
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 border-[var(--color-primary)] mb-6  
                            ${timeLeft <= 5 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-[var(--color-primary)]'}`}>
                            <span className={`
                                text-2xl font-bold transition-colors duration-300
                                ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'} `}>
                                {timeLeft}
                            </span>
                    </div>

                    <div className="bg-white/5 w-full rounded-2xl p-6 border border-white/10 mb-6 text-center">
                        <p className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em] mb-1">Puja Actual</p>
                        <p className="text-6xl font-black text-[var(--color-primary)] leading-none">{currentBid}€</p>
                    </div>

                    
                    <form onSubmit={handleManualSubmit} className="w-full mb-4">
                        <div className="relative flex items-center">
                            <Input 
                                value={manualAmount}
                                onChange={(e) => setManualAmount(e.target.value)}
                                placeholder={`Mín. ${currentBid + 1}`}
                                className="w-full bg-black/40 border-2 border-gray-700 rounded-2xl py-7 px-7 text-xl font-bold outline-none 
                                focus:border-[var(--color-primary)] transition-all placeholder:text-gray-600" />
                            <Button 
                                type="submit"
                                disabled={isManualBidInvalid}
                                className={`absolute right-4 px-5 py-2 rounded-2xl font-black uppercase text-md transition-all  ${bouncyAnimation}
                                    ${isManualBidInvalid 
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                                        : 'bg-[var(--color-primary)] text-[var(--color-text)] hover:scale-105 active:scale-95'}`} >
                                Pujar
                            </Button>
                        </div>
                    </form>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        {[10, 50].map(amount => (
                            <Button 
                                key={amount}
                                onClick={() => handleBid(amount)}
                                className="py-7 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl font-bold text-md transition-all active:scale-95">
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