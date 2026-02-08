import { Button } from "@/components/ui/button";

export function GameModeCard({ 
  title, 
  lastSave, 
  newGameImage, 
  loadGameImage, 
  onBack, 
  onNewGame, 
  onLoadGame 
}) {
  const cardButtonEffect = `
    transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-[0px_12px_20px_rgba(0,0,0,0.15),0px_8px_0px_0px_rgba(0,0,0,0.1)]
    hover:border-white hover:ring-4 hover:ring-white/20
    active:translate-y-[4px] active:shadow-none active:ring-0
  `;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-500 select-none"
      onClick={onBack}
    >
      <div 
        className="w-[90%] max-w-5xl rounded-[3rem] border-4 border-white shadow-[0_25px_60_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-300 overflow-hidden"
        style={{
          backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
          backgroundRepeat: "repeat",
          backgroundBlendMode: "overlay",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-32 border-b-4 border-white bg-[var(--color-primary)] flex items-center justify-center overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="modal-header-pattern" width="60" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
                <image href="/icons/money.svg" width="50" height="50" preserveAspectRatio="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modal-header-pattern)" />
          </svg>
          <h2 className="relative z-10 text-6xl font-extrabold tracking-tight uppercase italic pointer-events-none">
            {title}
          </h2>
        </div>

        <div className="p-12">
          <div className="grid grid-cols-2 gap-10 h-80">
            <Button 
              onClick={onNewGame}
              className={`${cardButtonEffect} group relative h-full rounded-[2rem] border-4 border-white overflow-hidden p-0 flex flex-col items-center justify-center`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                style={{ backgroundImage: `url(${newGameImage})` }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10 flex flex-col items-center text-white">
                <span className="text-6xl font-black uppercase italic tracking-tighter leading-none">Nueva</span>
                <span className="text-xl font-bold uppercase opacity-60 tracking-[0.3em] mt-2">Partida</span>
              </div>
            </Button>

            <Button 
              onClick={onLoadGame}
              className={`${cardButtonEffect} group relative h-full rounded-[2rem] border-4 border-white overflow-hidden p-0 flex flex-col items-center justify-center`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale-[0.5] brightness-[0.4] transition-transform duration-500 group-hover:scale-110" 
                style={{ backgroundImage: `url(${loadGameImage})` }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
              <div className="relative z-10 flex flex-col items-center text-white">
                <span className="text-6xl font-black uppercase italic tracking-tighter leading-none">Cargar</span>
                <span className="text-xl font-bold uppercase opacity-60 tracking-[0.3em] mt-2">Progreso</span>
                
                <div className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <p className="text-[11px] uppercase tracking-widest opacity-40 font-black mb-1 text-center">Última partida</p>
                  <p className="text-sm font-mono tracking-tighter italic">{lastSave.date} — {lastSave.time}</p>
                </div>
              </div>
            </Button>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={onBack} 
              className="text-zinc-400 hover:text-zinc-900 font-black uppercase text-xs tracking-[0.5em] transition-all duration-300 hover:scale-110 transform-gpu"
            >
              ← VOLVER AL MENÚ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
