import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from '@/api/authServices';
import { useAuth } from '@/context/AuthContext';

interface SignUpProps {
    onBack?: () => void;
}

export function SignUp({ onBack }: SignUpProps) {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null); 

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const uInput = usernameRef.current;
        const pInput = passwordRef.current;
        const cInput = confirmPasswordRef.current;
        
        // --- Contraseña Insegura ---
        if (password.length < 8) { // Mínimo 8 caracteres
            if (pInput) {
                pInput.setCustomValidity("La contraseña debe tener al menos 8 caracteres.");
                pInput.reportValidity();
            }
            return;
        }
        if (/^\d+$/.test(password)) { // No pueden ser todo números
            if (pInput) {
                pInput.setCustomValidity("La contraseña no puede ser completamente numérica.");
                pInput.reportValidity();
            }
            return;
        }
         // --- Contraseñas no coinciden ---
        if (password !== confirmPassword) {
            if (cInput) {
                cInput.setCustomValidity("Las contraseñas no coinciden");
                cInput.reportValidity();
            }
            return;
        }

        const email = `${Math.random().toString(36).slice(2,10)}@example.com`; // TODO: el backend tiene que quitar lo del email

        registerUser(
            { username, email, password, password2: confirmPassword },
            (data : any) => {
                if (data && data.tokens) {
                    login(data.tokens.access, data.tokens.refresh);
                }
                navigate('/home');
            },
            (errorMessage : string) => {
                if (uInput) {
                    uInput.setCustomValidity(errorMessage);
                    uInput.reportValidity();
                }
            }
        );
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-[url(src/assets/bg_city.jpg)] bg-cover bg-center bg-no-repeat '>
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
                    src="/src/assets/images/logo.png" 
                    alt="Logo Magnate" 
                    className="w-full h-full mb-28 object-contain" 
                />
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="space-y-2 relative flex items-center ">
                        <Input 
                            ref={usernameRef}
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
                                if (usernameRef.current) usernameRef.current.setCustomValidity("");
                            }}
                        />
                        <img src="/icons/single_player.svg" alt="icon" className="absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7" />
                    </div>

                    <div className="space-y-2 p-1 text-left relative flex items-center">
                        <Input 
                            ref={passwordRef}
                            required
                            className='border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full text-[22px] font-bold text-black'
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordRef.current) passwordRef.current.setCustomValidity(""); 
                            }}
                        />
                        <img src="/icons/lock.svg" alt="icon" className="absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7 " />
                    </div>

                    <div className="space-y-2 p-1 text-left relative flex items-center">
                        <Input 
                            ref={confirmPasswordRef}
                            required
                            className='border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full text-[22px] font-bold text-black'
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (confirmPasswordRef.current) confirmPasswordRef.current.setCustomValidity("");
                            }}
                        />
                        <img src="/icons/key.svg" alt="icon" className="absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7 " />
                    </div>
                    
                    <div className='flex justify-center p-3 w-full'>
                        <Button type="submit" variant='magnate'
                                className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[28px] uppercase font-bold h-[0px] w-[250px] ${bouncyAnimation}`}> 
                            Registrarse
                        </Button>
                    </div>
                </form>
            </div>
        </div>
   );
}
