import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { GameModeCard } from "./GameModeCard";

export function GameMode() {
  const [selectedMode, setSelectedMode] = useState(null);
  
  const gridImageUrl = "src/assets/bg_city_white.jpg";
  const newGameUrl = "src/assets/bg_city_white.jpg";
  const loadGameUrl = "src/assets/bg_city_white.jpg";
  
  const lastSave = { date: "08/02/2026", time: "14:30" };

  const gridButtonEffect = `
    transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-[0px_12px_20px_rgba(0,0,0,0.15),0px_8px_0px_0px_rgba(0,0,0,0.1)]
    hover:border-white hover:ring-4 hover:ring-white/20
    active:translate-y-[4px] active:shadow-none active:ring-0
  `;

  const modes = [
    { title: "Un jugador", sub: "Individual", pos: "0% 0%", iconUrl: "/icons/single_player.svg" },
    { title: "Multijugador", sub: "Online", pos: "100% 0%", iconUrl: "/icons/online.svg" },
    { title: "Multijugador", sub: "Con amigos", pos: "0% 100%", iconUrl: "/icons/multi_player.svg" },
    { title: "Partida Local", sub: "Con IA", pos: "100% 100%", iconUrl: "/icons/ia.svg" },
  ];

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none">
      <PageHeader title="Modo de juego" />

      <div
        className="grid grid-cols-2 grid-rows-2 gap-10 py-10 px-10"
        style={{
          height: "calc(100vh - var(--header-height))",
          marginTop: "var(--header-height)",
          backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
          backgroundRepeat: "repeat",
          backgroundBlendMode: "overlay",
        }}
      >
        {modes.map((mode, index) => (
          <Button
            key={index}
            onClick={() => setSelectedMode(mode)}
            className={`
              ${gridButtonEffect}
              group relative w-full h-full p-0 overflow-hidden
              rounded-[2rem] border-4 border-white
              shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)]
              bg-zinc-200
            `}
          >
            <div 
              className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-110 pointer-events-none"
              style={{
                backgroundImage: `url(${gridImageUrl})`,
                backgroundSize: "200% 200%",
                backgroundPosition: mode.pos,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            
            <img
              src={mode.iconUrl}
              alt=""
              className="absolute right-10 top-10 w-20 h-20 object-contain transition-all duration-500 z-10 opacity-50 group-hover:opacity-100 group-hover:scale-110 pointer-events-none"
              style={{ filter: "brightness(0) invert(1)" }}
            />

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 text-white pointer-events-none">
              <span className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                {mode.title}
              </span>
              <span className="text-xl font-bold uppercase opacity-60 tracking-[0.3em] mt-2">
                {mode.sub}
              </span>
            </div>
          </Button>
        ))}
      </div>

      {selectedMode && (
        <GameModeCard 
          title={selectedMode.title}
          lastSave={lastSave}
          newGameImage={newGameUrl}
          loadGameImage={loadGameUrl}
          onBack={() => setSelectedMode(null)}
          onNewGame={() => console.log("New Game Started")}
          onLoadGame={() => console.log("Game Loaded")}
        />
      )}
    </div>
  );
}
