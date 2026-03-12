import { SoundId } from '@/context/AudioContext';

interface CornerData {
    image: string;
	tileText: string;  // Es responsabilidad del main que esto cuadre, creo
	sound : SoundId;
}

export const CornerTileContent = ({ image, tileText, sound }:  CornerData ) => {
	return ( 
		<div className="relative w-[380px] h-[380px] flex items-center justify-center border border-neutral-300 bg-[var(--color-text)]">
        	<div className="flex flex-col items-center">
        		<img src={image} alt="tile icon" className="w-[300px] object-contain mb-4" />
				<span className="absolute bottom-2 text md:text-3xl font-bold mt-2 text-[var(--color-black)]"> 
					{tileText} 
				</span> 
        	</div>
		</div>
    );
}; 
