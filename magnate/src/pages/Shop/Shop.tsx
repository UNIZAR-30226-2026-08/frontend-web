import { useState, useEffect } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { fetchShopItems, buyItem, fetchUserPieces } from '@/api/shopServices';
import { useItemData } from '@/context/ItemContext'; 

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

export function Shop() {
    const [skinsList, setSkinsList] = useState<any[]>([]);
    const [emojisList, setEmojisList] = useState<any[]>([]);
    const [ownedIds, setOwnedIds] = useState<number[]>([1]);
    
    const { token } = useAuth();
    const { getItemInfo, loading: isContextLoading } = useItemData();

    useEffect(() => {
        if (token && !isContextLoading) {
            fetchShopItems(token, (data : any) => {
                if (data && data.length > 0) {
                    const mappedSkins: any[] = [];
                    const mappedEmojis: any[] = [];
                    const fetchedOwned: number[] = [];

                    data.forEach((item: any) => {
                        if (item.owned) fetchedOwned.push(item.custom_id);

                        const visual = getItemInfo(item.custom_id) || { 
                            name: item.itemType === 'piece' ? `Pieza ${item.custom_id}` : `Emoji ${item.custom_id}`, 
                            url: item.itemType === 'piece' ? "/skins/sombrero_closeup.png" : "/emojis/emote_anger.png" 
                        };

                        const formattedItem = {
                            id: item.custom_id,
                            name: visual.name,
                            price: item.price,
                            img: visual.url,
                            available: true
                        };

                        if (item.itemType === 'piece') {
                            mappedSkins.push(formattedItem);
                        } else if (item.itemType === 'emoji') {
                            mappedEmojis.push(formattedItem);
                        }
                    });

                    if (mappedSkins.length > 0) setSkinsList(mappedSkins);
                    if (mappedEmojis.length > 0) setEmojisList(mappedEmojis);
                    setOwnedIds(prev => Array.from(new Set([...prev, ...fetchedOwned])));
                }
            });

            fetchUserPieces(token, (data : any) => {
                if (data && Object.keys(data).length > 0) {
                    const pieceIds = Object.keys(data).map(Number);
                    setOwnedIds(prev => Array.from(new Set([...prev, ...pieceIds])));
                }
            });
        }
    }, [token, isContextLoading, getItemInfo]);

    const handleBuy = (id: number) => {
        // TODO: cuando se compra, guardar para el jugador
        if (token) {
            buyItem(token, id, () => {
                setOwnedIds((prev) => Array.from(new Set([...prev, id])));
            }, (error : any) => {
                console.error("Error al comprar", error);
            });
        } else {
            if (!ownedIds.includes(id)) {
                setOwnedIds((prev) => [...prev, id]);
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none bg-slate-50">
            <PageHeader title="Tienda" />

            <div className="flex flex-col gap-12 py-12 px-20 overflow-y-auto"
                style={{
                    ...stripedBackgroundStyle,
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                }}>

                <ShopSection 
                    title="Skins de Ficha" 
                    items={skinsList} 
                    onBuy={handleBuy} 
                    ownedIds={ownedIds}
                />

                <ShopSection 
                    title="Emoticonos" 
                    items={emojisList} 
                    onBuy={handleBuy} 
                    ownedIds={ownedIds}
                />
            </div>
        </div>
    );
}

function ShopSection({ title, items, onBuy, ownedIds = [] }: any) {
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
                        const isOwned = ownedIds.includes(item.id);
                        const isAvailable = item.available !== false || isOwned;
                        return (
                            <CarouselItem key={item.id} className="pl-2 md:basis-1/4 lg:basis-1/4">
                                <Card className={`bg-white backdrop-blur-md rounded-[30px] overflow-hidden group border-2 border-slate-300 transition-all
                                    ${isOwned 
                                        ? 'bg-white border-[var(--color-primary)] shadow-[0_0_15px_rgba(0,138,92,0.1)]' 
                                        : 'bg-white/50 border-slate-200 shadow-sm'}
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
                                            disabled={!isAvailable || isOwned}
                                            onClick={() => isAvailable && !isOwned && setPendingItem(item)}
                                            className={`
                                                h-8 font-black uppercase text-[11px] rounded-full transition-all w-22
                                                ${isOwned 
                                                    ? 'bg-slate-200 text-slate-500 border-none cursor-default' 
                                                    : isAvailable 
                                                        ? `bg-[var(--color-primary)] text-white ${bouncyAnimation}` 
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                                            `}>
                                            {isOwned ? 'Comprado' : isAvailable ? 'Adquirir' : 'No disponible'}
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
