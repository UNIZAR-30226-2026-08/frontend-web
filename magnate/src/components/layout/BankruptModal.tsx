import React from 'react';
import { Button } from "@/components/ui/button";

interface BankruptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const BankruptModal = ({ isOpen, onClose, onConfirm }: BankruptModalProps) => {
    if (!isOpen) return null;

    const bouncyAnimation = "transition-all duration-150 ease-in-out hover:scale-105 active:scale-95";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">
                        ¿ESTÁS SEGURO?
                    </h2>
                    <p className="text-white/60 font-bold uppercase tracking-[0.3em] mt-4">
                        Perderás todo y quedarás fuera de la partida.
                    </p>
                </div>

                <div className="flex flex-col gap-6 w-full px-8">
                    <div className={`relative h-28 overflow-hidden rounded-full border-4 border-red-500 shadow-2xl group bg-red-600 ${bouncyAnimation}`}>
                        <Button
                            onClick={onConfirm}
                            className="w-full h-full p-0 bg-transparent hover:bg-red-700 relative flex flex-col items-center justify-center"
                        >
                            <span className="text-4xl font-black uppercase italic tracking-tighter text-white">
                                SÍ, RENDIRME
                            </span>
                            <span className="text-[14px] font-bold uppercase opacity-70 tracking-[0.3em] text-white">
                                Declararse en bancarrota
                            </span>
                        </Button>
                    </div>

                    <div className={`relative h-28 overflow-hidden rounded-full border-4 border-white/20 shadow-xl group bg-zinc-900 ${bouncyAnimation}`}>
                        <Button
                            onClick={onClose}
                            className="w-full h-full p-0 bg-transparent hover:bg-zinc-800 relative flex items-center justify-center"
                        >
                            <span className="text-4xl font-black uppercase italic tracking-tighter text-white/80">
                                CONTINUAR JUGANDO
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
