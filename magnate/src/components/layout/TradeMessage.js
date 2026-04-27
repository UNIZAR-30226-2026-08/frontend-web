import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
export const TradeMessage = () => {
    const [notice, setNotice] = useState(null);
    useEffect(() => {
        const handleShow = (data) => setNotice(data);
        EventBus.on('show-selection-notice', handleShow);
        return () => {
            EventBus.off('show-selection-notice', handleShow);
        };
    }, []);
    if (!notice)
        return null;
    return (_jsx("div", { className: "fixed top-24 left-1/2 -translate-x-1/2 z-[5000] animate-in fade-in slide-in-from-top-4 duration-300", children: _jsx("div", { className: "bg-[var(--color-primary)] backdrop-blur-md border-2 border-white px-8 py-4 rounded-full ", children: _jsx("p", { className: "text-white font-black uppercase italic tracking-widest flex items-center gap-3", children: notice.message }) }) }));
};
