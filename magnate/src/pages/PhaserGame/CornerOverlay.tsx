import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { CornerTileContent } from '@/components/layout/CornerLayout';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';

export const CornerOverlay = () => { 
    const [propData, setPropData] = useState<any>(null);

	const { playSound } = useAudio();

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

    useEffect(() => {
        const handle = (data: any) => {
			setPropData(data);
			if (data.sound){
				playSound(data.sound);
			} else {
				console.log("no venía sonido");
			}
		}
        EventBus.on('show-corner-tile', handle);
        return () => { EventBus.off('show-corner-tile', handle); };
    }, [playSound]);

    if (!propData) {return null;}
	return ( 
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-8">
                <CornerTileContent 
                    image={propData.image}
                    tileText={propData.tileText}
                />
                <Button onClick={() => setPropData(null)} 
                        className={`px-8 py-3 bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase rounded-full ${bouncyAnimation}`}>
                            {propData.buttonText}
                </Button>
			</div>
		</div>
	);

};
