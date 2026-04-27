import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';
import { GameLogicManager } from '@/phaser/managers/GameLogicManager';
// --- HEADER ---
const TradeHeader = ({ player, isSender }) => (_jsxs("div", { className: `p-8 pb-4 flex flex-col gap-1 ${isSender ? 'items-start' : 'items-end text-right'}`, children: [_jsx("span", { className: "text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase opacity-80", children: isSender ? 'Tus activos' : 'Sus activos' }), _jsxs("div", { className: `flex items-center gap-4 ${isSender ? 'flex-row' : 'flex-row-reverse'}`, children: [_jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black italic \n                        shadow-lg border-2 border-white", style: {
                        backgroundColor: player?.color || '#cbd5e1',
                        color: '#fff',
                        textShadow: '0px 2px 4px rgba(0,0,0,0.2)'
                    } }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h3", { className: "text-2xl font-black italic uppercase tracking-tighter text-slate-800 leading-none", children: player?.name }), _jsx("span", { className: `text-[10px] font-bold text-[var(--color-primary)] opacity-70 ${isSender ? 'text-left' : 'text-right'}`, children: isSender ? 'ESTÁS OFRECIENDO' : 'ESTÁS PIDIENDO' })] })] })] }));
export const TradingOverlay = () => {
    const { playSound } = useAudio();
    const [sender, setSender] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [isMinimised, setIsMinimised] = useState(false);
    const [selectingFor, setSelectingFor] = useState(null);
    const [myOffer, setMyOffer] = useState({ money: 0, properties: [] });
    const [theirOffer, setTheirOffer] = useState({ money: 0, properties: [] });
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
    const [showProperties, setShowProperties] = useState(false);
    useEffect(() => {
        const handleOpenTrade = (data) => {
            setSender(data.sender);
            setReceiver(data.receiver);
            setMyOffer({ money: 0, properties: [] });
            setTheirOffer({ money: 0, properties: [] });
            setIsMinimised(false);
            setShowProperties(false);
            EventBus.emit('set-hud-clickable', false);
        };
        const handleTileSelected = (tile) => {
            if (selectingFor === 'them') {
                setTheirOffer(prev => {
                    const isAlreadyAdded = prev.properties.some(p => p.id === tile.id);
                    if (isAlreadyAdded)
                        return prev;
                    return { ...prev, properties: [...prev.properties, tile] };
                });
            }
            else if (selectingFor === 'me') {
                setMyOffer(prev => {
                    const isAlreadyAdded = prev.properties.some(p => p.id === tile.id);
                    if (isAlreadyAdded)
                        return prev;
                    return { ...prev, properties: [...prev.properties, tile] };
                });
            }
            playSound('trade_shift');
            setIsMinimised(false);
            setSelectingFor(null);
            setShowProperties(true);
            EventBus.emit('dark-mode', true);
        };
        EventBus.on('open-trading-mode', handleOpenTrade);
        EventBus.on('tile-added-to-trade', handleTileSelected);
        return () => {
            EventBus.off('open-trading-mode', handleOpenTrade);
            EventBus.off('tile-added-to-trade', handleTileSelected);
        };
    }, [selectingFor, playSound]);
    const closeTrading = () => {
        setSender(null);
        setReceiver(null);
        setIsMinimised(false);
        setSelectingFor(null);
        EventBus.emit('dark-mode', false);
        EventBus.emit('set-hud-clickable', false);
    };
    const proposeTrade = () => {
        if (!sender || !receiver)
            return;
        // Comprobaciones
        if (myOffer.money > sender.balance) { // No puedo ofrecer más dinero del que tengo
            EventBus.emit('show-toast', { message: "No tienes suficiente dinero", duration: 3000 });
            return;
        }
        if (theirOffer.money > receiver.balance) { // No puedo pedirle más dinero del que tiene
            EventBus.emit('show-toast', { message: "El oponente no tiene tanto dinero", duration: 3000 });
            return;
        }
        const allPropertiesInTrade = [
            ...myOffer.properties,
            ...theirOffer.properties
        ];
        const gameModel = GameLogicManager.getInstance().model;
        for (const prop of allPropertiesInTrade) {
            const propertyData = gameModel.getProperty(prop.id);
            if (!propertyData)
                continue;
            // No se puede tradear si la propiedad misma tiene casas
            if (propertyData.houseCount > 0) {
                EventBus.emit('show-toast', {
                    message: `No se puede tradear ${propertyData.name} porque tiene construcciones`,
                    duration: 4000
                });
                return;
            }
            // No se puede tradear si OTRA propiedad del mismo grupo tiene casas
            const groupHasHouses = Object.values(gameModel.boardProperties).some(p => p.group === propertyData.group && p.houseCount > 0);
            if (groupHasHouses) {
                EventBus.emit('show-toast', {
                    message: `El grupo de ${propertyData.name} tiene casas construidas. Debes venderlas primero.`,
                    duration: 4000
                });
                return;
            }
        }
        // Estructura para ActionTradeProposal
        const tradePayload = {
            destination_user: receiver.id,
            offered_money: myOffer.money,
            offered_properties: myOffer.properties.map(p => p.id),
            asked_money: theirOffer.money,
            asked_properties: theirOffer.properties.map(p => p.id)
        };
        console.log("Enviando propuesta:", tradePayload);
        EventBus.emit('action-trade-proposal', tradePayload);
        closeTrading();
    };
    const startSelection = (who) => {
        const player = who === 'me' ? sender : receiver;
        setSelectingFor(who);
        setIsMinimised(true);
        EventBus.emit('dark-mode', true);
        EventBus.emit('start-selection-mode', {
            ownerId: player.id,
            propertyIds: player.properties?.map((p) => p.id || p) || []
        });
    };
    const handleRemoveProperty = (propertyId, side) => {
        if (side === 'me') {
            setMyOffer(prev => ({ ...prev, properties: prev.properties.filter(p => p.id !== propertyId) }));
        }
        else {
            setTheirOffer(prev => ({ ...prev, properties: prev.properties.filter(p => p.id !== propertyId) }));
        }
    };
    if (!sender || !receiver)
        return null;
    return (_jsxs(_Fragment, { children: [isMinimised && (_jsx("div", { className: "fixed z-[1001] pointer-events-auto animate-in slide-in-from-right-5 top-10 right-10", children: _jsxs("div", { className: "px-8 py-8 rounded-[30px] backdrop-blur-md flex flex-col items-center gap-2", style: stripedBackgroundStyle, children: [_jsx("div", { className: "text-center", children: _jsx("h4", { className: "text-slate-800 font-black italic uppercase tracking-tighter text-sm", children: selectingFor === 'me' ? (_jsx("span", { className: "text-[var(--color-background)] text-[16px]", children: "Tus propiedades" })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-[var(--color-background)] text-[16px] block mb-1", children: "Propiedades de:" }), _jsx("span", { className: "text-slate-400 text-[16px] leading-none", children: receiver?.name })] })) }) }), _jsx(Button, { onClick: () => {
                                setIsMinimised(false);
                                EventBus.emit('dark-mode', true);
                            }, className: `bg-[var(--color-primary)] text-[var(--color-text)] font-black text-[12px] px-5 py-2 rounded-full uppercase 
                                    ${bouncyAnimation}`, children: "Volver al trato" }), _jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: "Click en el tablero" })] }) })), _jsxs("div", { className: `fixed inset-0 z-[1000] pointer-events-none flex justify-between py-8 px-6 transition-all duration-500 
                        ${isMinimised ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`, children: [_jsx("aside", { className: "pointer-events-auto w-[300px] animate-in slide-in-from-left-20 duration-700 ease-out", children: _jsxs("div", { className: "h-full rounded-[40px] flex flex-col overflow-hidden", style: stripedBackgroundStyle, children: [_jsx(TradeHeader, { player: sender, isSender: true }), _jsx("div", { className: "flex-1 overflow-y-auto px-8", children: _jsx(TradeZone, { title: "Tu Dinero", offer: myOffer, playerProperties: sender.properties, onAdd: () => startSelection('me'), onMoneyChange: (v) => setMyOffer({ ...myOffer, money: v }), onRemoveProperty: (id) => handleRemoveProperty(id, 'me'), showProperties: showProperties }) }), _jsx("div", { className: "flex justify-center items-center p-8", children: _jsx(Button, { onClick: closeTrading, sound: "trade_turned_down", className: `w-[200px] h-[60px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[14px] 
                                        rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`, children: "Cancelar negociaci\u00F3n" }) })] }) }), _jsx("aside", { className: "pointer-events-auto w-[300px] animate-in slide-in-from-right-20 duration-700 ease-out", children: _jsxs("div", { className: "h-full rounded-[40px] flex flex-col overflow-hidden", style: stripedBackgroundStyle, children: [_jsx(TradeHeader, { player: receiver, isSender: false }), _jsx("div", { className: "flex-1 overflow-y-auto px-8", children: _jsx(TradeZone, { title: `Oferta de ${receiver.name}`, offer: theirOffer, playerProperties: receiver.properties, onAdd: () => startSelection('them'), onMoneyChange: (v) => setTheirOffer({ ...theirOffer, money: v }), onRemoveProperty: (id) => handleRemoveProperty(id, 'them'), showProperties: showProperties }) }), _jsx("div", { className: "flex justify-center items-center p-8", children: _jsx(Button, { onClick: proposeTrade, sound: "trade_accepted", className: `w-[150px] h-[60px] bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase text-[14px] 
                                            rounded-full ${bouncyAnimation}`, children: "Proponer Trato" }) })] }) })] })] }));
};
const TradeZone = ({ title, offer, onAdd, onMoneyChange, playerProperties = [], onRemoveProperty, showProperties }) => {
    const hasProperties = playerProperties && playerProperties.length > 0;
    const paperStyle = {
        background: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.05)'
    };
    return (_jsxs("div", { className: "flex flex-col gap-5 py-4", children: [_jsxs("div", { className: "flex items-center justify-between px-1", children: [_jsx("span", { className: "text-[12px] font-bold uppercase tracking-[0.2em] text-gray-400", children: title }), _jsx("div", { className: "h-[1px] flex-1 bg-gray-100 ml-4" })] }), _jsxs("div", { className: "relative group", children: [_jsx(Input, { placeholder: "0", className: "w-full bg-white border-2 border-slate-400 rounded-[30px] py-8 px-7 text-xl font-bold text-slate-900 outline-none \n                    focus:border-slate-700 transition-all placeholder:text-slate-400 shadow-sm", value: offer.money || '', onChange: (e) => onMoneyChange(parseInt(e.target.value) || 0) }), _jsx("div", { className: "absolute inset-y-0 right-6 flex items-center pointer-events-none", children: _jsx("span", { className: "text-2xl font-black text-[var(--color-primary)]", children: "\u20AC" }) })] }), _jsxs("div", { style: paperStyle, className: `min-h-[350px] border-2 border-slate-200 rounded-[32px] p-4 transition-all flex flex-col justify-between
                    ${!hasProperties ? 'opacity-70 grayscale' : ''}`, children: [_jsx("div", { className: "flex flex-col gap-2 overflow-y-auto max-h-[300px] p-1", children: showProperties && offer.properties.length > 0 ? (offer.properties.map((prop) => (_jsxs("div", { className: "flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: prop.color || '#cbd5e1' } }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx("p", { className: "text-[11px] font-black uppercase text-slate-700 leading-tight whitespace-normal break-words", children: prop.name }) }), _jsx(Button, { onClick: () => onRemoveProperty(prop.id), className: "hover:bg-red-50 text-red-400 rounded-full", children: _jsx("span", { className: "text-md font-bold", children: "\u2715" }) })] }, prop.id)))) : (_jsx("div", { className: "flex flex-col items-center justify-center text-center p-20", children: _jsx("p", { className: "text-[14px] font-black uppercase tracking-widest text-gray-700", children: hasProperties ? 'Selecciona activos' : 'Sin propiedades disponibles' }) })) }), hasProperties && (_jsxs(Button, { onClick: () => onAdd(playerProperties, showProperties), className: "mt-4 w-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 \n                                 rounded-full py-6 font-black uppercase text-[11px] tracking-widest\n                                 hover:border-[var(--color-primary)] transition-all active:scale-95 group", children: [_jsx("span", { className: "text-[var(--color-primary)] text-sm mr-2", children: "+" }), "A\u00F1adir Propiedades"] }))] })] }));
};
