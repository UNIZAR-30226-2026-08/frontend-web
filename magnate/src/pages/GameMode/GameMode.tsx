import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/PageHeader"

export function GameMode() {
  const imageUrl = "src/assets/bg_city_white.jpg";

  const buttonBaseClass = `
    group relative w-full h-full p-0 overflow-hidden
    rounded-2xl border-4 border-white
    shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)]
    hover:scale-105 transition-all duration-300 
    bg-no-repeat flex flex-col items-stretch
  `;

  const modes = [
    { title: "Un jugador", pos: "0% 0%", iconUrl: "/icons/single_player.svg" },
    { title: "Multijugador online", pos: "100% 0%", iconUrl: "/icons/online.svg" },
    { title: "Multijugador con amigos", pos: "0% 100%", iconUrl: "/icons/multi_player.svg" },
    { title: "Partida local con IA", pos: "100% 100%", iconUrl: "/icons/ia.svg" },
  ];

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat">
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
            className={buttonBaseClass}
            style={{ 
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: '200% 200%',
                backgroundPosition: mode.pos 
            }}
          >
            <div className="flex-grow" />

            <img 
              src={mode.iconUrl} 
              alt="" 
              className="absolute right-6 bottom-20 w-28 h-28 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110 z-10"
              style={{
                filter: "brightness(0) invert(0.5) opacity(0.6)"
              }}
            />

            <div className="w-full bg-black/80 py-5 text-center text-white backdrop-blur-md border-t border-white/10 z-20">
              <span className="text-2xl font-bold uppercase tracking-wider">
                {mode.title}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
