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
            
            <div className="relative z-10 flex flex-row gap-12 animate-in fade-in zoom-in duration-500 scale-90 md:scale-100"
                onClick={handleAction}>

                <div className="flex flex-col items-center gap-4">
                    <div className="relative group transition-transform hover:scale-105" onClick={() => setCardData(null)}>
                        
                        <GameCard 
                            type="generic"
                            headerColor="var(--color-secondary)"
                            title={cardData.title}
                            description={cardData.description}
                            footer="Comprar carta"
                            price={cardData.price}
                        />
                        
                        <div className="absolute -inset-1 bg-white rounded-lg blur opacity-10 group-hover:opacity-30 transition-opacity -z-10"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="relative group transition-transform hover:scale-105">
                        <GameCard 
                            type="initial"
                            title="Fantasía" 
                            description='Destapa la carta para descubrir su contenido completamente gratuito'
                        />
                        <div className="absolute -inset-1 bg-[var(--color-secondary)] rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity -z-10"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};