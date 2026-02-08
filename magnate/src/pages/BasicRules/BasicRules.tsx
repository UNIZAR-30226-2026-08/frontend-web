import { useState } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function BasicRules() {
    const RULES = [
        { title: "Reserva de Emergencia" , desc : "Nunca gastes todo tu dinero. Mantén siempre reserva para rentas inesperadas y oportunidades." },
        { title: "Naranjas y Rojas" , desc : "Las propiedades naranjas y rojas son las más rentables. Tienen alta probabilidad de caída y excelente retorno." },
        { title: "Monopolio Rápido" , desc : "Es mejor tener un grupo completo de propiedades baratas con casas que una propiedad cara sin nada." },
        { title: "" , desc : "" },
        { title: "" , desc : "" }
    ];

    return (
        <div className='flex justify-center items-center min-h-screen bg-[var(--text-background)] px-4'>
            <PageHeader title="Reglas básicas" />
                <Carousel className="w-full max-w-md">
                    <CarouselContent>
                        {RULES.map((rule, index) => (
                            <CarouselItem key={index}>
                                <div>
                                    <Card className="relative bg-[var(--color-primary)] w-full border-4 border-[var(--color-text)] rounded-[35px]">
                                        <CardContent className="flex flex-col aspect-square items-center justify-center p-8 gap-4">
                                            
                                            <div className="absolute top-8 text-6xl font-extrabold text-white/50 select-none">
                                                TIP {index + 1}
                                            </div>
                                            
                                            <h3 className="text-3xl font-bold text-white text-center mt-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                                                {rule.title}
                                            </h3>
                                            
                                            <p className="text-white/80 text-center text-lg leading-relaxed">
                                                {rule.desc}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        )) }
                    </CarouselContent>
                    
                    <CarouselPrevious/>
                    <CarouselNext />
                </Carousel>     
        </div>
    );
}