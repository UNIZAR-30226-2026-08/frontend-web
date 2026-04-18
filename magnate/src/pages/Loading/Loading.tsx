import { useEffect, useState } from 'react';
import ShaderLoading from '@/components/ui/shader';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { EventBus } from '@/EventBus';

interface LoadingProps {
    onBack?: () => void;
}

export function Loading({ onBack }: LoadingProps) {
    const navigate = useNavigate();

	useEffect(() => {
		const handleEnterGame = () => {
			navigate('/phaser-game');
		};
		EventBus.emit('handle-public-connect');
		EventBus.on('you-may-now-enter-the-game', handleEnterGame);

		return () => {
			EventBus.off('you-may-now-enter-the-game', handleEnterGame);
			//EventBus.emit('handle-public-cancel');
		}
	}, [navigate]);

    return (
        <div className='flex justify-center items-center min-h-screen bg-[url(@/assets/bg_city.jpg)] bg-cover bg-center bg-no-repeat relative'>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-[8px]'></div>
                <div className="absolute top-8 left-8 z-50"> 
                    <Button
                        variant="ghost"
                        onClick={onBack || (() => navigate(-1))}
                        aria-label="Go back"
                        sound="button_back"
                       className="z-60 bg-[var(--color-black)] hover:bg-[var(--color-black)] rounded-full flex items-center justify-center ml-2 w-20 h-20 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] transform-gpu transition-transform duration-200 ease-in-out hover:scale-110"
                    >
                       <img
                            src="/icons/back-arrow1.svg"
                            className="w-12 h-12 sm:w-16 sm:h-16 block select-none"
                            alt="Back"
                         />
                    </Button>
                </div>
            <div className='relative z-10 flex flex-col items-center justify-center min-h-screen'>
                <img 
                    src="/src/assets/images/logo.png" 
                    alt="Logo" 
                    className="w-full max-w-2xl h-auto" 
                />
                <div className="flex flex-row text-white/80 text-2xl font-black uppercase italic tracking-[0.2em] mt-8 bg-black/20 
                                px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    <ShaderLoading 
                        text="ESPERANDO JUGADORES..." 
                        size={22} 
                        jump={6} 
                        color="var(--color-text)"
                        delayOffset={0}
                    />
                </div> 
             
            </div>
        </div>
    );
}
