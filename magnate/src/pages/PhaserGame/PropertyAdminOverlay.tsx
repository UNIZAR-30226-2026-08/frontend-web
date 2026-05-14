import { useEffect, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { PropertyAdminCardContent } from '@/components/layout/PropertyAdmin';
import { Button } from '@/components/ui/button';
import { GameLogicManager } from '@/phaser/managers/GameLogicManager';

export const PropertyAdminOverlay = () => {
	const { playSound } = useAudio();

    const gameModel = GameLogicManager.getInstance().model;
    const myId = gameModel.myId;
    const [propData, setPropData] = useState<any>(null);

    const [constructionLevel, setConstructionLevel] = useState<string>('base');
    const [isMortgaged, setIsMortgaged] = useState<boolean>(false);
    const levels = ['base', 'house1', 'house2', 'house3', 'house4', 'hotel'];

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

    useEffect(() => {
        const handleShowProp = ({data}: any) => {
			playSound('card_place_1');
            setPropData(data);
            console.log("administrando", data);

            const currentLevel = levels[data.houseCount] || 'base';
            setConstructionLevel(currentLevel);
            setIsMortgaged(data.isMortgaged);
        };

        EventBus.on('open-property-management', handleShowProp);
        return () => { 
            EventBus.off('open-property-management', handleShowProp); 
            EventBus.emit('dark-mode', false); 
        };
    }, [playSound]);

    if (!propData) return null;

    const currentIndex = levels.indexOf(constructionLevel); // nivel actual
    console.log("Current index", currentIndex);
    const diff = currentIndex - propData.houseCount;
    console.log("diff: número de casas que puedo", diff);
    const totalCost = diff * (propData.buildPrice || 0);
    const isSpecial = propData.isSpecial;
    
    // Lógica para añadir casas
    const handleAddHouse = () => {
        if (isMortgaged || currentIndex >= levels.length - 1) return;

        const nextIndex = currentIndex + 1;
        if (nextIndex >= levels.length) return;
        const totalAddable = gameModel.getMaxAddableHouses(propData.id, myId, propData.buildPrice);
        const potentialDiff = nextIndex - propData.houseCount;
        if (potentialDiff <= totalAddable) {
            playSound('house_build');
            setConstructionLevel(levels[nextIndex]);
        } else {
            EventBus.emit('show-toast', { 
                message: "Debes construir de forma uniforme en todo el grupo", 
                duration: 3000 
            });
        }
    };

    // Lógica para quitar casas
    const handleRemoveHouse = () => {
        if (isMortgaged || currentIndex <= 0) return;

        const maxRemovable = gameModel.getMaxRemovableHouses(propData.id);
        if (currentIndex > 0 && Math.abs(diff) < maxRemovable) {
            playSound('house_down');
            setConstructionLevel(levels[currentIndex - 1]);
        } else {
            EventBus.emit('show-toast', { 
                message: "No puedes quitar más casas sin desequilibrar el grupo", 
                duration: 3000 
            });
        }
      
    };

    // Lógica de Hipoteca
    const handleToggleMortgage = () => {
        //  No se puede hipotecar si hay construcciones en el nivel actual o real
        if (!isMortgaged) {
            if (gameModel.canMortgage(propData.id, myId) && currentIndex === 0) {
                playSound('mortgage');
                setIsMortgaged(true);
            } else {
                EventBus.emit('show-toast', { 
                    message: "No puedes hipotecar una propiedad con construcciones en el grupo", 
                    duration: 3000 
                });
            }
        } else {
            playSound('mortgage');
            setIsMortgaged(false);
        }
    };

    const handleConfirm = () => {
        const squareId = parseInt(propData.id);

        if (isMortgaged !== propData.isMortgaged) {
            console.log("Hipotecando propiedad",squareId);
            const action = isMortgaged ? 'action-mortgage-set' : 'action-mortgage-unset';
            EventBus.emit(action, { square: squareId });

        } else if (diff > 0) {
            EventBus.emit('action-build', { 
                square: squareId, 
                houses: diff
            });
        } else if (diff < 0) {
            EventBus.emit('action-demolish', { 
                square: squareId, 
                houses: Math.abs(diff)
            });
        }

        handleClose();
    };

    const handleClose = () => {
        setPropData(null);
        EventBus.emit('dark-mode', false);
        EventBus.emit('close-property-selection-mode');
        EventBus.emit('close-overlay');
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
                    <Button 
                        onClick={handleConfirm}   
                        className={`px-9 py-8 bg-[var(--color-primary)] select-none text-white font-black uppercase rounded-full shadow-2xl 
                                ${bouncyAnimation} transition-all`}>
                        <div className="flex flex-col items-center">
                            <span className="text-xl">
                                {diff === 0 && isMortgaged === propData.isMortgaged ? "ACEPTAR" : "CONFIRMAR"}
                            </span>
                            <span className="text-md opacity-80 lowercase font-medium uppercase">
                                {isMortgaged && !propData.isMortgaged && `Recibirás ${propData.buyPrice/2}M`}
                                {!isMortgaged && propData.isMortgaged && `Pagarás ${(propData.buyPrice/2)}M`}
                                {!isMortgaged && !propData.isMortgaged && diff > 0 && `Pagarás ${totalCost}M`}
                                {!isMortgaged && !propData.isMortgaged && diff < 0 && `Recibirás ${Math.abs(totalCost)/2}M`}
                                {diff === 0 && isMortgaged === propData.isMortgaged && ""}
                            </span>
                        </div>
                    </Button>
                </div>    
            </div>
            
            <div className="flex flex-col gap-4 ml-10">
                <Button
                    onClick={handleAddHouse}
                    disabled={isMortgaged || !gameModel.canBuildOneMore(propData.id, myId) || currentIndex === 5 || isSpecial}
                    size="icon"
                    className={`bg-[var(--color-text)] select-none rounded-full flex items-center justify-center w-20 h-20 ${bouncyAnimation}`}>
                    <img src="/icons/add_house.svg" className="w-12 h-12" alt="Add" />
                </Button>
                <Button
                    onClick={handleRemoveHouse}
                    disabled={isMortgaged || !gameModel.canSellOneMore(propData.id) || currentIndex === 0 || isSpecial}
                    size="icon"
                    className={`bg-[var(--color-text)] select-none rounded-full flex items-center justify-center w-20 h-20 ${bouncyAnimation}`}>
                    <img src="/icons/remove_house.svg" className="w-12 h-12" alt="Remove" />
                </Button>
                <Button
                    onClick={handleToggleMortgage}
                    disabled={currentIndex > 0}
                    size="icon"
                    className={`bg-[var(--color-text)] select-none rounded-full flex items-center justify-center w-20 h-20 ${bouncyAnimation}`}>
                    <img src="/icons/mortgage_property.svg" className="w-12 h-12" alt="Mortgage" />
                </Button>
                
            </div>
        </div>
    );
};
