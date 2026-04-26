import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';

export const TradeMessage = () => {
    const [notice, setNotice] = useState<{message: string} | null>(null);

    useEffect(() => {
        const handleShow = (data: any) => setNotice(data);
        
        EventBus.on('show-selection-notice', handleShow);
        return () => {
            EventBus.off('show-selection-notice', handleShow);
        };
    }, []);

    if (!notice) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-[var(--color-primary)] backdrop-blur-md border-2 border-white px-8 py-4 rounded-full ">
                <p className="text-white font-black uppercase italic tracking-widest flex items-center gap-3">
                    {notice.message}
                </p>
            </div>
        </div>
    );
};