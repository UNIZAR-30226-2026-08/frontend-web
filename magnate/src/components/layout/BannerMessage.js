import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { EventBus } from "@/EventBus";
import { useAudio } from '@/context/AudioContext';
export function BannerMessage() {
    const { playSound } = useAudio();
    const [banner, setBanner] = useState({
        visible: false,
        message: "",
        bgColor: "var(--color-primary)",
        exiting: false,
    });
    useEffect(() => {
        let timeoutId;
        const handleShowBanner = (data) => {
            playSound('turn_banner_in');
            clearTimeout(timeoutId);
            setBanner({
                visible: true,
                message: data.message,
                bgColor: data.color || "var(--color-primary)",
                exiting: false,
            });
        };
        const handleHideBanner = () => {
            playSound('turn_banner_out');
            setBanner((prev) => ({ ...prev, exiting: true }));
            timeoutId = setTimeout(() => {
                setBanner((prev) => ({ ...prev, visible: false, exiting: false }));
            }, 500);
        };
        EventBus.on("show-banner", handleShowBanner);
        EventBus.on("hide-banner", handleHideBanner);
        return () => {
            EventBus.off("show-banner", handleShowBanner);
            EventBus.off("hide-banner", handleHideBanner);
            clearTimeout(timeoutId);
        };
    }, [playSound]);
    if (!banner.visible)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none overflow-hidden", children: [_jsx("div", { className: `absolute inset-0 bg-black/40 backdrop-blur-sm duration-500 ${banner.exiting ? "animate-out fade-out" : "animate-in fade-in"}` }), _jsxs("div", { className: `relative w-full border-y-4 border-white flex items-center justify-center shadow-2xl duration-500 ${banner.exiting ? "animate-out slide-out-to-right-full" : "animate-in slide-in-from-left-full"}`, style: { height: "200px", backgroundColor: banner.bgColor }, children: [_jsxs("svg", { className: "absolute inset-0 w-full h-full opacity-15 pointer-events-none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("defs", { children: _jsx("pattern", { id: "banner-money-pattern", width: "60", height: "40", patternUnits: "userSpaceOnUse", patternTransform: "rotate(-25)", children: _jsx("image", { href: "/icons/money.svg", width: "50", height: "50", preserveAspectRatio: "none" }) }) }), _jsx("rect", { width: "100%", height: "100%", fill: "url(#banner-money-pattern)" })] }), _jsx("h1", { className: "text-5xl md:text-7xl text-white font-extrabold tracking-tight whitespace-nowrap select-none z-10 drop-shadow-md", children: banner.message })] })] }));
}
