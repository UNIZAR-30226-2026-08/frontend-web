import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { FantasyCardContent } from '@/components/layout/FantasyLayout';
import { useAudio } from '@/context/AudioContext';
import fantasyData from '../../../public/data/fantasyCard.json';

export const FantasyOverlay = () => {
    const [cardData, setCardData] = useState<any>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [hasChosen, setHasChosen] = useState(false);
    const [resultData, setResultData] = useState<any>(null);

	const { playSound } = useAudio();

    useEffect(() => {
        const handle = (data: any) => { 
            console.log("Dentro de overlay fantasy:", data);
            const details = fantasyData.fantasy.find(c => 
                c.type === data.type && (data.value === null || c.value === data.value)
            );
            if (details) {
                setCardData({ ...data, ...details }); 
            } else {
                console.error("No se encontró la información para la carta:", data);
                setCardData(data);
            }
            
            setIsRevealed(false); 
            setHasChosen(false);
            setResultData(null);
            playSound('fantasy');
        };

        const handleResult = (result: any) => {
            console.log("Dentro de overlay fantasy resultadosss:", result);
            const details = fantasyData.fantasy.find(c => 
                c.type === result.type && (result.value === null || c.value === result.value)
            );
            
            setResultData(details);

            // Esperamos un poco para que el jugador lea la carta antes de cerrar
            setTimeout(() => {
                EventBus.emit('close-overlay');
                setCardData(null);
            }, 2500); 
        };
        EventBus.on('show-fantasy-overlay', handle);
        EventBus.on('fantasy-card-result-applied', handleResult);
        return () => { 
            EventBus.off('show-fantasy-overlay', handle); 
            EventBus.off('fantasy-card-result-applied', handleResult);
        };
    }, [playSound]);

    if (!cardData) return null;
    const canAfford = (cardData.balance || 0) >= (cardData.card_cost || 0);

    const handleSelect = (isRevealedChoice: boolean) => {
        if (hasChosen) return;

        if(isRevealedChoice && !canAfford) {
            EventBus.emit('show-toast', {
                message: `No tienes suficientes dinero (${cardData.card_cost}M) para elegir esta carta.`,
                type: 'error'
            });
            handleSelect(false);
            return;
        }
        setHasChosen(true);
        
        EventBus.emit('action-choose-card', { 
            player: cardData.player,
            revealed: isRevealedChoice 
        });

        if (isRevealedChoice) {
            // Caso Izquierda:
            playSound('card_place_1');
            setTimeout(() => {
                EventBus.emit('close-overlay');
                setCardData(null);
            }, 300);
        } else {
            // Caso Derecha: revelar carta
            setIsRevealed(true);
            playSound('card_slide');
            setTimeout(() => {
                EventBus.emit('close-overlay');
                setCardData(null);
            }, 4000);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="absolute inset-0 backdrop-blur-sm animate-in fade-in duration-300" />
        
                <div className="relative z-10 flex flex-row gap-12 animate-in fade-in zoom-in duration-300 scale-90 md:scale-100">
                    
                    <div className="relative flex flex-col items-center">
                        {!canAfford && !hasChosen && (
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-max z-50">
                                <span className="bg-red-600 text-white text-[16px] font-black px-4 py-4 rounded-full shadow-lg border border-white uppercase tracking-tighter">
                                    No tienes suficiente dinero
                                </span>
                            </div>
                        )}
                        {/* CARTA FRONT */} 
                        <div className={`transition-all duration-300 
                            ${isRevealed ? 'grayscale blur-[2px] scale-95' : 'hover:scale-110'}
                            ${hasChosen && !isRevealed ? 'pointer-events-none' : ''}
                            ${!canAfford && !hasChosen ? 'opacity-60 grayscale pointer-events-none' : ''}`}
                            onClick={() => handleSelect(true)}>

                            <GameCard 
                                isFlipped={true}
                                front={<FantasyCardContent data={cardData} />}
                                back={<FantasyCardContent isBack={true} />}
                            />
                            {!canAfford && !hasChosen && (
                                <div className="absolute inset-0 z-10 bg-black/10 rounded-xl" />
                            )}
                        </div>
                    </div>
                    <div className="absolute -inset-4 bg-white/10 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                
                    {/* CARTA INTERACTIVA */}
                    <div className={`flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 [perspective:1000px]
                        ${!isRevealed && !hasChosen ? 'hover:scale-105 hover:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : ''}
                        ${hasChosen && isRevealed ? 'pointer-events-none' : ''}`}
                        onClick={() => handleSelect(false) } >
                        <div className="flex flex-col items-center gap-4">

                            <GameCard 
                                isFlipped={isRevealed}
                                // onClick={handleAction}
                                front={<FantasyCardContent data={resultData || { title: "Revelando...", description: "Esperando al destino" }} />}
                                back={<FantasyCardContent isBack={true} />}
                            />
                        </div>
                    </div>
                </div>

        </div>
    );
};
