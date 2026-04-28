import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { CornerTileContent } from '@/components/layout/CornerLayout';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
export const CornerOverlay = () => {
    const [propData, setPropData] = useState(null);
    const { playSound } = useAudio();
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
    useEffect(() => {
        const handle = (data) => {
            setPropData(data);
            if (data.sound) {
                playSound(data.sound);
            }
            else {
                console.log("no venía sonido");
            }
        };
        EventBus.on('show-corner-tile', handle);
        return () => { EventBus.off('show-corner-tile', handle); };
    }, [playSound]);
    if (!propData) {
        return null;
    }
    const closeOverlay = () => {
        setPropData(null);
        EventBus.emit('close-overlay');
        if (propData.tileText == 'Tranvía') {
            // Funcionamiento del tranvía
            EventBus.emit('open-tram-overlay', { currentTileId: propData.id, playerId: propData.playerId });
        }
        else if (propData.tileText == 'Parking Gratuito') {
            EventBus.emit('collect-parking-money', { currentTileId: propData.id, playerId: propData.playerId });
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "flex flex-col items-center gap-8", children: [_jsx(CornerTileContent, { image: propData.image, tileText: propData.tileText }), _jsx(Button, { onClick: () => closeOverlay(), className: `px-9 py-6 bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase rounded-full ${bouncyAnimation}`, children: propData.buttonText })] }) }));
};
