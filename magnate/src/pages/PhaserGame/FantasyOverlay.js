import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { GameCard } from '@/components/ui/gameCard';
import { FantasyCardContent } from '@/components/layout/FantasyLayout';
import { useAudio } from '@/context/AudioContext';
export const FantasyOverlay = () => {
    const [cardData, setCardData] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const { playSound } = useAudio();
    useEffect(() => {
        const handle = (data) => {
            setCardData(data);
            setIsRevealed(false);
            playSound('fantasy');
        };
        EventBus.on('show-fantasy-card', handle);
        return () => { EventBus.off('show-fantasy-card', handle); };
    }, [playSound]);
    if (!cardData)
        return null;
    const closeOverlay = () => {
        EventBus.emit('close-overlay');
        setCardData(null);
    };
    const handleAction = () => {
        if (!isRevealed) {
            setIsRevealed(true);
            playSound('card_slide');
        }
        else {
            closeOverlay();
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center bg-black/10 backdrop-blur-sm", children: [_jsx("div", { className: "absolute inset-0 backdrop-blur-sm animate-in fade-in duration-300" }), _jsxs("div", { className: "relative z-10 flex flex-row gap-12 animate-in fade-in zoom-in duration-300 scale-90 md:scale-100", children: [_jsx("div", { className: `transition-all duration-300 ${isRevealed ? 'grayscale blur-[2px] scale-95' : 'hover:scale-110'}`, onClick: () => {
                            playSound('card_place_1');
                            closeOverlay();
                        }, children: _jsx(GameCard, { isFlipped: true, front: _jsx(FantasyCardContent, { data: cardData }), back: _jsx(FantasyCardContent, { isBack: true }) }) }), _jsx("div", { className: "absolute -inset-4 bg-white/10 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" }), _jsx("div", { className: `flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 [perspective:1000px]
                                    ${!isRevealed ? 'hover:scale-105 hover:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : ''}`, onClick: handleAction, children: _jsx("div", { className: "flex flex-col items-center gap-4", children: _jsx(GameCard, { isFlipped: isRevealed, onClick: handleAction, front: _jsx(FantasyCardContent, { data: cardData }), back: _jsx(FantasyCardContent, { isBack: true }) }) }) })] })] }));
};
