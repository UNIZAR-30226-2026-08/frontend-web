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
        <div className='flex justify-center items-center min-h-screen bg-[var(--color-background)]'>
            <Card className=" bg-[var(--color-text)] w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-4xl text-center text-[var(--color-primary)]">
                        Magnate 
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>

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
                        <CardFooter className="flex-col gap-2 p-6">
                            <Button type="submit" size="lg" 
                                        className="bg-[var(--color-primary)] hover:bg-[hsl(var(--color-primary))]/80
                                        rounded-xl text-[var(--color-text)] text-lg"> 
                                Entrar 
                            </Button>
                        </CardFooter>   

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
