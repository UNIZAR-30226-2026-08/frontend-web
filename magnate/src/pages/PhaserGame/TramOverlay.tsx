import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';

export const TramOverlay = () => {
    // ESTADOS DEL OVERLAY
    const [isOpen, setIsOpen] = useState(false);
    const [currentTileId, setCurrentTileId] = useState<string | null>(null); 
    const [selectedTram, setSelectedTram] = useState<any>(null); 

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

	const { playSound } = useAudio();

    useEffect(() => {
        // From CornerOverlay if click on "Gestionar Desplazamiento"
        const handleOpen = (data: { currentTileId: string }) => {
            setCurrentTileId(data.currentTileId);
            setIsOpen(false);
            setSelectedTram(null);
            
            EventBus.emit('dark-mode', true); 
            EventBus.emit('start-tram-selection'); // light board and wait for click
        };

        const handleTramSelected = (tileData: any) => {
			playSound('tram_bell');
			console.log("entré a handleTramSelected");
            if (!isOpen) {
				console.log("no está open");
                setSelectedTram(tileData);
				setIsOpen(true);
            }
        };

        EventBus.on('open-tram-overlay', handleOpen);
        EventBus.on('tram-tile-selected', handleTramSelected);
        
        return () => {
            EventBus.off('open-tram-overlay', handleOpen);
            EventBus.off('tram-tile-selected', handleTramSelected);
        };
    }, [isOpen, playSound]);

    // Restart tile selection
    const reOpenOverlay = () => {
        setIsOpen(false);
        setSelectedTram(null);
        
        EventBus.emit('dark-mode', true); 
        EventBus.emit('start-tram-selection'); // light tiles and wait for click
    };

    const confirmTramTravel = () => {
		console.log("dentro de tram travel");
        const cost = (selectedTram.id === currentTileId) ? 0 : 30;
		console.log(selectedTram.id)
        
        EventBus.emit('execute-tram-travel', {
			targetId: selectedTram.id, 
            cost: cost 
		});
        
		setIsOpen(false);
		setSelectedTram(null);
        setCurrentTileId(null);
        EventBus.emit('dark-mode', false);
    };

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            
        {selectedTram && (
            <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
                <div className="w-[350px] animate-in zoom-in-95 duration-300 ease-out">
                    <div
                        className="rounded-[40px] flex flex-col overflow-hidden shadow-2xl border-2 border-gray-200"
                        style={stripedBackgroundStyle} >
                        <div className="flex flex-col items-center gap-8 p-10 text-center">

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black italic uppercase text-slate-800 tracking-tighter leading-tight">
                                    {'Estación de tranvía'}
                                </h3>
                                <p className="text-[12px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
                                    {selectedTram.id === currentTileId 
                                        ? `Tu estación actual: ${selectedTram.subText}` 
                                        : `Destino: ${selectedTram.subText}`}
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                <Button
                                    onClick={confirmTramTravel}
                                    className={`w-full h-[50px] bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase text-[14px] tracking-wide rounded-full shadow-lg flex items-center justify-center px-4 ${bouncyAnimation}`} >
                                    <div className="flex flex-col items-center leading-tight">
                                        <span>
                                            {selectedTram.id === currentTileId
                                                ? 'Permanecer aquí'
                                                : 'Cambiar de estación'}
                                        </span>
                                        {selectedTram.id !== currentTileId && (
                                            <span className="text-[12px] opacity-80 font-bold tracking-tighter">
                                                Coste: 30M
                                            </span>
                                        )}
                                    </div>
                                </Button>

                                <Button
                                    onClick={reOpenOverlay}
                                    className={`w-full h-[40px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[14px] tracking-wider rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`}>
                                    Elegir otra estación
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};
