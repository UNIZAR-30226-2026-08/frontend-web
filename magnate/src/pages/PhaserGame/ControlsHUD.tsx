import React, { useState, useEffect } from 'react';
import { EventBus } from '@/EventBus';
import { SettingsModal } from '@/components/layout/SettingsModal';
import { BankruptModal } from '@/components/layout/BankruptModal';
import { Button } from "@/components/ui/button";

export const ControlsHUD = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isBankruptOpen, setIsBankruptOpen] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [isDark, setIsDark] = useState(false); // Para oscurecer botones
    const [isHidden, setIsHidden] = useState(false);

    const [canRoll, setCanRoll] = useState(true);
    const [canAdminister, setCanAdminister] = useState(true);
    const [canTrade, setCanTrade] = useState(true);
    const [canFinishTurn, setCanFinishTurn] = useState(false);
    const [canBankrupt, setCanBankrupt] = useState(true);

    useEffect(() => {
        const handleUpdateControls = (states: { 
            roll?: boolean, 
            administer?: boolean, 
            trade?: boolean, 
            finishTurn?: boolean, 
            bankrupt?: boolean 
        }) => {
            if (states.roll !== undefined) setCanRoll(states.roll);
            if (states.administer !== undefined) setCanAdminister(states.administer);
            if (states.trade !== undefined) setCanTrade(states.trade);
            if (states.finishTurn !== undefined) setCanFinishTurn(states.finishTurn);
            if (states.bankrupt !== undefined) setCanBankrupt(states.bankrupt);
        };

        // Para oscurecer/aclarar botones
        const handleDarkMode = (active: boolean = true) => setIsDark(active);
        EventBus.on('dark-mode', handleDarkMode);

        const handleRollComplete = () => {
            setIsRolling(false);
        };

        const handleHide = () => setIsHidden(true);
        const handleShow = () => setIsHidden(false);

        EventBus.on('update-controls-state', handleUpdateControls);
        EventBus.on('dice-roll-complete', handleRollComplete);
        EventBus.on('hide-controls-hud', handleHide);
        EventBus.on('show-controls-hud', handleShow);

        return () => {
            EventBus.off('dark-mode', handleDarkMode);
            EventBus.off('update-controls-state', handleUpdateControls);
            EventBus.off('dice-roll-complete', handleRollComplete);
            EventBus.off('hide-controls-hud', handleHide);
            EventBus.off('show-controls-hud', handleShow);
        };
    }, []);

    const bouncyButtonClass = "rounded-full flex items-center justify-center w-24 h-24 p-0 shadow-[0px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[4px] border-none cursor-pointer transform-gpu transition-all duration-150 ease-in-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-[4px] disabled:grayscale";

    const darkButton = isDark 
        ? "opacity-70 pointer-events-none scale-95" 
        : "opacity-100 pointer-events-auto scale-100";

    const slideTransition = `transform-gpu transition-all duration-500 ease-in-out ${isHidden ? '-translate-x-[20vw] opacity-0 pointer-events-none' : 'translate-x-0'}`;

    const handleRollClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsRolling(true);
        EventBus.emit('trigger-dice-roll');
        e.currentTarget.blur();
    };

    const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsSettingsOpen(true);
        e.currentTarget.blur();
    };

    const handleAdministerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        const playerPropertyIds = ["001", "008", "013"]; // TODO: propertys del jugador que pulsa 
        EventBus.emit('open-property-selection-mode', playerPropertyIds);
    };

    const handleTradeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        EventBus.emit('dark-mode', true);
        EventBus.emit('set-hud-clickable', true);
        EventBus.emit('start-selection-mode');
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
            {!isRolling && (
                <div className={`absolute left-[3vw] top-[11vh] z-10 pointer-events-auto ${darkButton} ${slideTransition}`}>
                    <Button
                        onClick={handleRollClick}
                        disabled={!canRoll || isDark}
                        aria-label="Roll Dice"
                        className={`bg-white hover:bg-zinc-50 ${bouncyButtonClass}`}
                    >
                        <img 
                            src="/icons/dice.svg" 
                            alt="Tirar dados" 
                            className="w-14 h-14 select-none drop-shadow-sm" 
                            draggable="false"
                        />
                    </Button>
                </div>
            )}

            <div className={`absolute left-[10vw] top-1/2 -translate-y-1/2 flex flex-col gap-10 z-10 pointer-events-auto ${darkButton} ${slideTransition}`}>
                <Button
                    onClick={handleAdministerClick}
                    disabled={!canAdminister || isDark}
                    title="Administrar propiedades"
                    aria-label="Administrar propiedades"
                    className={`bg-white hover:bg-zinc-50 ${bouncyButtonClass}`}
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
                    disabled={!canTrade || isDark}
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
                    disabled={!canFinishTurn || isDark}
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
                    disabled={!canBankrupt || isDark}
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

            <div className={`absolute left-[3vw] bottom-[11vh] z-10 pointer-events-auto ${darkButton} ${slideTransition}`}>
                <Button
                    onClick={handleSettingsClick}
                    disabled={isDark}
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
