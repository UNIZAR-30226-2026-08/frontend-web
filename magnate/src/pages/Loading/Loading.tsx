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
            <div className='absolute inset-0 bg-black/60 backdrop-blur-[8px]'></div>
                <ShaderLoading> 
                </ShaderLoading>
           
        </div>
    );
}