import React, { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';

interface JailData {
    tileId: string;
    turnCount: number;
    isPrisoner: boolean;
}

interface DecisionData {
    tileId: string;
    tileName: string;
    mode: 'free' | 'pay' | 'stay';
    turnCount: number;
}

export const JailOverlay = () => {
    const [propData, setpropData] = useState<JailData | null>(null);
    const [hasRolled, setHasRolled] = useState(false);
    const [decisionData, setDecisionData] = useState<DecisionData | null>(null);

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

    useEffect(() => {
        const handleOpen = (data: JailData) => {
            setpropData(data);
            setDecisionData(null);
            setHasRolled(false);
            EventBus.emit('dark-mode', true);
        };
        const handleDecision = (data: DecisionData) => {
            setDecisionData(data);
        };

        EventBus.on('open-jail-overlay', handleOpen);
        EventBus.on('show-jail-decision-popup', handleDecision);

        return () => { 
            EventBus.off('open-jail-overlay', handleOpen); 
            EventBus.off('show-jail-decision-popup', handleDecision); };
    }, []);

    if (!propData && !decisionData) return null;

    const confirmDecision = () => {
        if (!decisionData) return;

        if (decisionData.mode === 'pay') {
            //EventBus.emit('execute-jail-bail-payment', { amount: 50 });
            //EventBus.emit('execute-in-jail-travel', { targetId: decisionData.tileId });
            EventBus.emit('action-pay-bail', { to_pay: true });
        } else if (decisionData.mode === 'stay') {
            EventBus.emit('action-pay-bail', { to_pay: false });
        }
        close();
        EventBus.emit('clear-dice');
    };

    const reOpenSelection = () => {
        setDecisionData(null);
        EventBus.emit('dark-mode', true);
        EventBus.emit('jail-re-enable-selection');
    };

    const close = () => {
        setpropData(null);
        setDecisionData(null);
        EventBus.emit('dark-mode', false);
        EventBus.emit('close-overlay');
    };
    console.log("turno; ", decisionData?.turnCount);
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/10 backdrop-blur-sm p-6 animate-in fade-in duration-300">
            
            {decisionData && (
                <div className="w-full max-w-sm rounded-[40px] p-10 flex flex-col items-center gap-6 border-2 border-slate-400 animate-in zoom-in-95"
                style={stripedBackgroundStyle}>
                    <h3 className="text-2xl font-black uppercase italic text-slate-800 text-center">
                        {decisionData.mode === 'stay' ? '¿Quedarse?' : '¿Avanzar?'}
                    </h3>
                    <p className="text-slate-500 font-bold text-center leading-tight">
                        {decisionData.mode === 'stay' 
                            ? "Permanecerás en Secretaría y pasarás el turno." 
                            : `Pagarás 50M para ir a ${decisionData.tileName}.`}
                    </p>
                    <div className="flex flex-col gap-4">
                        <Button onClick={confirmDecision} 
                                className={`text-[14px] h-12 bg-[var(--color-primary)] text-white rounded-full font-black uppercase ${bouncyAnimation}`}>
                            Confirmar
                        </Button>
                        {decisionData.turnCount <= 3 && (
                            <Button onClick={reOpenSelection}
                                    className={`h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[14px] rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`}>
                                Elegir otra casilla
                            </Button>
                        )}
                    </div>
                </div>
            )} 
            {propData && !decisionData && (
                <div className="w-full max-w-sm rounded-[50px] border-4 border-white overflow-hidden bg-cover shadow-2xl" style={stripedBackgroundStyle}>
                    <div className="pt-10 text-center">
                        <h2 className="text-3xl font-black italic uppercase text-slate-800 tracking-tighter">
                            {propData?.isPrisoner ? 'Secretaría' : 'Solo Visitas'}
                        </h2>
                    </div>

                    <div className="p-10 flex flex-col items-center gap-6">
                        {!propData?.isPrisoner ? (
                            <>
                                <p className="text-slate-500 font-bold text-center">Estás de visita. No tienes deudas pendientes.</p>
                                <Button onClick={close} className={`h-12 px-10 bg-[var(--color-primary)] text-white rounded-full font-black uppercase text-lg ${bouncyAnimation}`}>
                                    Continuar
                                </Button>
                            </>
                        ) : ( 
                            <div className="w-full space-y-4">
                                <div className="bg-white/60 p-4 rounded-3xl border border-slate-200 text-center">
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Condena en curso</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {propData.turnCount >= 3 ? "¡Último turno! Salida obligatoria." : `Turno ${propData.turnCount} de 3`}
                                    </p> 
                                </div>
                                <div className="flex flex-col gap-3 w-full items-center">
                                    <Button disabled={hasRolled} 
                                        onClick={() => { 
                                            setHasRolled(true);
                                            EventBus.emit('start-jail-roll-sequence'); 
                                            setpropData(null);
                                        }}
                                        className={`w-38 h-10 bg-[var(--color-primary)] text-white rounded-full font-black uppercase text-[18px] ${bouncyAnimation}`}>
                                        Tirar dados
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
