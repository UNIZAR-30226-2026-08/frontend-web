import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const navigate = useNavigate();
  const backgroundImage = "src/assets/bg_city_white.jpg";

  const mainButtonEffect = `
    transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-[0px_12px_20px_rgba(0,0,0,0.15),0px_8px_0px_0px_rgba(0,0,0,0.1)]
    hover:border-white hover:ring-4 hover:ring-white/20
    active:translate-y-[4px] active:shadow-none active:ring-0
  `;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] select-none">
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 animate-pulse"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-background)]/60 to-[var(--color-background)]" />

      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-6xl">
        
        <div className="mb-20 text-center">
          <h1 className="text-[10rem] md:text-[16rem] font-[900] uppercase italic tracking-tighter leading-none text-white drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
            MAGNATE
          </h1>
          <div className="flex items-center justify-center gap-4 -mt-4 md:-mt-8">
            <div className="h-[2px] w-12 md:w-24 bg-white/20" />
            <p className="text-lg md:text-2xl font-bold uppercase tracking-[0.6em] text-white/40">
              Construye tu imperio
            </p>
            <div className="h-[2px] w-12 md:w-24 bg-white/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          
          <Button
            onClick={() => navigate("/login")}
            className={`
              ${mainButtonEffect}
              group relative h-24 md:h-32 p-0 overflow-hidden
              rounded-[2rem] border-4 border-white
              shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)]
              bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white
            `}
          >
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-white">Iniciar</span>
              <span className="text-xl font-bold uppercase opacity-60 tracking-[0.3em] mt-2">Sesión</span>
            </div>
          </Button>

          <Button
            onClick={() => navigate("/signup")}
            className={`
              ${mainButtonEffect}
              group relative h-24 md:h-32 p-0 overflow-hidden
              rounded-[2rem] border-4 border-white
              shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)]
              bg-[var(--color-aux)] hover:bg-[var(--color-aux)] text-white
            `}
          >
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-white">Registrarse</span>
              <span className="text-xl font-bold uppercase opacity-60 tracking-[0.3em] mt-2">Nuevo socio</span>
            </div>
          </Button>
          
        </div>

        <div className="mt-20">
          <p className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em] animate-bounce">
            Versión 0.0.0 — 2026
          </p>
        </div>

      </div>
    </div>
  );
}
