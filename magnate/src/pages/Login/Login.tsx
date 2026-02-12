import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Login() {
    const navigate = useNavigate();

    // State to capture form data
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const bouncyAnimation = "transition-all duration-150 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-105 active:scale-95";

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login:', {email, password });
        navigate('/home');
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-[url(src/assets/bg_city.jpg)] bg-cover bg-center bg-no-repeat '>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-[8px]'></div>
                <div className='relative w-full max-w-xl px-4 justify-center '>
                    <img 
                        src="/src/assets/images/logo.png" 
                        alt="Logo Magnate" 
                        className="w-full h-full mb-32 object-contain" 
                    />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-2 relative flex items-center ">
                            
                            <Input className='border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full font-bold text-[22px] text-black'
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}>  
                            </Input>
                            <img 
                                src="/icons/email.svg" 
                                alt="icon" 
                                className="absolute right-4 w-10 h-10 pointer-events-none  top-1/2 -translate-y-7" 
                            />
                            
                        </div>

                        <div className="space-y-2 p-1 text-left relative flex items-center">
                            
                            <Input className='border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full font-bold text-[22px] text-black'
                                id="password"
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}>
                            </Input>
                            <img 
                                src="/icons/lock.svg" 
                                alt="icon" 
                                className="absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7 " 
                            />
                           
                        </div>
                        
                        <div className='flex justify-center p-3 w-full'>
                            <Button type="submit" variant='magnate'
                                    className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[32px] uppercase font-bold
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
