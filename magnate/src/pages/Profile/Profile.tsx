import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Coins, Hash, Users, Calendar } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { fetchUserPieces } from '@/api/shopServices';
import { fetchProfile, changeUserPiece, fetchGamesPlayed, fetchGameSummary } from '@/api/userServices';

const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

/*
const GAMES = [
    { posicion: 0, monedas: 380, inicio: "17/03/2026 14:30", jugadores: ["Juls", "Nic", "Cris", "mangel"], fin: "-" },
    { posicion: 1, monedas: 580, inicio: "16/03/2026 18:15", jugadores: ["Juls", "Luc", "Nau", "mangel"], fin: "16/03/2026 19:47" },
    { posicion: 2, monedas: 200, inicio: "15/03/2026 21:00", jugadores: ["Nic","Juls","Cris"], fin: "15/03/2026 22:05" },
    { posicion: 3, monedas: 90,  inicio: "14/03/2026 10:20", jugadores: ["Luc","Cris","Juls","mangel"], fin: "14/03/2026 11:15" },
    { posicion: 4, monedas: 0,   inicio: "13/03/2026 12:45", jugadores: ["Cris","Nic","Luc","Juls"], fin: "13/03/2026 13:24" },
    { posicion: 2, monedas: 0,   inicio: "12/03/2026 19:00", jugadores: ["mangel","Juls","Nau"], fin: "L" },
];
*/

const SKINS = {
    1 : { name: "Sombrero", price: 0, img: "/skins/sombrero_closeup.png" },
    2 : { name: "Barco", price: 10,  img: "/skins/barco_closeup.png"},
    3 : { name: "Burguer", price: 50,  img: "/skins/burguer_closeup.png"},
    4 : { name: "Coche f1", price: 100, img: "/skins/f1_closeup.png"},
    5 : { name: "Sombrero", price: 150, img: "/skins/sombrero_closeup.png" },
    6 : { name: "Sombrero", price: 200, img: "/skins/sombrero_closeup.png"},
};

const stripedBackgroundStyle = { backgroundImage: `
        linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), 
        repeating-linear-gradient(
            -45deg,
            #ffffff,
            #ffffff 20px,
            #f3f4f6 20px,
            #f3f4f6 40px )`,
    backgroundSize: 'cover'
};

const Confirm = ({ isOpen, onConfirm, onCancel }: any) => {
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative rounded-[40px] p-8 w-full max-w-[400px] flex flex-col items-center text-center border-4 border-gray-200"
                style={stripedBackgroundStyle}>
                
                <h3 className="text-slate-800 text-[20px] font-black uppercase italic leading-tight mb-2">
                    ¿Quieres cerrar sesión?
                </h3>

                <p className="text-slate-500 text-[14px] font-medium mb-2">
                    Estás saliendo del juego y finalizando tu sesión actual.
                </p>

                <div className="flex flex-col gap-2 mt-4">
                    <Button onClick={onConfirm}
                        className={`w-[130px] py-5 text-[16px] bg-[var(--color-primary)] text-white font-black uppercase rounded-full ${bouncyAnimation}`}>
                        Continuar
                    </Button>
                    
                    <Button onClick={onCancel}
                        className="w-full text-slate-400 font-bold uppercase text-[12px] tracking-widest hover:text-red-400">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
};

function Coin({ size = 24 }: { size?: number }) {
    const primaryColor = "#008a5c";
    const secondaryColor = "#185f48";
    const textColor = "#ffc971";

    return (
        <div className="relative flex items-center justify-center rounded-full shrink-0 shadow-md"
            style={{ 
                width: size, 
                height: size, 
                backgroundColor: primaryColor,
                border: `${size * 0.08}px solid ${secondaryColor}`,
            }} >
            <span className="font-black leading-none select-none"
                style={{ 
                    color: textColor, 
                    fontSize: `${size * 0.6}px`,
                    textShadow: "1px 1px 0px rgba(255,255,255,0.3)" 
                }} >
                M
            </span>
        </div>
    );
}

export function Profile() {
    const [skinId, setSkinId] = useState(1);
    const [chooseSkin, setChooseSkin] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedSkinId, setSelectedSkinId] = useState(skinId);
    
    const [userSkins, setUserSkins] = useState<any>({});
    const [profile, setProfile] = useState<any>(null);
    const [gameHistory, setGameHistory] = useState<any[]>([]);

    const navigate = useNavigate();
    const { logout, token } = useAuth();

    useEffect(() => {
        if (token) {
            fetchProfile(token, (data) => {
                setProfile(data);
                if (data && data.user_piece) {
                    setSkinId(data.user_piece);
                    setSelectedSkinId(data.user_piece);
                } else if (data && data.custom_id) {
                    setSkinId(data.custom_id);
                    setSelectedSkinId(data.custom_id);
                }
            });
            
            fetchUserPieces(token, (data) => {
                if (!data || Object.keys(data).length === 0) {
                    setUserSkins(SKINS);
                } else {
                    setUserSkins(data);
                }
            });

            fetchGamesPlayed(token, async (data) => {
                if (data && data.games) {
                    let fetchedGames: any[] = [];
                    for (let id of data.games) {
                        await fetchGameSummary(token, id, (summary) => {
                            // TODO: A ver si lo conseguimos del backend
                            const jugadores = [];
                            
                            fetchedGames.push({
                                posicion: summary.position || 0,
                                monedas: summary.final_money || 0,
                                inicio: summary.start_date || "-",
                                jugadores: jugadores.length > 0 ? jugadores : ["Desconocido"],
                                fin: summary.end_date || "-"
                            });
                        });
                    }
                    setGameHistory(fetchedGames);
                }
            });
        }
    }, [token, profile?.username]);

    const handleConfirmSelection = () => {
        if (token) {
            changeUserPiece(token, selectedSkinId, () => {
                setSkinId(selectedSkinId);
                setChooseSkin(false);
            });
        } else {
            setSkinId(selectedSkinId);
            setChooseSkin(false);
        }
    };
    
    const handleLogoutClick = () => {
        setShowConfirm(true);
    };
    
    const confirmLogout = () => {
        setShowConfirm(false);
        logout();
        navigate('/');
    };

    const cancelLogout = () => {
        setShowConfirm(false);
    };

    const currentStats = {
        "Partidas Jugadas": profile?.num_played_games || 0,
        "Victorias": profile?.num_won_games || 0,
        "Puntos": profile?.points || 0,
        "Experiencia": profile?.exp || 0,
        "Elo": profile?.elo || 0
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none bg-slate-50">
            <PageHeader title="Perfil" />

            <div className="flex flex-col gap-12 py-12 px-20 overflow-y-auto"
                style={{
                    ...stripedBackgroundStyle,
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                }}>

                <div className="flex flex-row items-center justify-between w-full gap-4 p-2">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-20 h-20 flex items-center justify-center bg-slate-100/90 rounded-full group-hover:bg-white transition-colors shrink-0">
                            <img 
                                src={`/skins/${skinId || profile?.user_piece}.png`} 
                                alt={`Skin ${skinId}`} 
                                className="w-10 h-10 object-contain drop-shadow-sm transition-transform group-hover:scale-110" />
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <h3 className="font-black text-[22px] text-black tracking-tight leading-none">
                                {profile?.username || "miguell"}
                            </h3>
                        
                            <Button
                                onClick={handleLogoutClick}
                                className="font-black text-[14px] text-red-500 tracking-tight leading-none uppercase italic hover:text-red-700 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
                                Cerrar sesión
                            </Button>
                            <Confirm 
                                isOpen={showConfirm}
                                onConfirm={confirmLogout}
                                onCancel={cancelLogout}/> 
                        </div>
                    </div>

                   <Button 
                       onClick={() => {
                            setChooseSkin(!chooseSkin);
                            setSelectedSkinId(skinId);} }
                       className={`h-8 font-black uppercase rounded-full transition-all text-[16px] ${
                           chooseSkin
                           ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all " 
                           : "bg-[var(--color-primary)] text-white" }
                           ${bouncyAnimation}`}>
                       {chooseSkin ? "Cancelar selección" : "Cambiar skin"}
                   </Button>

                </div>

                {chooseSkin ? ( 
                        <>
                    <ShopSection
                        title="Elige un skin"
                        skins={userSkins}
                        currentSkinId={skinId}
                        selectedSkinId={selectedSkinId}
                        onSelect={setSelectedSkinId}
                    />          
                    <Button
                        onClick={handleConfirmSelection}
                        className={`h-8 self-center font-black uppercase text-[12px] rounded-full transition-all text-[12px] bg-[var(--color-primary)] text-white ${bouncyAnimation}`}>
                        Confirmar selección
                    </Button>
                        </> 
                ) : (
                        <>
                    <StatsSection 
                        title="Estadísticas de perfil" 
                        stats={currentStats} 
                    />

                    <GameHistSection 
                        title="Historial de partidas" 
                        items={gameHistory} 
                    />
                        </>
                )}
            </div>
        </div>
    );
}

function ShopSection({ title, skins, currentSkinId, selectedSkinId, onSelect }: any) {
    const navButton = "border-slate-200 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all";

    if (!skins || Object.keys(skins).length === 0) {
        return <div className="text-center font-bold text-slate-500">Cargando skins...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase text-slate-800">{title}</h2>
                <div className="h-[2px] flex-1 bg-slate-200/50 rounded-full"/>
            </div>

            <Carousel className="w-full px-12">
                <CarouselContent className="-ml-4">
                    {Object.entries(skins).map(([id, item]: [string, any]) => {
                        const numericId = parseInt(id);
                        const isCurrentDefault = numericId === currentSkinId;
                        const isSelected = numericId === selectedSkinId;

                        return (
                            <CarouselItem key={id} className="pl-4 md:basis-1/3 lg:basis-1/4">
                                <Card className={`rounded-[30px] transition-all border-2 ${
                                    isSelected
                                    ? "border-[var(--color-primary)] bg-white"
                                    : "border-slate-200 bg-white/50"
                                }`}>
                                    <CardContent className="flex flex-col items-center p-6 gap-4">
                                        <div className="w-16 h-16 flex items-center justify-center bg-slate-50 rounded-full">
                                            <img src={item.img} alt={item.name} className="w-10 h-10 object-contain" />
                                        </div>

                                        <div className="text-center">
                                            <h3 className="font-black uppercase text-xs">{item.name}</h3>
                                            <p className="text-[var(--color-background)] font-black text-sm">
                                                {item.name}
                                            </p>
                                        </div>

                                       <Button
                                            disabled={isCurrentDefault}
                                            onClick={() => onSelect(numericId)}
                                            className={`h-9 px-6 rounded-full font-black text-[12px] uppercase transition-all duration-200 ${
                                                isCurrentDefault
                                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50" 
                                                    : isSelected
                                                    ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/40 scale-105"
                                                    : "bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                                            } ${bouncyAnimation}`}
                                        >
                                            {isCurrentDefault ? 'En uso' : isSelected ? 'Seleccionado' : 'Seleccionar'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className={navButton} />
                <CarouselNext className={navButton} />
            </Carousel>
        </div>
    );
}

function StatsSection({ title, stats }: any) {
    return (
        <div className="flex flex-col gap-3 min-h-0">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
                    {title}
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200/50 rounded-full"/>
            </div>

            <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                    {Object.entries(stats).map(([key, value]: any, index) => (
                        <CarouselItem key={index} className="pl-2 md:basis-1/3 lg:basis-1/3">
                            <Card className="bg-white border-2 border-slate-300 rounded-[30px] overflow-hidden shadow-sm">
                                <CardContent className="flex flex-col items-center p-8">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-1 text-center h-8 flex items-center justify-center leading-tight">
                                        {key}
                                    </span>
                                    <span className="text-[26px] font-black italic text-[var(--color-primary)]">
                                        {value}
                                    </span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

function GameHistSection({ title, items }: any) {
    const navButton = `
        border-slate-200 
        text-[var(--color-primary)] 
        transition-all 
        duration-150 
        hover:bg-[var(--color-primary)]
        hover:border-[var(--color-primary)]/30 
        active:bg-[var(--color-primary)] 
        active:border-[var(--color-primary)] 
        active:text-white 
        active:scale-95
    `;

    return (
        <div className="flex flex-col gap-3 min-h-0">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
                    {title}
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200/50 rounded-full"/>
            </div>

            <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                    {items.map((game: any, index: number) => (
                        <CarouselItem key={index} className="pl-2 md:basis-1/4 lg:basis-1/4">
                            <Card className="bg-white border-2 border-slate-300 rounded-[30px] overflow-hidden group hover:border-[var(--color-primary)]/50 transition-all">
                                <CardContent className="flex flex-col p-6 gap-4">
                                    
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fecha e Inicio</span>
                                            <span className="text-[12px] font-black text-slate-700">{game.inicio}</span>
                                        </div>
                                        <div className="bg-slate-100 px-3 py-1 rounded-full">
                                            <span className="text-[var(--color-primary)] font-black italic text-sm">#{game.posicion===0 ? "EN PAUSA#" : game.posicion}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
                                            <Users size={12} /> Jugadores
                                        </span>
                                        <div className="bg-slate-50 rounded-2xl h-28 p-3 flex flex-col gap-1">
                                            {game.jugadores.map((player: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <span className="font-black text-[var(--color-primary)] w-4 text-[10px]">{idx + 1}.</span>
                                                    <span className="font-bold text-slate-600 truncate">{player}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                   <div className="flex items-center justify-between mt-auto pt-2">
                                        <div className="flex items-center gap-2">
                                            <Coin size={20} /> 
                                            <span className="font-black text-slate-800 text-lg tracking-tighter">
                                                {game.monedas}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-slate-300 italic">
                                            Fin: {game.fin}
                                        </span>
                                    </div>

                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className={`-left-12 ${navButton}`} />
                <CarouselNext className={`-right-12 ${navButton}`} />
            </Carousel>
        </div>
    );
}
