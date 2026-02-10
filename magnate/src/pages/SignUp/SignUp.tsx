import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SignUp() {
    // State to capture form data
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        console.log('Registro:', {username, email, password});
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
                        
                        <div className="space-y-2 relative flex items-center ">
                            
                            <Input className='border-[5px] h-14 px-8 border-[var(--color-bordes)]
                                w-full font-bold text-[22px] text-black'
                                id="username"
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}> 
                            </Input>
                            <img 
                                src="/icons/single_player.svg" 
                                alt="icon" 
                                className="absolute right-4 w-10 h-10 pointer-events-none  top-1/2 -translate-y-7" 
                            />
                            
                        </div>

                        <div className="space-y-2 relative flex items-center ">
                            
                            <Input className='border-[5px] h-14 px-8 border-[var(--color-bordes)]
                            w-full text-[22px] font-bold text-black'
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
                            
                            <Input className='border-[5px] h-14 px-8 border-[var(--color-bordes)]
                            w-full text-[22px] font-bold text-black'
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

                        <div className="space-y-2 p-1 text-left relative flex items-center">
                            
                            <Input className='border-[5px] h-14 px-8 border-[var(--color-bordes)]
                            w-full text-[22px] font-bold text-black'
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}>
                            </Input>
                            <img 
                                src="/icons/key.svg" 
                                alt="icon" 
                                className="absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7 " 
                            />
                           
                        </div>
                        
                        <div className='flex justify-center p-3 w-full'>
                            <Button type="submit" variant='magnate'
                                    className="bg-[var(--color-primary)] text-[var(--color-text)] text-[32px] uppercase font-bold h-[0px] w-[250px] 
                                    transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                                    hover:scale-110 active:scale-90 active:rotate-0 "> 
                                Registrarse
                            </Button>
                        </div>
                    </form>
                </div>
        </div>
   );
}
