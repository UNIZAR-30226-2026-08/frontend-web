import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

const ModeContent = ({ mode, gridImageUrl }) => (
  <>
    <div
      className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-110 pointer-events-none"
      style={{
        backgroundImage: `url(${gridImageUrl})`,
        backgroundSize: "200% 200%",
        backgroundPosition: mode.pos,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 text-white pointer-events-none">
        <span className="text-5xl font-black uppercase italic tracking-tighter leading-none">
            {mode.title}
        </span>
        {mode.sub && (
            <span className="text-xl font-bold uppercase opacity-60 tracking-[0.3em] mt-2">
                {mode.sub}
             </span>
        )}
    </div>
  </>
);

export function Lobby() {
    const gridImageUrl = "src/assets/bg_city_white.jpg";

    const players = [
        { title: "usuario1", pos: "0% 0%" },
        { title: "usuario2", pos: "100% 0%"},
        { title: "usuario3", pos: "0% 100%"},
        // { title: "usuario4", sub: "Amarillo", pos: "0% 100%"},
    ];

    const lobbySlots = Array.from({ length: 4 }, (_, i) => players[i] || null);

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none">
        <PageHeader title="Lobby" />

        <div className="grid grid-cols-1 grid-rows-1 gap-10 py-10 px-10"
            style={{
                height: "calc(100vh - var(--header-height))",
                marginTop: "var(--header-height)",
                backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                backgroundRepeat: "repeat",
                backgroundBlendMode: "overlay",
            }}>
    
            <div className="grid grid-cols-4 gap-5 h-[300px] items-center mt-28">
                {lobbySlots.map((slot, index) => (
                    <div
                        key={index}
                        className={`
                            relative w-full h-full overflow-hidden
                            rounded-[7rem] border-4 
                            flex items-center justify-center
                            ${slot ? 'border-solid border-white shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)] bg-zinc-200' : 'bg-zinc-100/90 border-dashed'}
                        `}
                    >
                        {slot ? (
                            // Hay jugador
                            <Button className="w-full h-full p-0 bg-transparent hover:bg-transparent">
                                <ModeContent mode={slot} gridImageUrl={gridImageUrl} />
                            </Button>
                        ) : (
                            // No hay jugador
                            <div className="flex flex-col items-center opacity-30">
                                <div className="w-12 h-12 border-4 border-zinc-400 rounded-full border-t-transparent animate-spin mb-4" />
                                <span className="font-bold uppercase tracking-widest text-zinc-500">Esperando...</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center gap-2 my-8">
                    <span className="text-zinc-500 uppercase font-bold tracking-widest text-sm">
                        Código de la sala
                    </span>
                    <h1 className="text-5xl font-black tracking-tighter text-[var(--color-primary)] drop-shadow-sm">
                        1234567890
                    </h1>
                </div>
            <div className='flex justify-center p-3 w-full'>
                <Button type="submit" variant='magnate'
                        className="bg-[var(--color-primary)] text-[var(--color-text)] text-[32px] uppercase font-bold w-[350px]
                        transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                        hover:scale-110 active:scale-90 active:rotate-0 "> 
                    Comenzar juego
                </Button>
            </div>
        </div>
    </div>
  );
}
