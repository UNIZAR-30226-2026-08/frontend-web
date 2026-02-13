import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"

const ModeContent = ({ mode }: { mode: any }) => (
  <>
    <div
      className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-110 pointer-events-none"
      style={{
        backgroundSize: "200% 200%",
        backgroundPosition: mode.pos,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent pointer-events-none" />
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 px-6 text-white pointer-events-none">
        <span className="text-5xl font-black uppercase italic tracking-tighter leading-none">
            {mode.title}
        </span>
        {mode.sub && (
            <span className="text-sm font-bold uppercase opacity-60 tracking-[0.3em] mt-2 whitespace-normal leading-tight">
                {mode.sub}
             </span>
        )}
    </div>
  </>
);


export function PrivateRoom () {
    
    const backgroundImageUrls = {
        join: "/src/assets/images/join.png", 
        host: "/src/assets/images/host.png",
    };
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    const modes = [
        { id: 'join', title: "Unirse", sub: "Introduce el código y únete a la sala", pos: "0% 0%", imageUrl: backgroundImageUrls.join },
        { id: 'host', title: "Crear", sub: "Crea una sala para que se unan tus amigos", pos: "100% 0%", imageUrl: backgroundImageUrls.host },
    ]
    const [activeMode, setActiveMode ] = useState<string | null>(null);
    const [displayedImage, setDisplayedImage] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<string>('');

    const handleButtonClick = (modeId : string) => {
        setActiveMode(modeId);

        if (modeId === 'join') {
            setDisplayedImage(backgroundImageUrls.join);
        } else if (modeId === 'host') {
            setDisplayedImage(backgroundImageUrls.host);
        }
    }

    return (
        <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none">
            <PageHeader title="Selecciona el modo" />
    
            <div className="grid grid-cols-1 grid-rows-1 gap-10 py-10 px-10 flex justify-items-center "
                style={{
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                    backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                    backgroundRepeat: "repeat",
                    backgroundBlendMode: "overlay",
                }}>
                
                 <div className="grid grid-cols-2 gap-4 h-[200px] w-[750px] items-center mt-3">
                    {modes.map((mode) => (
                        <div
                            key={mode.id}
                            className={`
                                relative w-full h-full overflow-hidden
                                rounded-[7rem] border-4 
                                flex items-center justify-center
                                ${activeMode === mode.id ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-400 text-gray-800 scale-90 z-0 grayscale' }
                                ${bouncyAnimation}
                            `}>
                            <Button 
                                onClick={() => handleButtonClick(mode.id)}
                                className={`
                                    w-full h-full p-0 
                                    hover:bg-opacity-80 transition-all duration-200
                                    ${activeMode === mode.id ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-400 text-gray-800'}
                                `}>
                                <ModeContent mode={mode} />
                            </Button>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-center mb-18">
                    {displayedImage && (
                        <img 
                            src={displayedImage} 
                            alt="Modo seleccionado" 
                            className="w-[1000px] h-full"
                        />
                    )}
                </div>

                <div className="w-full flex flex-col items-center gap-6 mb-4">
                    {activeMode === 'join' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <Input                 
                                id="room-code"
                                placeholder="1234567890" 
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                className="w-[200px] h-16 text-center text-[22px] font-bold border-[5px] 
                                border-[var(--color-bordes)] text-black select-text relative z-50"
                            />
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        variant='magnate'
                        disabled={!activeMode}
                        className={`
                            text-[var(--color-text)] text-[32px] uppercase font-bold w-[250px]
                            ${bouncyAnimation}
                            ${!activeMode ? 'bg-zinc-300 opacity-50' : 'bg-[var(--color-primary)] shadow-2xl'}
                        `}> 
                        Confirmar
                    </Button>
                </div>
                
            </div>
        </div>

    );

}