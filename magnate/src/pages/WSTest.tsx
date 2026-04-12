import { Button } from "@/components/ui/button"
import { EventBus } from '@/EventBus';
import { useEffect } from "react";
import * as WSTypes from "@/services/types/socket";

export function WSTest() {
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    
	// Not exemplary
	const askForGame = () => {
		EventBus.emit('public-connect');
	}; 	

	// Not exemplary
	const enterGame = () => {
		EventBus.emit('enter-game');
	};	

	const askActionThrowDices = () => {
		EventBus.emit('action-throw-dices');
	};

	/*
	// USED FOR DEBUGGING, comment afterwards, as it serves as example 
	useEffect(() => {
		const handleReportResponseMovement = (data : WSTypes.GameResponseMovement) => {
			console.log("I correctly received response movement, here is phase: ",data.phase);
		};

		const handleReportResponseThrowDices = (data : WSTypes.GameResponseThrowDices) => {
			console.log("I correctly received response throw dices, here is phase: ",data.phase);
		};

		const handleReportResponseChooseSquare = (data : WSTypes.GameResponseMovement) => {
			console.log("I correctly received response choose square, here is phase: ",data.phase);
		};

		const handleReportActionSurrender = ( data : WSTypes.GameReportSender ) => {
			console.log("Player ",data.player," surrendered.");
		};

		EventBus.on('report-response-movement',handleReportResponseMovement);
		EventBus.on('report-response-throw-dices',handleReportResponseThrowDices);
		EventBus.on('report-response-choose-square',handleReportResponseChooseSquare);
		EventBus.on('report-action-surrender',handleReportActionSurrender);
		return () => {
			EventBus.off('report-response-movement',handleReportResponseMovement);
			EventBus.off('report-response-throw-dices',handleReportResponseThrowDices);
			EventBus.off('report-response-choose-square',handleReportResponseChooseSquare);
			EventBus.off('report-action-surrender',handleReportActionSurrender);
		};
	}, []);
	// END OF DEBUGGING 
	*/


    return (
        <div className='flex justify-center items-center min-h-screen bg-[url(src/assets/bg_city.jpg)] bg-cover bg-center bg-no-repeat '>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-[8px]'></div>
            
            <div className='relative flex flex-col items-center gap-6 p-3 w-full'>
                <Button 
						onClick={askForGame}
						variant='magnate'
                        className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[28px] uppercase font-bold h-[60px] w-[220px]
                        ${bouncyAnimation}
                        `}> 
                    Pedir juego
                </Button>
                <Button 
						onClick={enterGame}
						variant='magnate'
                        className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[28px] uppercase font-bold h-[60px] w-[220px]
                        ${bouncyAnimation}
                        `}> 
                    Entrar al juego
                </Button>
                <Button 
						onClick={askActionThrowDices}
						variant='magnate'
                        className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[28px] uppercase font-bold h-[60px] w-[220px]
                        ${bouncyAnimation}
                        `}> 
                    Mandar mensaje
                </Button>
            </div>
        </div>
    );
}
