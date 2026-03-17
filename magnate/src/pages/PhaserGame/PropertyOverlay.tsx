import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { PropertyCardContent } from '@/components/layout/PropertyLayout';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';

export const PropertyOverlay = () => { 
    const [propData, setPropData] = useState<any>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

	const { playSound } = useAudio();

    useEffect(() => {
        const handleShowProp = (data: any) => {
			setPropData(data);
			playSound('card_place_1');
		}
        EventBus.on('show-property-card', handleShowProp);
        return () => { EventBus.off('show-property-card', handleShowProp); };
    }, [playSound]);
    
    const handleBuy = () => {
        if (!propData) return;

        // enviamos info a phaser
        EventBus.emit('property-bought', {
            tileId: propData.id,
            playerName: propData.playerName,
            playerColor: propData.playerColor
        });
        EventBus.emit('close-overlay');
        setPropData(null);
    };

    if (!propData) {return null;}

	// Just in case they are not set
	const currentLevel = propData.constructionLevel || 'base';
	const mortgaged = propData.isMortgaged || false;

	if (propData.isMortgaged) { 
		return ( // mortgage view
			<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
	            <div className="flex flex-col items-center gap-8">
	                <GameCard 
	                    isFlipped={true}
	                    front={<PropertyCardContent data={propData} isMortgaged={mortgaged} />}
	                    back={<div  />} 
	                />
	                <Button onClick={() => setPropData(null)} 
	                        className={`px-8 py-3 bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase rounded-full ${bouncyAnimation}`}>
	                            Aceptar
	                </Button>
				</div>
			</div>
		);
	}

	if (!propData.isAvailable) { 
		return ( // pay rent view
		    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
	            <div className="flex flex-col items-center gap-8">
                	<GameCard 
                	    isFlipped={true}
                	    front={<PropertyCardContent data={propData} />}
                	    back={<div />} 
                	/>
	                <Button onClick={() => setPropData(null)} 
	                        className={`px-8 py-3 bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase rounded-full ${bouncyAnimation}`}>
	                            Pagar {propData.rent[currentLevel]}€
	                </Button>
				</div>
			</div>
		);
	}

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-8">
                <GameCard 
                    isFlipped={true}
                    front={<PropertyCardContent data={propData} />}
                    back={<div />} 
                />
                <div className="flex gap-4">
                
                    <Button onClick={handleBuy} 
                            className={`px-9 py-6 bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase rounded-full ${bouncyAnimation}`}>
                                Comprar {propData.price}€
                    </Button>

                    <div className="relative group">
                        <Button 
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onClick={() =>  {
                                EventBus.emit('start-auction', propData);
                                setPropData(null);
                            }} 
                            className={`px-9 py-6 bg-white hover:bg-gray-100 text-black font-black uppercase rounded-full shadow-xl 
                            transition-all hover:scale-105 active:scale-95 ${bouncyAnimation}`} >
                            Subastar
                        </Button>

                        {/* Tooltip */}
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-72 p-5 
                                    bg-[var(--color-background)] border border-gray-700 
                                    text-gray-100 text-[14px] rounded-[24px] shadow-2xl 
                                    transition-all duration-300 ease-out pointer-events-none z-50
                                    ${showTooltip ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}>
                        
                            <div className="relative flex flex-col items-center text-center z-10">
                                <p className="leading-relaxed tracking-wide font-medium">
                                    Si decides no adquirir esta propiedad, pasará a subasta entre el resto de los jugadores.
                                </p>
                            </div>

                            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--color-background)] 
                                            border-r border-b border-gray-700 rotate-45 rounded-br-[4px]"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
