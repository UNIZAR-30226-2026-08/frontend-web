import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EventBus } from "@/EventBus";
import * as WSTypes from "@/services/types/socket";

const ModeContent = ( {data} : {data : { title: string, bgImg: string,  isBot: boolean, ready:boolean} }) => {
	return (
    <div
      className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-700 group-hover:scale-110 pointer-events-none"
      style={{
        backgroundImage: `url(${data.bgImg})`,
      }}
    >
	< div className="absolute top-8 left-0 w-full flex justify-between px-8 gap-3 z-30 pointer-events-none">
		<div className="w-8 h-8 flex items-center justify-start">
		{ data.ready && (
		<img
			src="icons/check-solid-full.svg"
			alt="ready"
			className="w-7 h-7 drop-shadow-md"
		/>
		)}
		</div>
		<div className="w-8 h-8 flex items-center justify-end">
		<img
			src={data.isBot ? "icons/ia.svg" : "icons/single_player.svg"}
			alt="ready"
			className="w-7 h-7 drop-shadow-md"
		/>
		</div>
	</div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 text-white pointer-events-none">
        <span className="text-5xl font-black uppercase italic tracking-tighter leading-none">
            {data.title}
        </span>
    </div>
	</div>
);
};

/**
 * Private room lobby
 * For room owner, handles number of users and bots (TODO bot difficulty level)
 * For every player in the room, toggles ready state to begin game
 * @module Pages/Lobby
 * @return complete Lobby page
 */
export function Lobby() {
    const gridImageUrl = "images/bg_city_white.jpg";
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
	const navigate = useNavigate();
	const location = useLocation();
	const [imOwner, setImOwner] = useState<boolean>(false); 
	const [imReady, setImReady] = useState<boolean>(false);

    const [copied, setCopied] = useState(false); // para el icono de copiar código
    const roomCode = location.state?.roomCode || "N/A";

    const players = [ 
        //{ title: "usuario1", bgImg: "skins/barco_closeup.png", isBot: false, ready: false},
        //{ title: "usuario2", bgImg: "skins/barco_closeup.png", isBot: false, ready: true},
    ];
    const [difficulty, setDifficulty] = useState<WSTypes.NivelBot>('Medio');
    const [lobbyPlayers, setLobbyPlayers] = useState(players);

    const addBot = (index : number) => {
		setLobbyPlayers(prevPlayers => {
        	if (prevPlayers[index]) return prevPlayers; // ya había alguien

        	const newPlayers = [...prevPlayers];
        	//const newBot = { title: `bot ${index + 1}`, bgImg:gridImageUrl , isBot:true, ready:false };
        	const newBot = { title: "", bgImg:gridImageUrl , isBot:true, ready:false };
        	newPlayers[index] = newBot;
			return newPlayers;
		});
    }
    const removeBot = (index : number) => {
		setLobbyPlayers(prevPlayers => {
			const newPlayers = [...prevPlayers];
			newPlayers[index] = null;
			return newPlayers; 
		});
    }
    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const lobbySlots = Array.from({ length: 4 }, (_, i) => lobbyPlayers[i] || null);
    const activePlayersCount = lobbyPlayers.filter(player => player !== null).length; 

	const handleVoluntaryLeave = () => {
		EventBus.emit('private-cancel');
		navigate(-1);
	};

	useEffect(() => { 
        const handleOwnerToggle = (data: WSTypes.PrivateRoomOwner) => {
            setImOwner(data.is_owner);
			if (data.is_owner) {
				setImReady(true);
				EventBus.emit('private-set-ready', true);
			} // unless you leave room you won't get un-owner-ed
        };
		const handlePlayerMovement = (data: WSTypes.PrivateRoomPlayers) => {
			setLobbyPlayers(prevPlayers => {
				const humans = data.players.map((waiter) => ({
					title: waiter.username,
					bgImg: waiter.user_piece === null ? "skins/sombrero_closeup.png" : "skins/barco_closeup.png", // TODO Retrieve actual piece (see WSTypes.Waiters)
					isBot: false,
					ready: waiter.ready_to_play
				}));

				const bots = prevPlayers.filter(p => p!== null && p.isBot);
				const combined = [...humans, ...bots].slice(0,4);

				return Array.from({length:4}, (_, i)=> combined[i] || null);
			});
		};
		const handleSomeoneReady = (data: WSTypes.PrivateRoomReady) => {
			setLobbyPlayers((prevPlayers) =>
				prevPlayers.map( p =>
					p?.title===data.user ? { ...p, ready:data.is_ready } : p )
			);
		};
		const handleRoomSettings = (data: WSTypes.PrivateRoomHostSettings) => {
			// level update
			const rawLevel = data.bot_level as unknown as WSTypes.NivelBot;
			const translatedLevel = (rawLevel ? rawLevel : undefined) || 'Medio';
			setDifficulty(translatedLevel); 

			// lobby losts update
			setLobbyPlayers(prevPlayers => {
				let currentActive = prevPlayers.filter(p => p !== null).length;
				const newPlayers = [...prevPlayers];

				for (let i=3; i>=0 && currentActive > data.target_players; i--) {
					// Remove bot (correctly updated)
					if (newPlayers[i] !== null && newPlayers[i]?.isBot) {
						newPlayers[i] = null;
						currentActive--;
					}
				}
				for (let i=0; i<4 && currentActive < data.target_players; i++) {
					// Add bot (correctly updated)
					if (newPlayers[i] === null) {
						newPlayers[i] = {title: "", bgImg: gridImageUrl, isBot: true, ready: false};
						currentActive++;
					}
				}
				return newPlayers;
			});
		};

		const handleEnter = () => navigate('/phaser-game');

		EventBus.on('you-may-now-enter-the-game', handleEnter);
        EventBus.on('private-room-owner-toggle', handleOwnerToggle);
        EventBus.on('private-room-player-joined', handlePlayerMovement);
        EventBus.on('private-room-player-left', handlePlayerMovement);
        EventBus.on('private-room-settings', handleRoomSettings);
        EventBus.on('private-room-ready', handleSomeoneReady);
        return () => {
			EventBus.off('you-may-now-enter-the-game', handleEnter);
            EventBus.off('private-room-owner-toggle', handleOwnerToggle);
			EventBus.off('private-room-player-joined', handlePlayerMovement);
			EventBus.off('private-room-player-left', handlePlayerMovement);
        	EventBus.off('private-room-settings', handleRoomSettings);
        	EventBus.off('private-room-ready', handleSomeoneReady);
        };
    }, [navigate]);

	const handleButtonClick = () => {
		if (imOwner) {
			//EventBus.emit('private-set-ready',true); // repetido supuestamente
			EventBus.emit('private-start');
		}
		else {
			const nextReadyState = !imReady;
			setImReady(nextReadyState);
			EventBus.emit('private-set-ready', nextReadyState);
		}
	};

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none">
        <PageHeader title="Lobby" onBack={handleVoluntaryLeave} />

        <div className="grid grid-cols-1 grid-rows-1 gap-10 py-10 px-10"
            style={{
                height: "calc(100vh - var(--header-height))",
                marginTop: "var(--header-height)",
                backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                backgroundRepeat: "repeat",
                backgroundBlendMode: "overlay",
            }}>
            <div className="flex justify-end w-full max-w-7xl mx-auto pr-4">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-zinc-500 uppercase font-black tracking-widest text-[11px] flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        Nivel de los Bots
                    </span>

                    <div className="relative group">
						{imOwner ? (
                        <select 
                            value={difficulty}
                            onChange={(e) => {
								const newLevel = e.target.value;
								setDifficulty(newLevel);

								EventBus.emit('private-change-settings', {
									bot_level: newLevel,
									target_players: activePlayersCount
								});
							}}
                            className="appearance-none bg-white border-4 border-zinc-200 rounded-full px-8 py-3 
                                    font-black uppercase text-sm text-zinc-700 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.05)] 
                                    transition-all cursor-pointer pr-14 
                                    hover:border-[var(--color-primary)] focus:outline-none focus:ring-transparent"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 1.2rem center",
                                backgroundSize: "1.2em"
                            }}
                        >
                            {['Muy fácil', 'Fácil', 'Medio', 'Difícil', 'Muy difícil', 'Experto'].map((level) => (
                                <option key={level} value={level} className="font-sans normal-case text-base text-zinc-900">
                                    {level}
                                </option>
                            ))}
                        </select>
  						)
						: (
						<div className="bg-zinc-100 border-4 border-zinc-200 rounded-full px-10 py-3 font-black uppercase text-sm text-zinc-500 shadow-none cursor-default">
        				    {difficulty}
        				</div>
						)}
						{imOwner && (
                        <div className="absolute inset-0 rounded-full pointer-events-none group-hover:ring-2 group-hover:ring-[var(--color-primary)]/20 transition-all" />
  						)}
                    </div>
                </div>
            </div>
                
            <div className="grid grid-cols-4 gap-5 h-[300px] items-center mt-20">
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
                                    <ModeContent data={slot}  />
                                </Button>
                                
                                {imOwner && slot.isBot && ( 
								<div className="absolute bottom-10 z-40">
									<Button 
                                        onClick={() => {
											removeBot(index);
		EventBus.emit('private-change-settings', {
			bot_level: difficulty,
			target_players: activePlayersCount - 1
		});
										}}
                                        className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[16px] font-black uppercase px-6 py-2 rounded-full
                                                    ${bouncyAnimation}`}>
                                    x Eliminar Bot
                                    </Button>
								</div>
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
									{(imOwner && index===activePlayersCount) && (
									<Button 
                                        onClick={() => {
											addBot(index);
		EventBus.emit('private-change-settings', {
			bot_level: difficulty,
			target_players: activePlayersCount + 1
		});
										}}
                                        className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[16px] font-black uppercase px-6 py-2 rounded-full
                                                    ${bouncyAnimation}`}>
                                    + Añadir Bot
                                    </Button>  
									)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center gap-6 mt-6 mb-14">
    
                <div className="flex flex-col items-center gap-1">
                    <span className="text-zinc-500 uppercase font-bold tracking-widest text-xs">
                        Código de la sala
                    </span>
                    <div className="flex items-center gap-3">
                        <h1 className="text-5xl font-black tracking-tighter text-[var(--color-primary)] drop-shadow-sm leading-none">
                            {roomCode}
                        </h1>
                        
                        <Button 
                            onClick={copyToClipboard}
                            className="group relative p-2 rounded-full transition-all flex items-center justify-center"
                            title="Copiar código"
                        >
                            <span className={`transition-all duration-200 ${copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                                <img src="/icons/copy-regular-full.svg" className="w-10 h-10 text-zinc-500" alt="Copiar" />
                            </span>
                            {copied && (
                                <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-300">
                                    <img src="/icons/copy-solid-full.svg" className="w-10 h-10 text-zinc-500" alt="Copiado" />
                                </div>
                            )}
                        </Button>
                    </div>
                    <span className="text-zinc-400 uppercase font-bold tracking-widest text-[14px] mt-2">
                        Jugadores en sala: {activePlayersCount} / 4
                    </span>
                </div>
                <Button  
                    type="submit" 
                    variant='magnate'
                    onClick={handleButtonClick}
                    className={`bg-[var(--color-primary)] text-[var(--color-text)] text-[30px] uppercase font-bold w-[320px] h-14
                    ${bouncyAnimation}`}
                > 
					{imOwner ? "Comenzar juego" : (imReady ? "No listo" : "Listo")}
                </Button>
            </div>
        </div>
    </div>
  );
}
