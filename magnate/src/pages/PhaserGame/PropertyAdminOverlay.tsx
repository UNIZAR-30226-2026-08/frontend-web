import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { PropertyAdminCardContent } from '@/components/layout/PropertyAdmin';
import { Button } from '@/components/ui/button';

export const PropertyAdminOverlay = () => {
    const [propData, setPropData] = useState<any>(null);
    const [constructionLevel, setConstructionLevel] = useState<string>('base');
    const [isMortgaged, setIsMortgaged] = useState<boolean>(false);

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

    useEffect(() => {
        const handleShowProp = ({data}: any) => {
            setPropData(data);
            setConstructionLevel(data.constructionLevel || 'base'); // TODO: vendra del backend
            setIsMortgaged(data.isMortgaged || false); // TODO: vendra del backend
        };

        EventBus.on('open-property-management', handleShowProp);
        return () => { EventBus.off('open-property-management', handleShowProp); };
    }, []);

    if (!propData) return null;

    const levels: (keyof PropertyData['rent'])[] = ['base', 'house1', 'house2', 'house3', 'house4', 'hotel'];
    const currentIndex = levels.indexOf(constructionLevel as any);
    const totalCost = currentIndex * (propData.housePrice || 0);
    
    // Lógica para añadir casas
    const handleAddHouse = () => {
        if (isMortgaged) return; // TODO: revisar qué hacer si está hipotecada
        if (currentIndex < levels.length - 1) {
            setConstructionLevel(levels[currentIndex + 1]);
        }
    };

    // Lógica para quitar casas
    const handleRemoveHouse = () => {
        if (isMortgaged) return; // TODO: revisar qué hacer si está hipotecada
        if (currentIndex > 0) {
            setConstructionLevel(levels[currentIndex - 1]);
        }
    };

    // Lógica de Hipoteca
    const handleToggleMortgage = () => {
        setIsMortgaged(!isMortgaged);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="flex flex-col items-center gap-8">
                <div className={isMortgaged ? '' : ''}>
                    <GameCard 
                        isFlipped={true}
                        front={
                            <PropertyAdminCardContent 
                                data={propData} 
                                isMortgaged={isMortgaged}
                                constructionLevel={constructionLevel as any}
                            />
                        }
                        back={<div />} 
                    />
                </div>
                <div className='flex gap-4'>
                    <Button onClick={() => { setPropData(null); }}
                        className={`px-9 py-8 bg-[var(--color-primary)] select-none text-white font-black uppercase rounded-full shadow-2xl 
                                ${bouncyAnimation} transition-all`}>
                        <div className="flex flex-col items-center">
                            <span className="text-sm opacity-80">
                                {!isMortgaged && totalCost > 0 ? 'Pagar' : ''}
                            </span>
                            <span className="text-xl">
                                {isMortgaged && "Aceptar"}
                                {currentIndex === 0 && !isMortgaged && "Aceptar"}
                                {currentIndex > 0 && !isMortgaged && currentIndex < 5 && `${currentIndex} CASAS - ${totalCost}€`}
                                {currentIndex === 5  && !isMortgaged && `HOTEL - ${totalCost}€`}
                            </span>
                        </div>
                    </Button>
                </div>    
            </div>
            
            <div className="flex flex-col gap-4 ml-10">
                <Button
                    onClick={handleRemoveHouse}
                    disabled={isMortgaged || constructionLevel === 'base'}
                    size="icon"
                    className={`bg-[var(--color-text)] select-none rounded-full flex items-center justify-center w-20 h-20 ${bouncyAnimation}`}>
                    <img src="/icons/remove_house.svg" className="w-12 h-12" alt="Remove" />
                </Button>
                <Button
                    onClick={handleAddHouse}
                    disabled={isMortgaged || constructionLevel === 'hotel'}
                    size="icon"
                    className={`bg-[var(--color-text)] select-none rounded-full flex items-center justify-center w-20 h-20 ${bouncyAnimation}`}>
                    <img src="/icons/add_house.svg" className="w-12 h-12" alt="Add" />
                </Button>
                <Button
                    onClick={handleToggleMortgage}
                    size="icon"
                    className={`bg-[var(--color-text)] select-none rounded-full flex items-center justify-center w-20 h-20 ${bouncyAnimation}`}>
                    <img src="/icons/mortgage_property.svg" className="w-12 h-12" alt="Mortgage" />
                </Button>
                
            </div>
        </div>
    );
};
