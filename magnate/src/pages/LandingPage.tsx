import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/context/AudioContext";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import logoImg from '@/assets/images/logo.png';
import bgCity from '@/assets/bg_city.jpg';

const AuthButton = ({ title, sub, onClick }: { title: string; sub?: string; onClick: () => void }) => (
  <Button
    onClick={onClick}
    className="group relative w-full md:w-[400px] h-24 md:h-32 rounded-full border-4 border-white shadow-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 p-0"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
      <span className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none drop-shadow-md">
        {title}
      </span>
      {sub && (
        <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/80 mt-1 md:mt-2">
          {sub}
        </span>
      )}
    </div>
  </Button>
);

export function LandingPage() {
  const navigate = useNavigate();
  const { changeMusic } = useAudio();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      changeMusic('bg_menu', 1000);
    }
  }, [isAuthenticated, navigate, changeMusic]);

  if (isAuthenticated) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[var(--color-background)] select-none overflow-hidden">
      
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{  backgroundImage: `url(${bgCity})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-background)]/80 to-[var(--color-background)]" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl px-4">
        
        <div className="flex flex-col items-center w-full">
          <img
            src={logoImg}
            alt="MAGNATE LOGO"
            className="w-[90%] max-w-[500px] md:max-w-[850px] lg:max-w-[1000px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          />
          <div className="flex items-center justify-center gap-4 mt-8 w-full">
            <div className="h-[2px] w-12 md:w-24 bg-white/20" />
            <p className="text-sm md:text-xl font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/40 whitespace-nowrap">
              Construye tu imperio
            </p>
            <div className="h-[2px] w-12 md:w-24 bg-white/20" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full mt-20 md:mt-32">
          <AuthButton
            title="Iniciar"
            sub="Sesión"
            onClick={() => navigate("/login")}
          />
          <AuthButton
            title="Registrar"
            sub="Nuevo socio"
            onClick={() => navigate("/signup")}
          />
        </div>

        <div className="mt-20 md:mt-32">
          <p className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">
            Versión 0.0.0 — 2026
          </p>
        </div>

      </div>
    </div>
  );
}
