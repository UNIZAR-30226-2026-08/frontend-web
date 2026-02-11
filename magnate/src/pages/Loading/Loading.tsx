import { useState } from 'react';
import ShaderLoading from '@/components/ui/shader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Loading() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-[url(@/assets/bg_city.jpg)] bg-cover bg-center bg-no-repeat relative'>
            <div className='absolute inset-0 bg-white/50 backdrop-blur-[3px]'></div>
                <Card className="relative bg-[#558b6e] w-full max-w-md shadow-[0px_10px_0px_0px_rgba(0,0,0,0.25)] border-4 rounded-[35px]">
                    <CardHeader>
                        <CardTitle className="text-5xl text-center text-[var(--color-text)] font-black">
                            TIP
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-[var(--color-text-secondary)] text-2xl">
                        Escapa de la cárcel, siempre que puedas!
                    </CardContent>
                </Card>
                <ShaderLoading> 
                </ShaderLoading>
           
        </div>
    );
}