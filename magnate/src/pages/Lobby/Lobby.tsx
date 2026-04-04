import { useState } from "react";
import { useNavigate } from 'react-router-dom';
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
    </div>
  </>
);

export function Lobby() {
    const gridImageUrl = "src/assets/bg_city_white.jpg";
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
	const navigate = useNavigate();

    const players = [
        { title: "usuario1", pos: "0% 0%", isBot:false },
        { title: "usuario2", pos: "100% 0%", isBot: false},
        // { title: "usuario3", pos: "0% 100%"},
        // { title: "usuario4", sub: "Amarillo", pos: "0% 100%"},
    ];

    const [lobbyPlayers, setLobbyPlayers] = useState(players);

    const addBot = (index : number) => {
        if (lobbyPlayers[index]) return;

        const newBot = { title: `bot ${index + 1}`, pos: "0% 100%", isBot:true };
        const newPlayers = [...lobbyPlayers];
        newPlayers[index] = newBot;
        setLobbyPlayers(newPlayers);
    }
    const removeBot = (index : number) => {
        const newPlayers = [...lobbyPlayers];
        newPlayers[index] = null;
        setLobbyPlayers(newPlayers); 
    }

    const lobbySlots = Array.from({ length: 4 }, (_, i) => lobbyPlayers[i] || null);

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
                            rounded-[7rem] border-4  group
                            flex items-center justify-center
                            ${slot ? 'border-solid border-white shadow-[0px_6px_0px_0px_rgba(0,0,0,0.15)] bg-zinc-200' : 'bg-zinc-100/90 border-dashed'}
                        `} >
                        {slot ? (
                            <>
                                <Button className="w-full h-full p-0 bg-transparent hover:bg-transparent cursor-default">
                                    <ModeContent mode={slot} gridImageUrl={gridImageUrl} />
                                </Button>
                                
                                {slot.isBot && ( 
                                    <Button
                                        onClick={() => removeBot(index)}
                                        className="absolute flex items-center justify-center opacity-0 group-hover:opacity-100
                                        transition-opacity duration-300 cursor-pointer"
                                    >
                                        <span className="text-zinc-300 text-6xl font-light hover:text-white transition-colors">
                                            ✕
                                        </span>
                                    </Button>
                                )}
                            </>
                        ) : (
                            // No hay jugador
                            <div className="flex flex-col items-center justify-center w-full h-full p-6">
                                <div className="flex flex-col items-center opacity-30">
                                    <div className="w-12 h-12 border-4 border-zinc-400 rounded-full border-t-transparent animate-spin mb-4" />
                                        <span className="font-bold uppercase tracking-widest text-zinc-500">Esperando...</span>
                                </div>
                                <div className="absolute bottom-10">
                                    <Button 
                                        onClick={() => addBot(index)}
                                        className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[16px] font-black uppercase px-6 py-2 rounded-full
                                                    ${bouncyAnimation}`}>
                                    + Añadir Bot
                                    </Button>
                                </div>
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
                        123456
                    </h1>
                </div>
            <div className='flex justify-center p-3 w-full'>
                <Button type="submit" variant='magnate'
						onClick={ () => {navigate('/phaser-game');}}
                        className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[32px] uppercase font-bold w-[350px]
                        ${bouncyAnimation} `}> 
                    Comenzar juego
                </Button>
            </div>
        </div>
    </div>
  );
}
