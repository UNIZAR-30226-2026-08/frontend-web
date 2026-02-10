import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export function Login() {
    // State to capture form data
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login:', {email, password });
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-[url(src/assets/bg_city.jpg)] bg-cover bg-center bg-no-repeat '>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-[8px]'></div>
                <div className='relative w-full max-w-xl px-4 justify-center '>
                    <img 
                        src="/src/assets/logo.png" 
                        alt="Logo Magnate" 
                        className="w-full h-full mb-32 object-contain" 
                    />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-2 p-1 text-left relative flex item-center">
                            
                            <Input className='border-[5px] h-12 pr-14 placeholder:text-[var(--color-placeholder)] placeholder:font-bold  placeholder:text-[22px] border-[var(--color-bordes)] w-full'
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}>  
                            </Input>
                            <img 
                                src="/icons/single_player.svg" 
                                alt="icon" 
                                className="absolute right-4 w-8 h-8 pointer-events-none mt-2 mr-2" 
                            />
                            
                        </div>

                        <div className="space-y-2 p-1 text-left relative flex item-center">
                            
                            <Input className='border-[5px] h-12 pr-14 placeholder:text-[var(--color-placeholder)] placeholder:font-bold  placeholder:text-[22px] border-[var(--color-bordes)] w-full'
                                id="password"
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}>
                            </Input>

                            <img 
                                src="/icons/lock.svg" 
                                alt="icon" 
                                className="absolute right-4 w-8 h-8 pointer-events-none mt-2 mr-2" 
                            />
                           
                        </div>
                        
                        <div className='flex justify-center p-6'>
                            <Button type="submit" 
                                    className="bg-[var(--color-primary)] rounded-full text-[var(--color-text)] text-[22px] font-bold h-14 w-40"> 
                            ENTRAR
                        </Button>
                        </div>

                    </form>
                </div>
        </div>
    );
}
