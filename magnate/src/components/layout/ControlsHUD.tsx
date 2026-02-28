import { EventBus } from '@/EventBus';

export const ControlsHUD = () => {
    const handleRollClick = () => {
        EventBus.emit('trigger-dice-roll');
    };

    return (
        <div className="absolute left-[3vw] bottom-[4vh] z-10 pointer-events-auto">
            <button
                onClick={handleRollClick}
                aria-label="Roll Dice"
                className="bg-[var(--color-black)] hover:bg-[var(--color-black)] rounded-full flex items-center
                           justify-center w-20 h-20 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] 
                           transform-gpu transition-transform duration-200 ease-in-out hover:scale-110 border-none cursor-pointer"
            >
                <span className="text-4xl select-none">🎲</span>
            </button>
        </div>
    );
};
