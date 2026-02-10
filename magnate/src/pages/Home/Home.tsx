import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    <img
        src={mode.iconUrl}
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
    const gridImageUrl = "src/assets/bg_city_white.jpg";

    const gridButtonEffect = `
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-[0px_12px_20px_rgba(0,0,0,0.15),0px_8px_0px_0px_rgba(0,0,0,0.1)]
        hover:border-white hover:ring-4 hover:ring-white/20
        active:translate-y-[4px] active:shadow-none active:ring-0
  `;
    const modes = [
        { title: "Jugar", sub: "Construye tu imperio", pos: "0% 0%", iconUrl: "/icons/gamepad.svg" },
        { title: "Amigos", sub: "Gestiona tu red", pos: "100% 0%", iconUrl: "/icons/multi_player.svg" },
        { title: "Tienda", sub: "Compra de cosméticos", pos: "0% 100%", iconUrl: "/icons/shop.svg" },
    ];
    return (
        <div className="relative h-screen w-full overflow-hidden select-none flex flex-col"
            style={{
                height: "100vh",
                backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                backgroundRepeat: "repeat",
                backgroundBlendMode: "overlay",
            }}>

            <div className="flex items-center justify-between px-12 py-6 z-10">
                <img 
                    src="/src/assets/logo.png" 
                    alt="Logo Magnate" 
                    className="w-[700px] h-auto object-contain" 
                />
                <div className="p-8 flex justify-end items-center gap-4 " >
                    <Button 
                        size="lg" 
                        className=" bg-[var(--color-background)]
                            hover:bg-[var(--color-background)]-800 
                            rounded-full text-white font-bold text-lg px-7
                            shadow-lg hover:shadow-xl
                            hover:-translate-y-0.5
                            active:translate-y-0
                            transition-all duration-200
                            h-14 flex items-center gap-2
                        "> 
                        <img src="/icons/user-white.svg" className="w-9 h-9" alt="White"/>
                        Perfil
                    </Button>
                    <Button 
                        size="icon" 
                        className="
                            bg-[var(--color-background)] hover:bg-zinc-900 rounded-full flex items-center justify-center w-14 h-14 shadow-xl 
                            hover:-translate-y-0.5
                            active:translate-y-0
                            transition-all duration-200
                        " > 
                        <img src="/icons/gear-white.svg" className="w-6 h-6" alt="Back" />
                    </Button>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-10 px-20 pb-16 h-full"> 
                {/* Jugar */}
                <div className="flex items-center justify-center w-full h-full">
                    <Button
                        onClick={() => navigate("/game-mode")}
                        className={`
                            ${gridButtonEffect}
                            group relative w-full h-[70%] p-0 overflow-hidden
                            rounded-[7rem] border-4 border-white
                            shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)]
                            bg-zinc-200
                        `}
                    >
                        <ModeContent mode={modes[0]} gridImageUrl={gridImageUrl} />
                    </Button>
                </div>    
                    {/* Amigos y Tienda  */}        
                <div className="flex flex-col gap-10 justify-center h-full">
                    {modes.slice(1).map((mode, index) => (
                        <Button
                        key={index}
                        onClick={() => navigate(`/${mode.title.toLowerCase()}`)}
                        className={`
                            ${gridButtonEffect}
                            group relative w-full h-full p-0 overflow-hidden
                            rounded-[7rem] border-4 border-white
                            shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)]
                            bg-zinc-200
                        `}
                        >
                        <ModeContent mode={mode} gridImageUrl={gridImageUrl} />
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}