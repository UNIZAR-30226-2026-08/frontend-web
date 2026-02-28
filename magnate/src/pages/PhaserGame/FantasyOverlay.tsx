import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/cardGame';

export const FantasyOverlay = () => { 
    const [cardData, setCardData] = useState<any>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const handleShowCard = (data: any) => {
            setCardData(data);
            setIsRevealed(false);
        };
        EventBus.on('show-fantasy-card', handleShowCard);
        return () => { EventBus.off('show-fantasy-card', handleShowCard); };
    }, []);

    if (!cardData) return null;

    const handleAction = () => {
        if (!isRevealed) {
            setIsRevealed(true);
        } else {
            setCardData(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">

            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={() => setCardData(null)}
            />
            
            <div className="relative z-10 flex flex-row gap-12 animate-in fade-in zoom-in duration-500 scale-90 md:scale-100">

                {/* Generic card */}
               <div className={`flex flex-col items-center gap-6 transition-all duration-500 
                                ${isRevealed ? 'grayscale blur-[2px] scale-95 pointer-events-none' : 'hover:scale-110'}`}>

                    <div className="relative group drop-shadow-2xl">
                        <GameCard 
                            type="generic"
                            headerColor="var(--color-secondary)"
                            title={cardData.title}
                            description={cardData.description}
                            price={cardData.price}
                        />
                        <div className="absolute -inset-4 bg-white/10 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                </div>

                {/* initial */}
                <div 
                    className="flex flex-col items-center gap-4 cursor-pointer [perspective:1000px]"
                    onClick={handleAction} >
                    <div className={`relative w-[300px] h-[450px] transition-all duration-700 [transform-style:preserve-3d] 
                                    group-hover:scale-110 group-hover:drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] 
                                    ${isRevealed ? '[transform:rotateY(180deg)]' : ''}`} >
                        
                        <div className="absolute inset-0 z-20 transition-all duration-300 hover:scale-110 [backface-visibility:hidden]">
                            <GameCard 
                                type="initial"
                                title="Fantasía" 
                                description='Pulsa para revelar tu destino gratuito'
                            />
                            <div className="absolute -inset-1 bg-[var(--color-secondary)] rounded-lg blur opacity-30 
                                            group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>
                        </div>

                        <div className="absolute inset-0 z-10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                            <GameCard 
                                type="generic"
                                headerColor="var(--color-secondary)" 
                                title={cardData.title}
                                description={cardData.description}
                                price={cardData.price}
                            />
                            <div className="absolute -inset-1 bg-yellow-400/20 rounded-lg blur opacity-30 -z-10"></div>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>
    );
};