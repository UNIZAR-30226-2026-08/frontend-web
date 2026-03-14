import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { PageHeader } from '@/components/layout/PageHeader'; 

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { volumes, updateVolume, mutes, toggleMute, playSound } = useAudio();

    if (!isOpen) return null;

    const handleClose = () => {
        playSound('button_back');
        onClose();
    };

    const VolumeSlider = ({ label, channel }: { label: string, channel: 'bg' | 'sfx' | 'ui' }) => (
        <div className="flex flex-col gap-2 mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-800 font-black uppercase tracking-widest text-xl">{label}</span>
                <button 
                    onClick={() => {
                        toggleMute(channel);
                        playSound('button_main');
                    }}
                    className={`px-6 py-2 rounded-xl text-sm font-black tracking-widest uppercase transition-all shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-none ${
                        mutes[channel] 
                        ? 'bg-red-500 text-white border-2 border-red-700' 
                        : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300 border-2 border-zinc-300'
                    }`}
                >
                    {mutes[channel] ? 'Muted' : 'Mute'}
                </button>
            </div>
            
            <div className="py-4">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volumes[channel]}
                    onChange={(e) => updateVolume(channel, e.target.value)}
                    onMouseUp={() => playSound('slidebar_up')}
                    onTouchEnd={() => playSound('slidebar_up')}
                    className={`
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
                    `}
                    disabled={mutes[channel]}
                    style={{ opacity: mutes[channel] ? 0.5 : 1 }}
                />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white animate-in fade-in zoom-in-95 duration-200">
                <PageHeader 
                    title="Ajustes" 
                    showBackButton={true} 
                    onBack={handleClose} 
                    position="relative" 
                />

                <div className="p-12 pt-8 w-full relative">
                    <VolumeSlider label="Volumen de Música" channel="bg" />
                    <VolumeSlider label="Volumen de Efectos" channel="sfx" />
                    <VolumeSlider label="Volumen de Interfaz" channel="ui" />
                </div>
            </div>
        </div>
    );
};
