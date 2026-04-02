import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';

export const TurnInJailOverlay = () => {
    const [isOpen, setIsOpen] = useState(false); // Confirmation box is open
	const [currentTileId, setCurrentTileId] = useState("104"); // THE JailTile (should only be one, could be initialized)
	const [tileList, setTileList] = useState<any>(null);
    const [selectedTile, setSelectedTile] = useState<any>(null);

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
	const stripedBackgroundStyle = { backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)),
            repeating-linear-gradient(
                -45deg,
                #ffffff,
                #ffffff 20px,
                #f3f4f6 20px,
                #f3f4f6 40px )`,
        backgroundSize: 'cover'
    };


    useEffect(() => {
        // After dice rolling
        const handleOpen = (data: { tileList: string[] }) => {
            setTileList(data.tileList);
            setIsOpen(false);
            setSelectedTile(null);
            
            EventBus.emit('dark-mode', true); 
            EventBus.emit('start-in-jail-selection', {tileList:data.tileList}); // Light tiles in data, wait for click
        };

        const handleTileSelected = (tileData: any) => {
            if (!isOpen) {
                setSelectedTile(tileData);
				setIsOpen(true);
            }
        };

        EventBus.on('open-in-jail-overlay', handleOpen);
        EventBus.on('in-jail-tile-selected', handleTileSelected);
        
        return () => {
            EventBus.off('open-in-jail-overlay', handleOpen);
            EventBus.off('in-jail-tile-selected', handleTileSelected);
        };
    }, [isOpen]);

    // Restart tile selection, clear state
    const reOpenOverlay = () => {
        setIsOpen(false);
        setSelectedTile(null);
        
        EventBus.emit('dark-mode', true);
        EventBus.emit('start-in-jail-selection', {tileList:tileList}); // Board lights up goable tiles.
    };

    const confirmJailTurnPosition = () => {
		EventBus.emit('make-tiles-unclickable', {tileList:tileList});
        
		// If you need to change positions
        if (selectedTile.id !== currentTileId) {
			console.log("distinto");
        	EventBus.emit('execute-in-jail-travel', {
				targetId: selectedTile.id
			});
		}

		setIsOpen(false);
		setSelectedTile(null);
        setCurrentTileId(null);
        EventBus.emit('dark-mode', false);
    };

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            
            {selectedTile && (
		<div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
			<div className="w-[350px] animate-in zoom-in-95 duration-300 ease-out">
				<div
					className="rounded-[40px] flex flex-col overflow-hidden shadow-2xl border-2 border-gray-200"
					style={stripedBackgroundStyle}
				>
					<div className="flex flex-col items-center gap-8 p-10 text-center">

						<div className="space-y-2">
							<h3 className="text-2xl font-black italic uppercase text-slate-800 tracking-tighter leading-tight">
								{'Elegir posición'}
							</h3>
							<p className="text-[12px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
								{(selectedTile.id === currentTileId || tileList.length === 0) ? 'Al tercer turno se sale obligatoriamente' : 'Es posible pagar la fianza por adelantado'}
							</p>
						</div>

						<div className="flex flex-col gap-4 w-full">
							<Button
								onClick={confirmJailTurnPosition}
								className={`w-full h-[60px] bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase text-[14px] tracking-wide rounded-full shadow-lg flex items-center justify-center px-4 ${bouncyAnimation}`}
							>
								<span className="leading-tight">
									{selectedTile.id === currentTileId
										? 'Permanecer en Secretaría'
										: 'Pagar la fianza (50M)'}
								</span>
							</Button>

							{tileList.length > 0 && (<Button
								onClick={reOpenOverlay}
								className={`w-full h-[60px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[14px] tracking-wider rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`}
							>
								Elegir otra casilla
							</Button>)}
						</div>
					</div>
				</div>
			</div>
		</div>
        )}
        </div>
    );
};
