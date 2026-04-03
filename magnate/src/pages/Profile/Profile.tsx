import { useState } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Coins, Hash, Users, Calendar } from "lucide-react"; // Opcional: iconos para mejorar visualmente

const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

const GAMES = [
    { posicion: 0, monedas: 380, inicio: "17/03/2026 14:30", jugadores: ["Juls", "Nic", "Cris", "mangel"], fin: "-" },
    { posicion: 1, monedas: 580, inicio: "16/03/2026 18:15", jugadores: ["Juls", "Luc", "Nau", "mangel"], fin: "16/03/2026 19:47" },
    { posicion: 2, monedas: 200, inicio: "15/03/2026 21:00", jugadores: ["Nic","Juls","Cris"], fin: "15/03/2026 22:05" },
    { posicion: 3, monedas: 90,  inicio: "14/03/2026 10:20", jugadores: ["Luc","Cris","Juls","mangel"], fin: "14/03/2026 11:15" },
    { posicion: 4, monedas: 0,   inicio: "13/03/2026 12:45", jugadores: ["Cris","Nic","Luc","Juls"], fin: "13/03/2026 13:24" },
    { posicion: 2, monedas: 0, 	 inicio: "12/03/2026 19:00", jugadores: ["mangel","Juls","Nau"], fin: "L" },
];

const STATS = { 
    "Partidas Jugadas": 30, 
    "Victorias": 17, 
    "Monedas Totales": 1245 
};

const SKINS = {
    1 : { name: "Token1", price: 0, img: "/gorro.jpg" },
    2 : { name: "Token2", price: 10, img: "/emoji.png"},
    3 : { name: "Token3", price: 50, img: "/pattern.svg"},
    4 : { name: "Token4", price: 100, img: "/vite.svg"},
    5 : { name: "Token5", price: 150, img: "/gorro.jpg" },
    6 : { name: "Token6", price: 200, img: "/gorro.jpg"},
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
	const [skinId, setSkinId] = useState(1); // default: miskin (look for current skin)
	const [chooseSkin, setChooseSkin] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

	// for skin selection
	const [selectedSkinId, setSelectedSkinId] = useState(skinId);

	const handleConfirmSelection = () => {
		setSkinId(selectedSkinId);
		setChooseSkin(false);
	};
    
    const handleLogoutClick = () => {
        setShowConfirm(true);
    };
    
    const confirmLogout = () => {
        setShowConfirm(false);
    };

    const cancelLogout = () => {
        setShowConfirm(false);
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

				{/* icono + nombre usuario + botón cambiar skin */}
				<div className="flex flex-row items-center justify-between w-full gap-4 p-2">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-20 h-20 flex items-center justify-center bg-slate-100/90 rounded-full group-hover:bg-white transition-colors shrink-0">
                            <img 
                                src={SKINS[skinId as keyof typeof SKINS].img} 
                                alt={SKINS[skinId as keyof typeof SKINS].name} 
                                className="w-10 h-10 object-contain drop-shadow-sm transition-transform group-hover:scale-110" />
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <h3 className="font-black text-[22px] text-black tracking-tight leading-none">
                                Juls
                            </h3>
                        
                            <Button
                                onClick={handleLogoutClick}
                                className="font-black text-[14px] text-red-500 tracking-tight leading-none uppercase italic
                                        hover:text-red-700 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
                                Cerrar sesión
                            </Button>
                            <Confirm 
                                isOpen={showConfirm}
                                onConfirm={confirmLogout} // TODO: cerrar sesión
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
						skins={SKINS}
						currentSkinId={skinId}
						selectedSkinId={selectedSkinId}
						onSelect={setSelectedSkinId}
		  			/>			
					<Button
                    	onClick={() => {
						 	setChooseSkin(!chooseSkin);
							setSkinId(selectedSkinId);}
						}
						className={`h-8 self-center font-black uppercase text-[12px] rounded-full transition-all text-[12px] bg-[var(--color-primary)] text-white ${bouncyAnimation}`}>
						Confirmar selección
					</Button>
						</> 
				) : (
						<>
                	{/* SECCIÓN STATS */}
                	<StatsSection 
                	    title="Estadísticas de partidas" 
                	    stats={STATS} 
                	/>

                	{/* SECCIÓN HISTORIAL */}
                	<GameHistSection 
                	    title="Historial de partidas" 
                	    items={GAMES} 
                	/>
						</>
				)}
            </div>
        </div>
    );
}

function ShopSection({ title, skins, currentSkinId, selectedSkinId, onSelect }: any) {
    const navButton = "border-slate-200 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all";

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
                                    <span className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-1">
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
                                    
                                    {/* Cabecera de la Partida */}
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fecha e Inicio</span>
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
                <CarouselPrevious className={`-left-12 ${navButton}`} />
                <CarouselNext className={`-right-12 ${navButton}`} />
            </Carousel>
        </div>
    );
}
