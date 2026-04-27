import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { EventBus } from '@/EventBus';
const MessageBubble = ({ text, isSender, senderName, senderColor }) => {
    return (_jsx("div", { className: `flex w-full ${isSender ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[90%]`, children: [_jsx("span", { className: "text-[11px] font-black uppercase mb-1 tracking-wider mx-1", style: { color: senderColor }, children: senderName }), _jsx("div", { className: `
                    px-4 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-zinc-200
                    ${isSender
                        ? 'bg-[#e0f2fe] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-none'
                        : 'bg-white rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-xl'}
                `, children: _jsx("p", { className: "text-sm text-[#3f3f46] font-medium leading-relaxed break-words", children: text }) })] }) }));
};
export const ChatHUD = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'sys-init',
            text: '¡Bienvenido al chat de Magnate! Construye tu imperio.',
            isSender: false,
            senderName: 'Sistema',
            senderColor: '#9ca3af'
        }
    ]);
    //const messagesEndRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { playSound } = useAudio();
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);
    useEffect(() => {
        const handleIncomingMessage = (event) => {
            const { playerId, playerName, playerColor, text, isSender } = event;
            setMessages(prev => [...prev, {
                    id: playerId + Date.now().toString(),
                    text,
                    isSender,
                    senderName: playerName,
                    senderColor: playerColor
                }]);
        };
        EventBus.on('receive-chat-message', handleIncomingMessage);
        return () => { EventBus.off('receive-chat-message', handleIncomingMessage); };
    }, []);
    const MessageIcon = (_jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }));
    const ChevronIcon = () => (_jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "m9 18 6-6-6-6" }) }));
    const handleToggleChat = () => {
        playSound('button_back');
        setIsOpen(!isOpen);
    };
    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            const text = e.target.value.trim();
            if (text === "")
                return;
            const message = {
                "type": "SendChatMessage",
                "text": text
            };
            EventBus.emit('send-chat-message', message);
            e.target.value = "";
        }
    };
    return (_jsxs("div", { className: `fixed left-0 top-0 h-screen z-[2000] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center
                ${isOpen ? 'translate-x-0' : '-translate-x-[320px]'} 
            `, children: [_jsxs("div", { className: "w-[320px] h-full bg-gradient-to-b from-zinc-50 to-zinc-100 p-6 shadow-2xl flex flex-col relative z-10", children: [_jsx("div", { className: "flex items-center border-b-2 border-black/5 pb-4 mb-4 mt-2", children: _jsxs("span", { className: "text-zinc-900 font-black italic uppercase tracking-tighter text-2xl", children: ["Chat ", _jsx("span", { className: "text-[var(--color-primary)]", children: "Global" })] }) }), _jsxs("div", { className: "flex-1 overflow-y-auto space-y-4 pr-2 overflow-x-hidden", children: [messages.map((msg) => (_jsx(MessageBubble, { text: msg.text, isSender: msg.isSender, senderName: msg.senderName, senderColor: msg.senderColor }, msg.id))), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "mt-4 mb-4", children: _jsx("input", { type: "text", placeholder: "Escribir mensaje...", onKeyDown: handleInputKeyDown, className: "w-full bg-white border-2 border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-bold text-sm outline-none focus:border-[var(--color-primary)] transition-all shadow-inner" }) })] }), _jsxs("button", { onClick: handleToggleChat, className: `
                    h-40 w-14 
                    bg-[var(--color-primary)]
                    hover:brightness-110
                    border-r-[3px] border-y-[3px] border-l-0 border-white
                    rounded-r-xl 
                    flex flex-col items-center justify-center 
                    pl-[4px]
                    shadow-[10px_0px_20px_rgba(0,0,0,0.2)]
                    cursor-pointer outline-none focus:outline-none
                    transition-all duration-300
                    active:scale-95
                    group
                    -ml-[4px]
                    z-0
                `, children: [_jsx("div", { className: `text-white transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`, children: _jsx(ChevronIcon, {}) }), _jsx("div", { className: "mt-3 text-white/90 group-hover:text-white group-hover:scale-110 transition-all flex items-center justify-center", children: MessageIcon })] })] }));
};
