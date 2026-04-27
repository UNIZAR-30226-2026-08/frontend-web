import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAudio } from '@/context/AudioContext';
import { PageHeader } from '@/components/layout/PageHeader';
export const SettingsModal = ({ isOpen, onClose }) => {
    const { volumes, updateVolume, mutes, toggleMute, playSound } = useAudio();
    if (!isOpen)
        return null;
    const handleClose = () => {
        playSound('button_back');
        onClose();
    };
    const VolumeSlider = ({ label, channel }) => (_jsxs("div", { className: "flex flex-col gap-2 mb-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-zinc-800 font-black uppercase tracking-widest text-xl", children: label }), _jsx("button", { onClick: () => {
                            toggleMute(channel);
                            playSound('toggle_settings');
                        }, className: `px-6 py-2 rounded-xl text-sm font-black tracking-widest uppercase transition-all shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-none ${mutes[channel]
                            ? 'bg-red-500 text-white border-2 border-red-700'
                            : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300 border-2 border-zinc-300'}`, children: mutes[channel] ? 'Muted' : 'Mute' })] }), _jsx("div", { className: "py-4", children: _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: volumes[channel], onChange: (e) => updateVolume(channel, e.target.value), onMouseUp: () => playSound('slidebar_up'), onTouchEnd: () => playSound('slidebar_down'), className: `
                        w-full h-5 bg-zinc-200 rounded-full appearance-none cursor-pointer shadow-inner border-2 border-black/10
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-10
                        [&::-webkit-slider-thumb]:h-10
                        [&::-webkit-slider-thumb]:bg-[var(--color-primary)]
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)]
                        [&::-webkit-slider-thumb]:border-4
                        [&::-webkit-slider-thumb]:border-white
                        [&::-webkit-slider-thumb]:active:scale-95
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-moz-range-thumb]:w-10
                        [&::-moz-range-thumb]:h-10
                        [&::-moz-range-thumb]:bg-[var(--color-primary)]
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)]
                        [&::-moz-range-thumb]:border-4
                        [&::-moz-range-thumb]:border-white
                        [&::-moz-range-thumb]:active:scale-95
                        [&::-moz-range-thumb]:transition-transform
                    `, disabled: mutes[channel], style: { opacity: mutes[channel] ? 0.5 : 1 } }) })] }));
    return (_jsxs("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-auto", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: handleClose }), _jsxs("div", { className: "relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white animate-in fade-in zoom-in-95 duration-200 flex flex-col", children: [_jsx(PageHeader, { title: "Ajustes", showBackButton: true, onBack: handleClose, position: "relative" }), _jsxs("div", { className: "p-12 pt-8 w-full overflow-y-auto", style: {
                            backgroundImage: `url('/pattern.svg'), linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))`,
                            backgroundRepeat: "repeat",
                            backgroundBlendMode: "overlay",
                        }, children: [_jsx(VolumeSlider, { label: "Volumen de M\u00FAsica", channel: "bg" }), _jsx(VolumeSlider, { label: "Volumen de Efectos", channel: "sfx" }), _jsx(VolumeSlider, { label: "Volumen de Interfaz", channel: "ui" })] })] })] }));
};
