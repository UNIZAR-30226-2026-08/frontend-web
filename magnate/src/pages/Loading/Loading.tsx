import { useState } from 'react';
import ShaderLoading from '@/components/ui/shader';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Loading() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-[repeating-linear-gradient(-45deg,#95d5b2_0px,#95d5b2_60px,#d8f3dc_60px,#d8f3dc_120px)]'>
            <Card className=" bg-[#558b6e] w-full max-w-md shadow-[0px_10px_0px_0px_rgba(0,0,0,0.25)] border-4 rounded-[35px]">
                <CardHeader>
                    <CardTitle className="text-5xl text-center text-[var(--color-text)]">
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
