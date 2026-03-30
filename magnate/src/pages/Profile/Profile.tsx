import { useState } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Coins, Hash, Users, Calendar } from "lucide-react"; // Opcional: iconos para mejorar visualmente

const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

const GAMES = [
    { posicion: 0, monedas: 380, inicio: "17/03/2026 14:30", jugadores: ["Juls", "Nic", "Cris", "mangel"], fin: "-" },
    { posicion: 1, monedas: 580, inicio: "16/03/2026 18:15", jugadores: ["Juls", "Luc", "Nau", "mangel"], fin: "16/03/2026 19:47" },
    { posicion: 2, monedas: 200, inicio: "15/03/2026 21:00", jugadores: ["Nic","Juls","Cris"], fin: "15/03/2026 22:05" },
    { posicion: 3, monedas: 90,  inicio: "14/03/2026 10:20", jugadores: ["Luc","Cris","Juls","mangel"], fin: "14/03/2026 11:15" },
    { posicion: 4, monedas: 0,   inicio: "13/03/2026 12:45", jugadores: ["Cris","Nic","Luc","Juls"], fin: "13/03/2026 13:24" },
    { posicion: 2, monedas: 0, 	 inicio: "12/03/2026 19:00", jugadores: ["mangel","Juls","Nau"], fin: "L" },
];

const STATS = { 
    "Partidas Jugadas": 30, 
    "Victorias": 17, 
    "Monedas Totales": 1245 
};

const MISKIN = {
	name: "TOKEN1",
	img: "/gorro.jpg"
};

export function Profile() {
    return (
        <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none bg-slate-50">
            <PageHeader title="Perfil" />

            <div className="flex flex-col gap-12 py-12 px-20 overflow-y-auto"
                style={{
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                    backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                    backgroundRepeat: "repeat",
                    backgroundBlendMode: "overlay",
                }}>

				{/* icono + nombre usuario + botón cambiar skin */}
				<div className="flex flex-row items-center justify-between w-full">
					<div className="w-20 h-20 flex items-center justify-center bg-slate-100/90 rounded-full group-hover:bg-white transition-colors shrink-0">
                       <img src={MISKIN.img} alt={MISKIN.name} 
                       className={`w-12 h-12 object-contain drop-shadow-sm transition-transform 'group-hover:scale-110' `} />
                   </div>
                   
                   <div className="text-center">
                       <h3 className="font-black text-[15px] text-black tracking-tight leading-none mb-1">
                           Juls
                       </h3>
                   </div>

                   <Button 
                       onClick={() => changeSkin()}
                       className={`h-8 font-black uppercase text-[10px] rounded-full transition-all text-[12px] bg-[var(--color-primary)] text-white ${bouncyAnimation}`}>
                       Cambiar skin predeterminado
                   </Button>

				</div>


                {/* SECCIÓN STATS */}
                <StatsSection 
                    title="Estadísticas de partidas" 
                    stats={STATS} 
                />

                {/* SECCIÓN HISTORIAL */}
                <GameHistSection 
                    title="Historial de partidas" 
                    items={GAMES} 
                />
            </div>
        </div>
    );
}

function changeSkin() {
	return; //TODO levantar Carousel etc
}
function StatsSection({ title, stats }: any) {
    return (
        <div className="flex flex-col gap-3 min-h-0">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
                    {title}
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200/50 rounded-full"/>
            </div>

            <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                    {Object.entries(stats).map(([key, value]: any, index) => (
                        <CarouselItem key={index} className="pl-2 md:basis-1/3 lg:basis-1/3">
                            <Card className="bg-white border-2 border-slate-300 rounded-[30px] overflow-hidden shadow-sm">
                                <CardContent className="flex flex-col items-center p-8">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                        {key}
                                    </span>
                                    <span className="text-[25px] font-black italic text-[var(--color-primary)]">
                                        {value}
                                    </span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

function GameHistSection({ title, items }: any) {
    const navButton = `
        border-slate-200 
        text-[var(--color-primary)] 
        transition-all 
        duration-150 
        hover:bg-[var(--color-primary)]
        hover:border-[var(--color-primary)]/30 
        active:bg-[var(--color-primary)] 
        active:border-[var(--color-primary)] 
        active:text-white 
        active:scale-95
    `;

    return (
        <div className="flex flex-col gap-3 min-h-0">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
                    {title}
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200/50 rounded-full"/>
            </div>

            <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                    {items.map((game: any, index: number) => (
                        <CarouselItem key={index} className="pl-2 md:basis-1/4 lg:basis-1/4">
                            <Card className="bg-white border-2 border-slate-300 rounded-[30px] overflow-hidden group hover:border-[var(--color-primary)]/50 transition-all">
                                <CardContent className="flex flex-col p-6 gap-4">
                                    
                                    {/* Cabecera de la Partida */}
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fecha e Inicio</span>
                                            <span className="text-[12px] font-black text-slate-700">{game.inicio}</span>
                                        </div>
                                        <div className="bg-slate-100 px-3 py-1 rounded-full">
                                            <span className="text-[var(--color-primary)] font-black italic text-sm">#{game.posicion===0 ? "EN PAUSA#" : game.posicion}</span>
                                        </div>
                                    </div>

                                    {/* Players list */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
                                            <Users size={12} /> Jugadores
                                        </span>
                                        <div className="bg-slate-50 rounded-2xl h-28 p-3 flex flex-col gap-1">
                                            {game.jugadores.map((player: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <span className="font-black text-[var(--color-primary)] w-4 text-[10px]">{idx + 1}.</span>
                                                    <span className="font-bold text-slate-600 truncate">{player}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recompensa */}
                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        <div className="flex items-center gap-1">
                                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                                <Coins size={14} className="text-white" />
                                            </div>
                                            <span className="font-black text-slate-800 text-lg">{game.monedas}</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-slate-300 italic">Fin: {game.fin}</span>
                                    </div>

                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className={`-left-12 ${navButton}`} />
                <CarouselNext className={`-right-12 ${navButton}`} />
            </Carousel>
        </div>
    );
}
