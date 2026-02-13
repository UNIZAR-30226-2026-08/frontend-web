import { useState } from 'react';
import ShaderLoading from '@/components/ui/shader';


export function Loading() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-[url(@/assets/bg_city.jpg)] bg-cover bg-center bg-no-repeat relative'>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-[8px]'></div>
            
            <div className='relative z-10 flex flex-col items-center justify-center min-h-screen'>
                <img 
                    src="/src/assets/images/logo.png" 
                    alt="Logo" 
                    className="w-full max-w-2xl h-auto" 
                />
                <div className="flex flex-row text-white/80 text-2xl font-black uppercase italic tracking-[0.2em] mt-8 bg-black/20 
                                px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    <ShaderLoading 
                        text="ESPERANDO JUGADORES..." 
                        size={22} 
                        jump={6} 
                        color="var(--color-text)"
                        delayOffset={0}
                    />
                </div> 
             
            </div>
        </div>
    );
}