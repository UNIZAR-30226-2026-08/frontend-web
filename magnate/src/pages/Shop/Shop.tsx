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

// TODO: ejemplos
const SKINS = [
    { id: 1, name: "Token1", price: 0, img: "/gorro.jpg", available: true },
    { id: 2, name: "Token2", price: 10, img: "/gorro.jpg", available: true },
    { id: 3, name: "Token3", price: 50, img: "/gorro.jpg", available: false },
    { id: 4, name: "Token4", price: 100, img: "/gorro.jpg", available: true },
    { id: 5, name: "Token5", price: 150, img: "/gorro.jpg", available: false },
    { id: 6, name: "Token6", price: 200, img: "/gorro.jpg", available: true },
];

const EMOJIS = [
    { id: 101, name: "Risa", price: 100, img: "/emoji.png", available: true },
    { id: 102, name: "Risa2", price: 250, img: "/emoji.png", available: false },
    { id: 103, name: "Risa3", price: 100, img: "/emoji.png", available: false },
    { id: 104, name: "Risa4", price: 300, img: "/emoji.png", available: true },
    { id: 105, name: "Risa5", price: 350, img: "/emoji.png", available: true },
];

export function Shop() {
    const handleBuy = (id: number) => {
        // TODO: cuando se compra, guardar para el jugador
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none bg-slate-50">
            <PageHeader title="Tienda" />

            <div className="flex flex-col gap-12 py-12 px-20 overflow-y-auto"
                style={{
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                    backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                    backgroundRepeat: "repeat",
                    backgroundBlendMode: "overlay",
                }}>

                {/* SECCIÓN SKINS */}
                <ShopSection 
                    title="Skins de Ficha" 
                    items={SKINS} 
                    onBuy={handleBuy} 
                />

                {/* SECCIÓN EMOJIS */}
                <ShopSection 
                    title="Emoticonos" 
                    items={EMOJIS} 
                    onBuy={handleBuy} 
                />
            </div>
        </div>
    );
}

function ShopSection({ title, items, onBuy }: any) {
    const [pendingItem, setPendingItem] = useState<any>(null);
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
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
                    {items.map((item: any) => {
                        const isAvailable = item.available !== false;
                        return (
                            <CarouselItem key={item.id} className="pl-2 md:basis-1/4 lg:basis-1/4">
                                <Card className={`bg-white backdrop-blur-md rounded-[30px] overflow-hidden group border-2 border-slate-300 transition-all
                                    ${!isAvailable ? 'opacity-60 grayscale' : ''}`}>
                                    <CardContent className="flex flex-col items-center p-6 gap-2"> 
                                        
                                        <div className="w-20 h-20 flex items-center justify-center bg-slate-100/90 rounded-full group-hover:bg-white transition-colors shrink-0">
                                            <img src={item.img} alt={item.name} 
                                            className={`w-12 h-12 object-contain drop-shadow-sm transition-transform ${isAvailable ? 'group-hover:scale-110' : ''}`} />
                                        </div>
                                        
                                        <div className="text-center">
                                            <h3 className="font-black uppercase text-[14px] text-black tracking-tight leading-none mb-1">
                                                {item.name}
                                            </h3>
                                            <p className={`${isAvailable ? 'text-[var(--color-primary)]' : 'text-slate-400'} font-black text-md`}>
                                                {isAvailable ? `${item.price} M` : 'Bloqueado'}
                                            </p>
                                        </div>

                                        <Button 
                                            disabled={!isAvailable}
                                            onClick={() => isAvailable && setPendingItem(item)}
                                            className={`h-8 font-black uppercase text-[10px] rounded-full transition-all text-[12px]
                                                ${isAvailable 
                                                    ? `bg-[var(--color-primary)] text-white w-[100px] ${bouncyAnimation}` 
                                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed w-[120px]'}`}>
                                            {isAvailable ? 'Adquirir' : 'No disponible'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className={`-left-12 ${navButton}`} />
                <CarouselNext className={`-right-12 ${navButton}`} />
            </Carousel>
            <Confirm
                isOpen={!!pendingItem} 
                title={pendingItem?.name} 
                price={pendingItem?.price} 
                onCancel={() => setPendingItem(null)} 
                onConfirm={() => {
                    onBuy(pendingItem.id);
                    setPendingItem(null);
                }}
            />
        </div>
    );
}

const Confirm = ({ isOpen, title, price, onConfirm, onCancel }: any) => {
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    if (!isOpen) return null;
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

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative rounded-[40px] p-8 w-full max-w-[400px] flex flex-col items-center text-center border-4 border-gray-200"
                style={stripedBackgroundStyle}>
                
                <h3 className="text-[var(--color-background)] text-[18px] font-black uppercase italic tracking-widest block">
                    ¿Confirmar Compra?
                </h3>
                
                <p className="text-slate-500 text-md font-medium mb-6">
                    Estás a punto de adquirir <span className="font-bold text-slate-800">{title}</span> por 
                    <span className="text-[var(--color-primary)] font-black"> {price} M</span>
                </p>

                <div className="flex flex-col gap-3 ">
                    <Button onClick={onConfirm}
                        className={`w-[120px] py-6 text-[18px] bg-[var(--color-primary)] text-white font-black uppercase rounded-full ${bouncyAnimation}`}>
                        Comprar 
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