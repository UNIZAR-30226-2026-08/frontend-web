import { useState } from 'react';
import './Login.css';
import { Button } from "@/components/ui/button"

export default function Login() {
    // Estados para capturar los datos
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Maneja el envío
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login:', { email, password });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                
                <div className="login-header">
                    <h1> <b> Magnate</b></h1>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <div className="label-row">
                            <label htmlFor="email">Email</label>
                            {/* < a href="#" className="forgot-link">¿Olvidaste tu contraseña? </a> */}
                        </div>
                        <input
                            id="email"
                            type="email"
                            placeholder="example@unizar.es"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="label-row">
                            <label htmlFor="password">Contraseña</label>
                            {/* < a href="#" className="forgot-link">¿Olvidaste tu contraseña? </a> */}
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* <button type="submit" className="login-button">
                        Entrar
                    </button> */}
                    <Button type="submit" variant="secondary" size="lg" className='min-w-80'> Entrar </Button>
                </form>
            </div>
        </div>
    );
}
