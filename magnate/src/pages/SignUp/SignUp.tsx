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

export default function SignUp() {
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
        <div className='flex justify-center items-center min-h-screen bg-[var(--color-background)]'>
            <Card className=" bg-[var(--color-text)] w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-4xl text-center text-[var(--color-primary)]">
                        Magnate 
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {/* Username field */}
                        <div className="space-y-2 p-3 text-left">
                            <Label htmlFor="username"> Nombre de usuario </Label>
                            <Input 
                                id="username"
                                type="text"
                                placeholder="usuario123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}>  
                            </Input>
                        </div>
                        {/* Email field */}
                        <div className="space-y-2 p-3 text-left">
                            <Label htmlFor="email"> Email </Label>
                            <Input 
                                id="email"
                                type="email"
                                placeholder="example@unizar.es"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}>  
                            </Input>
                        </div>
                        {/* Password field */}
                        <div className="space-y-2 p-3 text-left">
                            <Label htmlFor="password"> Contraseña </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}>
                            </Input>
                        </div>
                        {/* Confirm password field */}
                        <div className="space-y-2 p-3 text-left">
                            <Label htmlFor="confirmPassword"> Confirmar contraseña </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}>
                            </Input>
                        </div>
                        {/* Submit button */}
                        <CardFooter className="flex-col gap-2 p-4">
                            <Button type="submit" size="lg" 
                                        className="bg-[var(--color-primary)] hover:bg-[hsl(var(--color-primary))]/80
                                        rounded-xl text-[var(--color-text)] text-lg shadow-lg"> 
                                Crear cuenta 
                            </Button>
                        </CardFooter>   

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}