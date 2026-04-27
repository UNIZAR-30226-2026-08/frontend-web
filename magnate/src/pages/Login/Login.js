import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// @ts-ignore 
import { loginUser } from '@/api/authServices';
import { useAuth } from '@/context/AuthContext';
export function Login({ onBack }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser({ username, password }, (data) => {
            if (data && data.tokens && data.user && data.user.pk) {
                login(data.tokens.access, data.tokens.refresh, String(data.user.pk));
            }
            navigate('/home');
        }, 
        // (error : any) => {
        //     const pInput = passwordRef.current;
        //     if (pInput) {
        //         pInput.setCustomValidity("Usuario o contraseña incorrectos");
        //         pInput.reportValidity();
        //     }
        // }
        (errorMessage) => {
            const pInput = passwordRef.current;
            if (pInput) {
                pInput.setCustomValidity(errorMessage);
                pInput.reportValidity();
            }
        });
    };
    return (_jsxs("div", { className: 'flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat', style: { backgroundImage: "url('/images/bg_city.jpg')" }, children: [_jsx("div", { className: 'absolute inset-0 bg-black/60 backdrop-blur-[8px]' }), _jsx("div", { className: "absolute top-8 left-8 z-50", children: _jsx(Button, { variant: "ghost", onClick: onBack || (() => navigate('/')), "aria-label": "Go back", sound: "button_back", className: "z-60 bg-[var(--color-black)] hover:bg-[var(--color-black)] rounded-full flex items-center justify-center ml-2 w-20 h-20 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] transform-gpu transition-transform duration-200 ease-in-out hover:scale-110", children: _jsx("img", { src: "/icons/back-arrow1.svg", className: "w-12 h-12 sm:w-16 sm:h-16 block select-none", alt: "Back" }) }) }), _jsxs("div", { className: 'relative w-full max-w-xl px-4 justify-center ', children: [_jsx("img", { src: "/images/logo.png", alt: "Logo Magnate", className: "w-full h-full mb-28" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2 relative flex items-center ", children: [_jsx(Input, { ref: usernameRef, required: true, onInvalid: (e) => {
                                            const target = e.target;
                                            if (target.validity.valueMissing) {
                                                target.setCustomValidity("El nombre de usuario es obligatorio");
                                            }
                                        }, className: 'border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full font-bold text-[22px] text-black', id: "username", type: "text", placeholder: "Nombre de usuario", value: username, onChange: (e) => {
                                            setUsername(e.target.value);
                                            if (usernameRef.current)
                                                usernameRef.current.setCustomValidity(""); // Limpiar error
                                        } }), _jsx("img", { src: "/icons/single_player.svg", alt: "icon", className: "absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7" })] }), _jsxs("div", { className: "space-y-2 p-1 text-left relative flex items-center", children: [_jsx(Input, { ref: passwordRef, required: true, onInvalid: (e) => {
                                            const target = e.target;
                                            if (target.validity.valueMissing) {
                                                target.setCustomValidity("La contraseña es obligatoria");
                                            }
                                        }, className: 'border-[5px] h-14 px-8 border-[var(--color-bordes)] w-full font-bold text-[22px] text-black', id: "password", type: "password", placeholder: "Contrase\u00F1a", value: password, onChange: (e) => {
                                            setPassword(e.target.value);
                                            if (passwordRef.current)
                                                passwordRef.current.setCustomValidity(""); // clean input
                                        } }), _jsx("img", { src: "/icons/lock.svg", alt: "icon", className: "absolute right-4 w-10 h-10 pointer-events-none top-1/2 -translate-y-7 " })] }), _jsx("div", { className: 'flex justify-center p-3 w-full', children: _jsx(Button, { type: "submit", variant: 'magnate', className: `bg-[var(--color-primary)] text-[var(--color-text)] text-[28px] uppercase font-bold h-[0px] w-[190px]
                                ${bouncyAnimation}
                                `, children: "Entrar" }) })] })] })] }));
}
