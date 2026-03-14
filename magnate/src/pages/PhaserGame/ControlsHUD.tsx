import React, { useState } from 'react';
import { EventBus } from '@/EventBus';
import { SettingsModal } from '@/components/layout/SettingsModal';
import { BankruptModal } from '@/components/layout/BankruptModal';
import { Button } from "@/components/ui/button";

export const ControlsHUD = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isBankruptOpen, setIsBankruptOpen] = useState(false);

    const bouncyButtonClass = "rounded-full flex items-center justify-center w-24 h-24 p-0 shadow-[0px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[4px] border-none cursor-pointer transform-gpu transition-all duration-150 ease-in-out active:scale-95";

    const handleRollClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        EventBus.emit('trigger-dice-roll');
        e.currentTarget.blur();
    };

    const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsSettingsOpen(true);
        e.currentTarget.blur();
    };

    const handleAdministerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('Administer properties clicked!');
        // TODO: Conectar con la administración de propiedades
        e.currentTarget.blur();
    };

    const handleTradeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('Trading clicked!');
        // TODO: Conectar con el tradeo
        e.currentTarget.blur();
    };

    const handleFinishTurnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('Finish Turn clicked!');
        // TODO: EventBus.emit('trigger-finish-turn')
        e.currentTarget.blur();
    };

    const handleBankruptClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsBankruptOpen(true);
        e.currentTarget.blur();
    };

    const handleConfirmBankrupt = () => {
        EventBus.emit('trigger-bankruptcy');
        setIsBankruptOpen(false);
    };

    return (
        <>
            <div className="absolute left-[3vw] top-[4vh] z-10 pointer-events-auto">
                <Button
                    onClick={handleRollClick}
                    aria-label="Roll Dice"
                    className={`bg-[var(--color-black)] hover:bg-[var(--color-black)] ${bouncyButtonClass}`}
                >
                    <span className="text-5xl select-none drop-shadow-sm leading-none m-0">🎲</span>
                </Button>
            </div>

            <div className="absolute left-[10vw] top-1/2 -translate-y-1/2 flex flex-col gap-10 z-10 pointer-events-auto">
                <Button
                    onClick={handleAdministerClick}
                    title="Administrar propiedades"
                    aria-label="Administrar propiedades"
                    className={`bg-white bg-zinc-50 ${bouncyButtonClass}`}
                >
                    <img 
                        src="/icons/hotel.svg" 
                        alt="Administrar propiedades" 
                        className="w-14 h-14 select-none drop-shadow-sm" 
                        draggable="false"
                    />
                </Button>
                
                <Button
                    onClick={handleTradeClick}
                    title="Intercambiar"
                    aria-label="Intercambiar"
                    className={`bg-white hover:bg-zinc-50 ${bouncyButtonClass}`}
                >
                    <img 
                        src="/icons/handshake.svg" 
                        alt="Apretón de manos" 
                        className="w-14 h-14 select-none drop-shadow-sm" 
                        draggable="false"
                    />
                </Button>

                <Button
                    onClick={handleFinishTurnClick}
                    title="Terminar turno"
                    aria-label="Terminar turno"
                    className={`bg-white hover:bg-zinc-50 ${bouncyButtonClass}`}
                >
                    <img 
                        src="/icons/forward.svg" 
                        alt="Avanzar" 
                        className="w-14 h-14 select-none drop-shadow-sm" 
                        draggable="false"
                    />
                </Button>

                <Button
                    onClick={handleBankruptClick}
                    title="Declararse en bancarrota"
                    aria-label="Declararse en bancarrota"
                    className={`bg-white hover:bg-zinc-50 ${bouncyButtonClass}`}
                >
                    <img 
                        src="/icons/flag.svg" 
                        alt="Rendirse" 
                        className="w-14 h-14 select-none drop-shadow-sm" 
                        draggable="false"
                    />
                </Button>
            </div>

            <div className="absolute left-[3vw] bottom-[4vh] z-10 pointer-events-auto">
                <Button
                    onClick={handleSettingsClick}
                    aria-label="Ajustes"
                    className={`bg-white hover:bg-zinc-50 ${bouncyButtonClass}`}
                >
                    <img 
                        src="/icons/settings.svg" 
                        alt="Ajustes" 
                        className="w-14 h-14 select-none drop-shadow-sm" 
                        draggable="false"
                    />
                </Button>
            </div>

            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />

            <BankruptModal 
                isOpen={isBankruptOpen}
                onClose={() => setIsBankruptOpen(false)}
                onConfirm={handleConfirmBankrupt}
            />
        </>
    );
};
