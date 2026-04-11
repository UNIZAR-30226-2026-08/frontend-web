import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from '@/api/authServices';
import { useAuth } from '@/context/AuthContext';

export function SignUp() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null); 
    const usuariosRegistrados = ["yaexisto"]; // Mantenido por si es para tests/ejemplos

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const uInput = usernameRef.current;
        const cInput = confirmPasswordRef.current;

        if (usuariosRegistrados.includes(username.toLowerCase())) {
            if (uInput) {
                uInput.setCustomValidity("Este nombre de usuario ya está en uso");
                uInput.reportValidity();
            }
            return;
        }

        if (password !== confirmPassword) {
            if (cInput) {
                cInput.setCustomValidity("Las contraseñas no coinciden");
                cInput.reportValidity();
            }
            return;
        }

        const email = "estoesunplaceholder@gmail.com";

        registerUser(
            { username, email, password, password2: confirmPassword },
            (data) => {
                if (data && data.tokens) {
                    login(data.tokens.access, data.tokens.refresh);
                }
                navigate('/home');
            },
            (error) => {
                console.error(error);
            }
        );
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-[url(src/assets/bg_city.jpg)] bg-cover bg-center bg-no-repeat '>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-[8px]'></div>
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
                            required
                            className='border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full text-[22px] font-bold text-black'
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
