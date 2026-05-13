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
import { Users } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useItemData } from '@/context/ItemContext';
// @ts-ignore 
import { fetchUserPieces } from '@/api/shopServices';
// @ts-ignore 
import { fetchProfile, changeUserPiece, fetchGamesPlayed, fetchGameSummary } from '@/api/userServices';

const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

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
    return (
        <div className="relative flex items-center justify-center rounded-full shrink-0 shadow-md"
            style={{ 
                width: size, height: size, 
                backgroundColor: "#008a5c",
                border: `${size * 0.08}px solid #185f48`,
            }} >
            <span className="font-black leading-none select-none"
                style={{ color: "#ffc971", fontSize: `${size * 0.6}px`, textShadow: "1px 1px 0px rgba(255,255,255,0.3)" }} >
                M
            </span>
        </div>
    );
}

export function Profile() {
    const { getItemInfo } = useItemData();
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    const [skinId, setSkinId] = useState(1);
    const [selectedSkinId, setSelectedSkinId] = useState(1);
    const [chooseSkin, setChooseSkin] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [profile, setProfile] = useState<any>(null);
    const [userSkins, setUserSkins] = useState<any[]>([]);
    const [gameHistory, setGameHistory] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetchProfile(token, (data: any) => {
                setProfile(data);
                const currentId = data.user_piece || data.custom_id || 1;
                setSkinId(currentId);
                setSelectedSkinId(currentId);
            });
            
            fetchUserPieces(token, (data: any) => {
                if (data && Array.isArray(data)) setUserSkins(data);
                else if (data && typeof data === 'object') setUserSkins(Object.values(data));
            });

            fetchGamesPlayed(token, async (data: any) => {
                if (data?.games) {
                    let fetchedGames: any[] = [];
                    for (let id of data.games) {
                        await fetchGameSummary(token, id, (summary: any) => {
                            const finalMoney = summary.final_money || {};
                            const playersEntries = Object.entries(finalMoney);

                            const rankedPlayers = [...playersEntries].sort((a: any, b: any) => b[1] - a[1]);
                            
                            const myIndex = rankedPlayers.findIndex(([username]) => username === profile?.username);
                            const realPosition = myIndex !== -1 ? myIndex + 1 : (summary.position ?? 0);
                            const userMonedas = finalMoney[profile?.username] || 0;
                            
                            const formatFullDate = (dateStr: string) => {
                                if (!dateStr) return "-";
                                const d = new Date(dateStr);
                                return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                            };

                            fetchedGames.push({
                                posicion: realPosition,
                                monedas: userMonedas,
                                inicio: formatFullDate(summary.start_date),
                                fin: formatFullDate(summary.end_date),
                                jugadores: rankedPlayers.map(([name]) => name),
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
        }
    }

    const activeItem = getItemInfo(skinId) || getItemInfo(1);

    return (
        <div className="relative min-h-screen bg-slate-50 overflow-hidden select-none">
            <PageHeader title="Perfil" />

            <div className="flex flex-col gap-12 py-12 px-20 overflow-y-auto"
                style={{
                    ...stripedBackgroundStyle,
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                }}>

                <div className="flex flex-row items-center justify-between w-full gap-4 p-2">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-20 h-20 flex items-center justify-center bg-slate-100/90 rounded-full shrink-0">
                            {activeItem && <img src={activeItem.url} alt={activeItem.name} className="w-10 h-10 object-contain drop-shadow-sm" />}
                        </div>
                        <div className="flex flex-col items-center">
                            <h3 className="font-black text-[22px] text-black tracking-tight leading-none">
                                {profile?.username || "Cargando..."}
                            </h3>
                            <Button onClick={() => setShowConfirm(true)}
                                className="font-black text-[14px] text-red-500 tracking-tight leading-none uppercase italic hover:bg-transparent hover:text-red-700 p-0 h-auto bg-transparent">
                                Cerrar sesión
                            </Button>
                            <Confirm isOpen={showConfirm} onConfirm={() => { logout(); navigate('/'); }} onCancel={() => setShowConfirm(false)}/> 
                        </div>
                    </div>

                   <Button 
                       onClick={() => { setChooseSkin(!chooseSkin); setSelectedSkinId(skinId); }}
                       className={`h-8 font-black uppercase rounded-full transition-all text-[16px] ${chooseSkin ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-[var(--color-primary)] text-white"} ${bouncyAnimation}`}>
                       {chooseSkin ? "Cancelar selección" : "Cambiar skin"}
                   </Button>
                </div>

                {chooseSkin ? ( 
                    <>
                        <ShopSection 
                            title="Elige un skin" skins={userSkins} currentSkinId={skinId} selectedSkinId={selectedSkinId} onSelect={setSelectedSkinId} getItemInfo={getItemInfo}
                        />          
                        <Button onClick={handleConfirmSelection}
                            className={`h-8 self-center font-black uppercase rounded-full transition-all text-[12px] bg-[var(--color-primary)] text-white ${bouncyAnimation}`}>
                            Confirmar selección
                        </Button>
                    </> 
                ) : (
                    <>
                        <StatsSection title="Estadísticas de partidas" stats={{ "Partidas Jugadas": profile?.num_played_games || 0, "Victorias": profile?.num_won_games || 0, "Puntos Totales": profile?.elo || 0 }} />
                        <GameHistSection title="Historial de partidas" items={gameHistory} />
                    </>
                )}
            </div>
        </div>
    );
}

function ShopSection({ title, skins, currentSkinId, selectedSkinId, onSelect, getItemInfo }: any) {
    const navButton = "border-slate-200 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all";
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase text-slate-800">{title}</h2>
                <div className="h-[2px] flex-1 bg-slate-200/50 rounded-full"/>
            </div>
            <Carousel className="w-full px-12">
                <CarouselContent className="-ml-4">
                    {skins.map((item: any) => {
                        console.log(item);
                        const id = item.custom_id;
                        const info = getItemInfo(id) || { 
                            name: `Skin Desconocida ${id}`, 
                            url: "/skins/sombrero_closeup.png" 
                        };
                        const isCurrent = id === currentSkinId;
                        const isSelected = id === selectedSkinId;
                        return (
                            <CarouselItem key={id} className="pl-4 md:basis-1/3 lg:basis-1/4">
                                <Card className={`rounded-[30px] transition-all border-2 ${isSelected ? "border-[var(--color-primary)] bg-white" : "border-slate-200 bg-white/50"}`}>
                                    <CardContent className="flex flex-col items-center p-6 gap-4">
                                        <div className="w-16 h-16 flex items-center justify-center bg-slate-50 rounded-full">
                                            <img src={info.url} alt={info.name} className="w-10 h-10 object-contain" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-black uppercase text-xs text-black tracking-tight leading-none mb-1">{info.name}</h3>
                                        </div>
                                       <Button disabled={isCurrent} onClick={() => onSelect(id)}
                                            className={`h-9 px-6 rounded-full font-black text-[12px] uppercase transition-all duration-200 ${isCurrent ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50" : isSelected ? "bg-[var(--color-primary)] text-white shadow-lg scale-105" : "bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"} ${bouncyAnimation}`}>
                                            {isCurrent ? 'En uso' : isSelected ? 'Seleccionado' : 'Seleccionar'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className={navButton} /><CarouselNext className={navButton} />
            </Carousel>
        </div>
    );
}

function StatsSection({ title, stats }: any) {
    return (
        <div className="flex flex-col gap-3 min-h-0">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">{title}</h2>
                <div className="h-[2px] flex-1 bg-slate-200/50 rounded-full"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(stats).map(([key, value]: any) => (
                    <Card key={key} className="bg-white border-2 border-slate-300 rounded-[30px] overflow-hidden shadow-sm">
                        <CardContent className="flex flex-col items-center p-6">
                            <span className="text-[10px] font-black uppercase text-slate-400 mb-1">{key}</span>
                            <span className="text-[24px] font-black italic text-[var(--color-primary)]">{value}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function GameHistSection({ title, items }: any) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase text-slate-800">{title}</h2>
                <div className="h-[2px] flex-1 bg-slate-200/50 rounded-full"/>
            </div>
            <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                    {items.map((game: any, index: number) => (
                        <CarouselItem key={index} className="pl-2 md:basis-1/3 lg:basis-1/4">
                            <Card className="bg-white border-2 border-slate-300 rounded-[30px] overflow-hidden group hover:border-[var(--color-primary)]/50 transition-all">
                                <CardContent className="flex flex-col p-6 gap-4">
                                    {/* Cabecera de la Partida */}
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fecha de Inicio</span>
                                            <span className="text-[12px] font-black text-slate-700">{game.inicio}</span>
                                        </div>
                                        <div className="bg-slate-100 px-3 py-1 rounded-full">
                                            <span className="text-[var(--color-primary)] font-black italic text-sm">#{game.posicion===0 ? "EN PAUSA#" : game.posicion}</span>
                                        </div>
                                    </div>

                                    {/* Players list */}
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

                                    {/* Recompensa */}
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
                <CarouselPrevious /><CarouselNext />
            </Carousel>
        </div>
    );
}
