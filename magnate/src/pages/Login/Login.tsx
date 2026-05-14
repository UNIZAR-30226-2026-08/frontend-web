import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// @ts-ignore 
import { loginUser } from '@/api/authServices';
import { useAuth } from '@/context/AuthContext';
import { useAudio } from '@/context/AudioContext';
import { useEffect } from 'react';
import { EventBus } from '@/EventBus';
// @ts-ignore 
import { fetchActiveGame } from '@/api/userServices';


interface LoginProps {
    onBack?: () => void;
}

export function Login({ onBack }: LoginProps) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { changeMusic } = useAudio();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

	const [activeGame, setActiveGame] = useState(null);
	
	useEffect(() => {
	  const handleEnterGame = () => {
	  	navigate('/phaser-game');
	  };
	  EventBus.on('you-may-now-enter-the-game', handleEnterGame);
	}, [navigate]);


    useEffect(() => {
        changeMusic('bg_menu', 1000);
    }, [changeMusic]);

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        loginUser(
            { username, password },
            (data : any) => {
                if (data && data.tokens && data.user && data.user.pk) {
                    login(data.tokens.access, data.tokens.refresh, String(data.user.pk));
                }
				if(data.tokens.access) {
					fetchActiveGame(data.tokens.access, (res: any) => {
	        			setActiveGame(res);
	  	  				if (res.active_game !== null) { 
                            console.log("Reconectando a partida:", res.active_game);
                            EventBus.emit('you-may-now-enter-the-game');
                            setTimeout(() => {
                                EventBus.emit('handle-enter-game', res.active_game);
                            }, 100);
                        } else {
                            navigate('/home');
                        }
	      			});
				}             
			},
            // (error : any) => {
            //     const pInput = passwordRef.current;
            //     if (pInput) {
            //         pInput.setCustomValidity("Usuario o contraseña incorrectos");
            //         pInput.reportValidity();
            //     }
            // }
            (errorMessage : string) => {
                const pInput = passwordRef.current;
                if (pInput) {
                    pInput.setCustomValidity(errorMessage);
                    pInput.reportValidity();
                }
            }
        );
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: "url('/images/bg_city.jpg')" }}>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-[8px]'></div>
            <div className="absolute top-8 left-8 z-50"> 
                    <Button
                        variant="ghost"
                        onClick={onBack || (() => navigate('/'))}
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
            <div className='relative w-full max-w-xl px-4 justify-center '>
                <img 
                    src="/images/logo.png"
                    alt="Logo Magnate" 
                    className="w-full h-full mb-28" 
                />
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="space-y-2 relative flex items-center ">
                        <Input 
                            ref={usernameRef} // Conexión
                            required
                            onInvalid={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.validity.valueMissing) {
                                    target.setCustomValidity("El nombre de usuario es obligatorio");
                                }
                            }}
                            className='border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full font-bold text-[22px] text-black'
                            id="username"
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (usernameRef.current) usernameRef.current.setCustomValidity(""); // Limpiar error
                            }}
                        />
                        <img 
                            src="/icons/single_player.svg" 
                            alt="icon" 
                            className="absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7" 
                        />
                    </div>

                    <div className="space-y-2 p-1 text-left relative flex items-center">
                        <Input 
                            ref={passwordRef} // Conexión
                            required
                            onInvalid={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.validity.valueMissing) {
                                    target.setCustomValidity("La contraseña es obligatoria");
                                }
                            }}
                            className='border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full font-bold text-[22px] text-black'
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordRef.current) passwordRef.current.setCustomValidity(""); // clean input
                            }}
                        />
                        <img 
                            src="/icons/lock.svg" 
                            alt="icon" 
                            className="absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7 " 
                        />
                    </div>
                    
                    <div className='flex justify-center p-3 w-full'>
                        <Button type="submit" variant='magnate'
                                className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[28px] uppercase font-bold h-[0px] w-[190px]
                                ${bouncyAnimation}
                                `}> 
                            Entrar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
