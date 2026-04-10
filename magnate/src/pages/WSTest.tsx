import { Button } from "@/components/ui/button"
import { EventBus } from '@/EventBus';
import { GameAction } from "@/services/types/socket";

export function WSTest() {
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    
	const askForGame = () => {
		EventBus.emit('public-connect');
	}; 	

	const enterGame = () => {
		EventBus.emit('enter-game');
	};	

	const sendMessage = () => {
		EventBus.emit('action-throw-dices');
	};

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
						onClick={sendMessage}
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
