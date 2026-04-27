import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
// @ts-ignore 
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
    const [skinsList, setSkinsList] = useState([]);
    const [emojisList, setEmojisList] = useState([]);
    const [ownedIds, setOwnedIds] = useState([1]);
    const { token } = useAuth();
    const { getItemInfo, loading: isContextLoading } = useItemData();
    useEffect(() => {
        if (token && !isContextLoading) {
            fetchShopItems(token, (data) => {
                if (data && data.length > 0) {
                    const mappedSkins = [];
                    const mappedEmojis = [];
                    const fetchedOwned = [];
                    data.forEach((item) => {
                        if (item.owned)
                            fetchedOwned.push(item.custom_id);
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
                        }
                        else if (item.itemType === 'emoji') {
                            mappedEmojis.push(formattedItem);
                        }
                    });
                    if (mappedSkins.length > 0)
                        setSkinsList(mappedSkins);
                    if (mappedEmojis.length > 0)
                        setEmojisList(mappedEmojis);
                    setOwnedIds(prev => Array.from(new Set([...prev, ...fetchedOwned])));
                }
            });
            fetchUserPieces(token, (data) => {
                if (data && Object.keys(data).length > 0) {
                    const pieceIds = Object.keys(data).map(Number);
                    setOwnedIds(prev => Array.from(new Set([...prev, ...pieceIds])));
                }
            });
        }
    }, [token, isContextLoading, getItemInfo]);
    const handleBuy = (id) => {
        // TODO: cuando se compra, guardar para el jugador
        if (token) {
            buyItem(token, id, () => {
                setOwnedIds((prev) => Array.from(new Set([...prev, id])));
            }, (error) => {
                console.error("Error al comprar", error);
            });
        }
        else {
            if (!ownedIds.includes(id)) {
                setOwnedIds((prev) => [...prev, id]);
            }
        }
    };
    return (_jsxs("div", { className: "relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden select-none bg-slate-50", children: [_jsx(PageHeader, { title: "Tienda" }), _jsxs("div", { className: "flex flex-col gap-12 py-12 px-20 overflow-y-auto", style: {
                    ...stripedBackgroundStyle,
                    height: "calc(100vh - var(--header-height))",
                    marginTop: "var(--header-height)",
                }, children: [_jsx(ShopSection, { title: "Skins de Ficha", items: skinsList, onBuy: handleBuy, ownedIds: ownedIds }), _jsx(ShopSection, { title: "Emoticonos", items: emojisList, onBuy: handleBuy, ownedIds: ownedIds })] })] }));
}
function ShopSection({ title, items, onBuy, ownedIds = [] }) {
    const [pendingItem, setPendingItem] = useState(null);
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
    return (_jsxs("div", { className: "flex flex-col gap-3 min-h-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h2", { className: "text-xl font-black italic uppercase tracking-tighter text-slate-800", children: title }), _jsx("div", { className: "h-[2px] flex-1 bg-slate-200/50 rounded-full" })] }), _jsxs(Carousel, { className: "w-full", children: [_jsx(CarouselContent, { className: "-ml-2", children: items.map((item) => {
                            const isOwned = ownedIds.includes(item.id);
                            const isAvailable = item.available !== false || isOwned;
                            return (_jsx(CarouselItem, { className: "pl-2 md:basis-1/4 lg:basis-1/4", children: _jsx(Card, { className: `bg-white backdrop-blur-md rounded-[30px] overflow-hidden group border-2 border-slate-300 transition-all
                                    ${isOwned
                                        ? 'bg-white border-[var(--color-primary)] shadow-[0_0_15px_rgba(0,138,92,0.1)]'
                                        : 'bg-white/50 border-slate-200 shadow-sm'}
                                    ${!isAvailable ? 'opacity-60 grayscale' : ''}`, children: _jsxs(CardContent, { className: "flex flex-col items-center p-6 gap-2", children: [_jsx("div", { className: "w-20 h-20 flex items-center justify-center bg-slate-100/90 rounded-full group-hover:bg-white transition-colors shrink-0", children: _jsx("img", { src: item.img, alt: item.name, className: `w-12 h-12 object-contain drop-shadow-sm transition-transform ${isAvailable ? 'group-hover:scale-110' : ''}` }) }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-black uppercase text-[14px] text-black tracking-tight leading-none mb-1", children: item.name }), _jsx("p", { className: `${isAvailable ? 'text-[var(--color-primary)]' : 'text-slate-400'} font-black text-md`, children: isAvailable ? `${item.price} M` : 'Bloqueado' })] }), _jsx(Button, { disabled: !isAvailable || isOwned, onClick: () => isAvailable && !isOwned && setPendingItem(item), className: `
                                                h-8 font-black uppercase text-[11px] rounded-full transition-all w-22
                                                ${isOwned
                                                    ? 'bg-slate-200 text-slate-500 border-none cursor-default'
                                                    : isAvailable
                                                        ? `bg-[var(--color-primary)] text-white ${bouncyAnimation}`
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                                            `, children: isOwned ? 'Comprado' : isAvailable ? 'Adquirir' : 'No disponible' })] }) }) }, item.id));
                        }) }), _jsx(CarouselPrevious, { className: `-left-12 ${navButton}` }), _jsx(CarouselNext, { className: `-right-12 ${navButton}` })] }), _jsx(Confirm, { isOpen: !!pendingItem, title: pendingItem?.name, price: pendingItem?.price, onCancel: () => setPendingItem(null), onConfirm: () => {
                    onBuy(pendingItem.id);
                    setPendingItem(null);
                } })] }));
}
const Confirm = ({ isOpen, title, price, onConfirm, onCancel }) => {
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    if (!isOpen)
        return null;
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
    return (_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200", children: [_jsx("div", { className: "absolute inset-0 bg-black/30 backdrop-blur-sm", onClick: onCancel }), _jsxs("div", { className: "relative rounded-[40px] p-8 w-full max-w-[400px] flex flex-col items-center text-center border-4 border-gray-200", style: stripedBackgroundStyle, children: [_jsx("h3", { className: "text-[var(--color-background)] text-[18px] font-black uppercase italic tracking-widest block", children: "\u00BFConfirmar Compra?" }), _jsxs("p", { className: "text-slate-500 text-md font-medium mb-6", children: ["Est\u00E1s a punto de adquirir ", _jsx("span", { className: "font-bold text-slate-800", children: title }), " por", _jsxs("span", { className: "text-[var(--color-primary)] font-black", children: [" ", price, " M"] })] }), _jsxs("div", { className: "flex flex-col gap-3 ", children: [_jsx(Button, { onClick: onConfirm, className: `w-[120px] py-6 text-[18px] bg-[var(--color-primary)] text-white font-black uppercase rounded-full ${bouncyAnimation}`, children: "Comprar" }), _jsx(Button, { onClick: onCancel, className: "w-full text-slate-400 font-bold uppercase text-[12px] tracking-widest hover:text-red-400", children: "Cancelar" })] })] })] }));
};
