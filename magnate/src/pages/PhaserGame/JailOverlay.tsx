import React, { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';
import { GameLogicManager } from '@/phaser/managers/GameLogicManager';

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
        const myId = localStorage.getItem('myId');
        const handleOpen = (data: JailData) => {
            console.log("Entro en jail overlay", data);
            let currentTurns = data.turnCount;
            if (myId) {
                const me = GameLogicManager.getInstance().model.getPlayer(myId);
                if (me) currentTurns = me.jailRemainingTurns;
            }
            setpropData({ ...data, turnCount: currentTurns });
            // setpropData(data);
            setDecisionData(null);
            setHasRolled(false);
            EventBus.emit('dark-mode', true);
        };
        
        const handleDecision = (data: DecisionData) => {
            let currentTurns = data.turnCount;
            if (myId) {
                const me = GameLogicManager.getInstance().model.getPlayer(myId);
                if (me) currentTurns = me.jailRemainingTurns;
            }
            setDecisionData({ ...data, turnCount: currentTurns });
            //setDecisionData(data);
        };

        const handleModelUpdate = (model: any) => {
            if (!myId) return;
            const me = model.getPlayer(myId);

            if (me && me.currentTileId === '201') {
                setpropData(prev => prev ? { ...prev, turnCount: me.jailRemainingTurns } : null);
                setDecisionData(prev => prev ? { ...prev, turnCount: me.jailRemainingTurns } : null);
            }
        };

        EventBus.on('model-updated', handleModelUpdate);
        EventBus.on('open-jail-overlay', handleOpen);
        EventBus.on('show-jail-decision-popup', handleDecision);

        return () => { 
            EventBus.off('model-updated', handleModelUpdate);
            EventBus.off('open-jail-overlay', handleOpen); 
            EventBus.off('show-jail-decision-popup', handleDecision); };
    }, []);

    if (!propData && !decisionData) return null;
    
    const canAffordBail = () => {
        const myId = localStorage.getItem('myId');
        if (!myId) return false;
        const me = GameLogicManager.getInstance().model.getPlayer(myId);
        return (me?.balance || 0) >= 50;
    };

    const confirmDecision = () => {
        if (!decisionData) return;

        if (decisionData.mode === 'pay') {
            if (!canAffordBail()) {
                EventBus.emit('show-toast', {
                    message: "No tienes suficiente dinero (50M) para pagar la fianza.",
                    type: 'error'
                });
                return;
            }
            EventBus.emit('action-pay-bail', { to_pay: true });
        } else if (decisionData.mode === 'stay') {
            EventBus.emit('action-pay-bail', { to_pay: false });
        }
        close();
        EventBus.emit('clear-dice');
    };

    const reOpenSelection = () => {
        setDecisionData(null);
        // EventBus.emit('dark-mode', true);
        EventBus.emit('jail-re-enable-selection');
    };

    const close = () => {
        setpropData(null);
        setDecisionData(null);
        EventBus.emit('dark-mode', false);
        EventBus.emit('close-overlay');
    };
    console.log("turno de decision; ", decisionData?.turnCount);
    console.log("turno de propData; ", propData?.turnCount);
    
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
                                            EventBus.emit('action-throw-dices');
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
