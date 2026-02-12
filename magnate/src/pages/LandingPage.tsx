import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AuthButtonContent = ({ title, sub }) => (
  <>
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white pointer-events-none">
      <span className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
        {title}
      </span>
      {sub && (
        <span className="text-[10px] md:text-sm font-bold uppercase opacity-70 tracking-[0.3em] mt-2">
          {sub}
        </span>
      )}
    </div>
  </>
);

export function LandingPage() {
  const navigate = useNavigate();
  const backgroundImage = "src/assets/bg_city_white.jpg";
  const logoImage = "src/assets/images/logo.png";
  const bouncy = "transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-105 active:scale-95";

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] select-none">
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-background)]/60 to-[var(--color-background)]" />

      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-6xl">
        
        <div className="flex flex-col items-center w-full">
          <img 
            src={logoImage} 
            alt="MAGNATE LOGO" 
            className="w-[500px] md:w-[850px] lg:w-[1200px] max-w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          />
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-8 md:w-20 bg-white/20" />
            <p className="text-sm md:text-xl font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/40 whitespace-nowrap">
              Construye tu imperio
            </p>
            <div className="h-[2px] w-8 md:w-20 bg-white/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mt-32 md:mt-48">
          
          <div className={`relative h-28 md:h-32 overflow-hidden rounded-full border-4 border-white shadow-2xl group ${bouncy}`}>
            <Button
              onClick={() => navigate("/login")}
              className="w-full h-full p-0 bg-[var(--color-primary)] hover:bg-[var(--color-primary)] relative"
            >
              <AuthButtonContent title="Iniciar" sub="Sesión" />
            </Button>
          </div>

          <div className={`relative h-28 md:h-32 overflow-hidden rounded-full border-4 border-white shadow-2xl group ${bouncy}`}>
            <Button
              onClick={() => navigate("/signup")}
              className="w-full h-full p-0 bg-[var(--color-primary)] hover:bg-[var(--color-primary)] relative"
            >
              <AuthButtonContent title="Registrar" sub="Nuevo socio" />
            </Button>
          </div>
          
        </div>

        <div className="mt-20">
          <p className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">
            Versión 0.0.0 — 2026
          </p>
        </div>

      </div>
    </div>
  );
}
