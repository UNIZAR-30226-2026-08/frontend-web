import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from "react-router-dom";
import { SettingsModal } from "@/components/layout/SettingsModal";
import { useAudio } from "@/context/AudioContext";
// @ts-ignore
import { fetchActiveGame } from '@/api/userServices';

const ModeContent = ({ mode, gridImageUrl }: { mode: { title: string, sub?: string, pos: string, iconUrl: string }, gridImageUrl: string }) => (
  <>
    <div className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-110 pointer-events-none"
      style={{
        backgroundImage: `url(${gridImageUrl})`,
        backgroundSize: "200% 200%",
        backgroundPosition: mode.pos,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
    <img src={mode.iconUrl}
      alt=""
      className="absolute right-10 top-10 w-16 h-16 object-contain transition-all duration-500 z-10 opacity-50 group-hover:opacity-100 group-hover:scale-110 pointer-events-none"
      style={{ filter: "brightness(0) invert(1)" }}
    />
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

export function Home() {
  const navigate = useNavigate();
  const { changeMusic } = useAudio();
  const { token } = useAuth();
  const gridImageUrl = "/images/bg_city_white.jpg";
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    if (token) {
        fetchActiveGame(token, (data: any) => {
          setActiveGame(data);
          console.log("Partida activa cargada:", data);
        });
    }
  }, []);

  useEffect(() => {
    changeMusic('bg_menu', 1000);
  }, [changeMusic]);

  const gridButtonEffect = `
    transition-all duration-300 ease-out
    hover:scale-105 hover:z-50
    hover:-translate-y-2 hover:shadow-[0px_12px_20px_rgba(0,0,0,0.15),0px_8px_0px_0px_rgba(0,0,0,0.1)]
    hover:border-white hover:ring-4 hover:ring-white/20
    active:translate-y-[4px] active:shadow-none active:ring-0
  `;

  const modes = [
    { title: "Partida pública", sub: "Construye tu imperio", pos: "0% 0%", iconUrl: "/icons/online.svg", path: '/loading' },
    { title: "Partida privada", sub: "Compite con tus amigos", pos: "0% 0%", iconUrl: "/icons/gamepad.svg", path: '/private-room' },
    { title: "Tienda", sub: "Compra de cosméticos", pos: "0% 100%", iconUrl: "/icons/shop.svg", path: '/shop' },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden select-none flex flex-col"
      style={{
        height: "100vh",
        backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
        backgroundRepeat: "repeat",
        backgroundBlendMode: "overlay",
      }}>

      <div className="flex items-center justify-between px-12 py-6 z-10 flex-shrink-0">
        <img
          src="/images/logo.png"
          alt="Logo Magnate"
          className="w-[600px] h-auto object-contain"
        />
        <div className="p-8 flex justify-end items-center gap-4">
          <Button
            size="icon"
            onClick={() => navigate("/basic-rules")}
            className="bg-[var(--color-background)] hover:bg-zinc-900 rounded-full flex items-center justify-center w-16 h-16 shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <img src="/icons/lightbulb.svg" className="w-9 h-9" alt="tips" />
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/profile")}
            className="bg-[var(--color-background)] hover:bg-zinc-800 rounded-full text-white font-bold text-lg px-7 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 h-16 flex items-center gap-2"
          >
            <img src="/icons/user-white.svg" className="w-9 h-9" alt="White" />
            Perfil
          </Button>
          <Button
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="bg-[var(--color-background)] hover:bg-zinc-900 rounded-full flex items-center justify-center w-16 h-16 shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <img src="/icons/gear-white.svg" className="w-9 h-9" alt="Settings" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full h-full pb-12 overflow-hidden flex items-center justify-center pt-4">
        <div className="grid grid-cols-2 gap-8 w-full max-w-[1700px] h-full max-h-[850px] pl-16 mx-auto">
          {/* Jugar */}
          <div className="flex flex-col gap-8 justify-center items-end w-full h-full">
            {modes.slice(0, 2).map((mode, index) => (
              <Button
                key={index}
                onClick={() => navigate(mode.path)}
                className={`
                  ${gridButtonEffect}
                  group relative 
                  w-full flex-1 
                  p-0 overflow-hidden
                  rounded-[5rem] border-4 border-white
                  shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)]
                  bg-zinc-200
                `}>
                <ModeContent mode={mode} gridImageUrl={gridImageUrl} />
              </Button>
            ))}
          </div>

          {/* Tienda */}
          <div className="flex flex-col gap-8 justify-center items-start w-full h-full py-16 pr-8">
            {modes.slice(2, 3).map((mode, index) => (
              <Button
                key={index}
                onClick={() => navigate(mode.path)}
                className={`
                  ${gridButtonEffect}
                  group relative 
                  w-[95%] h-[60%]
                  p-0 overflow-hidden
                  rounded-[5rem] border-4 border-white
                  shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)]
                  bg-zinc-200
                `}>
                <ModeContent mode={mode} gridImageUrl={gridImageUrl} />
              </Button>
            ))}
          </div>
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
