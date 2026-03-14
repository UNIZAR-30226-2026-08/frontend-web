import React, { useState } from 'react';
import { EventBus } from '@/EventBus';
import { SettingsModal } from '@/components/layout/SettingsModal';
import { Button } from "@/components/ui/button";

export const ControlsHUD = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const bouncyAnimation = "transition-all duration-150 ease-in-out hover:scale-110 active:scale-95 hover:bg-[var(--color-black)]";

    const handleRollClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        EventBus.emit('trigger-dice-roll');
        e.currentTarget.blur();
    };

    const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsSettingsOpen(true);
        e.currentTarget.blur();
    };

    return (
        <>
            <div className="absolute left-[3vw] top-[4vh] z-10 pointer-events-auto">
                <Button
                    variant="ghost"
                    onClick={handleRollClick}
                    aria-label="Roll Dice"
                    className={`bg-[var(--color-black)] rounded-full flex items-center justify-center w-24 h-24 p-0 shadow-[0px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[4px] border-none cursor-pointer transform-gpu ${bouncyAnimation}`}
                >
                    <span className="text-5xl select-none drop-shadow-sm leading-none m-0">🎲</span>
                </Button>
            </div>

            <div className="absolute left-[3vw] bottom-[4vh] z-10 pointer-events-auto">
                <Button
                    variant="ghost"
                    onClick={handleSettingsClick}
                    aria-label="Settings"
                    className={`bg-white hover:bg-white rounded-full flex items-center justify-center w-24 h-24 p-0 shadow-[0px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[4px] border-none cursor-pointer transform-gpu transition-all duration-150 ease-in-out hover:scale-110 active:scale-95`}
                >
                    <img 
                        src="/icons/settings.svg" 
                        alt="Settings" 
                        className="w-14 h-14 select-none drop-shadow-sm" 
                        draggable="false"
                    />
                </Button>
            </div>

            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />
        </>
    );
};
