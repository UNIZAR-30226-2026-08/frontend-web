import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { EventBus } from '@/EventBus';

export function AdminExit() {
    const [visible, setVisible] = useState(false);
    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";

    useEffect(() => {
        const handleToggle = (show: boolean) => setVisible(show);
        EventBus.on('toggle-admin-exit-button', handleToggle);
        
        return () => { 
            EventBus.off('toggle-admin-exit-button', handleToggle); 
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-10 right-10 z-[9999] flex flex-col items-center gap-2">
            <p className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Modo Administración
            </p>
            <Button 
                onClick={() => {
                    EventBus.emit('stop-administer');
                    setVisible(false);
                }}
                className={`bg-red-500 hover:bg-red-600 text-white font-black text-[18px] px-6 py-4 rounded-full uppercase shadow-2xl border-2 border-white/20
                    ${bouncyAnimation}`}>
                Salir
            </Button>
        </div>
    );
}