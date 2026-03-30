import React, { useState, useEffect } from 'react';
import { EventBus } from '@/EventBus';

export const SecretaryAnimation = () => {
    const [isActive, setIsActive] = useState(false);
    const [windowClosed, setWindowClosed] = useState(false);

    useEffect(() => {
        const handlePlayAnimation = () => {
            setIsActive(true);
            setWindowClosed(false);

            setTimeout(() => {
                setWindowClosed(true);
            }, 2000);

            setTimeout(() => {
                setIsActive(false);
                EventBus.emit('close-overlay'); 
                EventBus.emit('secretary-animation-complete'); 
            }, 6000);
        };

        EventBus.on('play-secretary-animation', handlePlayAnimation);

        return () => {
            EventBus.off('play-secretary-animation', handlePlayAnimation);
        };
    }, []);

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
            <div 
                className="relative w-[1920px] h-[1080px] shrink-0 bg-stone-200 overflow-hidden flex flex-col justify-end shadow-2xl origin-center"
                style={{
                    transform: 'scale(min(calc(100vw / 1920), calc(100vh / 1080)))'
                }}
            >
                <div className="absolute inset-0 z-10 opacity-80">
                    <div className="absolute inset-0 bg-stone-200"></div>

                    <div className="absolute bottom-[30%] left-24 w-64 h-[500px] flex flex-col bg-stone-400 border-[6px] border-stone-500 shadow-2xl z-10">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex-1 border-b-[6px] border-stone-500 flex items-center justify-center bg-stone-300 relative">
                                <div className="w-24 h-6 bg-stone-500 rounded-sm shadow-inner relative">
                                    <div className="absolute -right-8 top-0 w-6 h-6 bg-white border-2 border-stone-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-24 left-[35%] w-[600px] h-[300px] bg-yellow-700/80 border-[16px] border-amber-900 shadow-xl flex flex-wrap gap-8 p-8 z-10">
                        <div className="w-20 h-20 bg-yellow-200 shadow-md transform rotate-3"></div>
                        <div className="w-24 h-20 bg-pink-300 shadow-md transform -rotate-6 mt-4"></div>
                        <div className="w-20 h-24 bg-blue-200 shadow-md transform rotate-12 ml-12"></div>
                        <div className="w-16 h-16 bg-green-200 shadow-md transform -rotate-2"></div>
                        <div className="w-20 h-20 bg-yellow-200 shadow-md transform rotate-6 mt-8"></div>
                    </div>

                    <div className="absolute top-24 right-48 w-48 h-48 bg-white border-[12px] border-stone-800 rounded-full flex items-center justify-center shadow-2xl z-10">
                        <div className="absolute top-2 w-2 h-6 bg-stone-800"></div>
                        <div className="absolute bottom-2 w-2 h-6 bg-stone-800"></div>
                        <div className="absolute left-2 w-6 h-2 bg-stone-800"></div>
                        <div className="absolute right-2 w-6 h-2 bg-stone-800"></div>
                        <div className="absolute top-1/2 left-1/2 w-2 h-16 bg-stone-900 origin-bottom -translate-x-1/2 -translate-y-full rotate-45 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-3 h-10 bg-black origin-bottom -translate-x-1/2 -translate-y-full rotate-[-30deg] rounded-full"></div>
                        <div className="absolute w-4 h-4 bg-red-600 rounded-full z-10"></div>
                    </div>

                    <div className="absolute bottom-[28%] right-24 w-[950px] h-8 bg-amber-800 border-b-8 border-amber-950 shadow-2xl z-10 rounded-sm"></div>

                    <div className="absolute bottom-[calc(28%+32px)] right-32 flex gap-16 items-end z-20">
                        <div className="flex flex-col items-center">
                            <div className="w-72 h-48 bg-zinc-900 border-[12px] border-zinc-700 rounded-xl flex items-center justify-center shadow-xl">
                                <div className="w-full h-full bg-blue-900/40 p-4 flex flex-col gap-2 overflow-hidden">
                                    <div className="w-1/2 h-3 bg-blue-400/50 rounded"></div>
                                    <div className="w-3/4 h-3 bg-blue-400/50 rounded"></div>
                                    <div className="w-2/3 h-3 bg-blue-400/50 rounded"></div>
                                    <div className="w-full h-3 bg-blue-400/30 rounded mt-4"></div>
                                </div>
                            </div>
                            <div className="w-12 h-16 bg-zinc-600"></div>
                            <div className="w-40 h-4 bg-zinc-700 rounded-t-lg"></div>
                        </div>

                        <div className="flex flex-col items-center relative mb-1">
                            <div className="w-24 h-32 bg-green-700 rounded-full -mb-16 shadow-lg rotate-12"></div>
                            <div className="w-20 h-24 bg-green-600 rounded-full -mb-12 mr-16 shadow-lg -rotate-12"></div>
                            <div className="w-16 h-20 bg-green-800 rounded-full -mb-12 ml-12 shadow-lg rotate-6"></div>
                            <div className="w-20 h-20 bg-orange-800 border-t-8 border-orange-900 rounded-b-2xl"></div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-72 h-48 bg-zinc-900 border-[12px] border-zinc-700 rounded-xl shadow-xl flex items-center justify-center">
                                <div className="w-full h-full bg-black"></div>
                            </div>
                            <div className="w-12 h-16 bg-zinc-600"></div>
                            <div className="w-40 h-4 bg-zinc-700 rounded-t-lg"></div>
                        </div>
                    </div>
                </div>

                <div className={`absolute top-0 left-0 w-full h-full bg-sky-300/30 backdrop-blur-md border-r-[12px] border-sky-200/50 shadow-[inset_-10px_0_30px_rgba(255,255,255,0.2)] transition-transform duration-700 ease-in-out z-20 ${
                    windowClosed ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div className="absolute top-0 left-1/4 w-[200px] h-full bg-white/10 skew-x-[20deg] pointer-events-none"></div>
                    
                    <div className={`flex h-full items-center justify-center pb-[12%] transition-opacity duration-500 delay-500 relative z-30 ${windowClosed ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="text-red-500 font-bold text-9xl tracking-widest bg-black/60 px-12 py-6 rounded-xl transform -rotate-12 shadow-2xl border-4 border-red-500/30">
                            CERRADA
                        </span>
                    </div>
                </div>

                <div className="w-full h-[30%] bg-gradient-to-b from-amber-400 to-amber-600 border-t-[16px] border-amber-500 z-30 flex justify-center pt-12 shadow-[0_-15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden shrink-0">
                    <div 
                        className="absolute inset-0 opacity-10 pointer-events-none" 
                        style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,1) 4px, rgba(0,0,0,1) 8px)' }}
                    ></div>
                    
                    <div className="text-amber-950 font-bold font-mono text-8xl tracking-widest drop-shadow-sm relative z-10">
                        SECRETARÍA
                    </div>
                </div>
            </div>
        </div>
    );
};
