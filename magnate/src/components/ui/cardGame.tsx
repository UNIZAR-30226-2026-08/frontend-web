import React from 'react';

interface GameCardProps {
    type: 'generic' | 'initial';
    headerColor?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    icon?: React.ReactNode;
    price?: number;
    footer?: string;
    children?: React.ReactNode;
}

export const GameCard = ({ type, headerColor, title, subtitle, description, icon, price, footer, children }: GameCardProps) => {
    return (
        <div className="relative w-[375px] h-[575px] bg-white border-2 border-black shadow-[0px_10px_30px_rgba(0,0,0,0.4)] 
                        flex items-center justify-center p-[12px] select-none overflow-hidden shrink-0">
            
            <div className="relative w-full h-full border-2 border-black flex flex-col bg-white overflow-hidden">
                
                {/* Header solo si es generic */}
                {type === 'generic' && headerColor && (
                    <div className="h-20 border-b-2 border-black flex items-center justify-center p-2 shrink-0" 
                         style={{ backgroundColor: headerColor }} >
                        <h3 className="text-black font-black uppercase text-center text-lg leading-tight drop-shadow-sm">
                            FANTASÍA
                        </h3>
                    </div>
                )}

                {type === 'generic' && (
                    <div className="p-6 flex-1 flex flex-col items-center text-center relative">
                        {icon && <div className="mb-4 text-6xl drop-shadow-sm">{icon}</div>}
                        
                        <h2 className="font-black uppercase tracking-tighter mb-1 text-black text-3xl">
                            {title}
                        </h2>

                        {subtitle && (
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest italic">
                                {subtitle}
                            </p>
                        )}

                        <div className="w-full h-0.5 bg-black/10 my-2" />

                        {description && (
                            <p className="text-sm font-medium leading-relaxed text-gray-700 my-4 px-2">
                                {description}
                            </p>
                        )}

                        <div className="w-full">{children}</div>

                        {price && (
                            <div className="mt-auto pt-4 border-t-2 w-full border-dashed border-gray-200">
                                <span className="text-2xl font-black text-[var(--color-secondary)]">{price}€</span>
                            </div>
                        )}
                    </div>
                )}
                {/* {type === 'generic' && footer && (
                    <div className="bg-black text-white p-2 text-[10px] font-bold text-center uppercase tracking-[0.2em] shrink-0">
                        {footer}
                    </div>
                )} */}
            </div>

           {type === 'initial' && (
                <div className="absolute inset-0 z-50 bg-[#081c15] flex items-center justify-center overflow-hidden">
                    <div 
                        className="absolute inset-[-50%] opacity-20 rotate-[30deg]"
                        style={{
                            backgroundImage: `url('/icons/hat_wizard.svg')`,
                            backgroundRepeat: "repeat",
                            backgroundSize: "45px 45px",
                        }}
                    />
                    
                    <div className="relative z-10 flex flex-col items-center w-full px-8">
                        <div className="w-24 h-24 mb-6 border-2 border-[var(--color-secondary)] rounded-full 
                                        flex items-center justify-center bg-[#081c15] shadow-[0_0_30px_rgba(255,201,113,0.3)]">
                            <span className="text-[var(--color-secondary)] text-6xl font-black">?</span>
                        </div>

                        <h2 className="text-[var(--color-secondary)] text-4xl font-black tracking-[0.2em] uppercase text-center drop-shadow-md">
                            Fantasía
                        </h2>

                        {description && (
                            <p className="text-center text-xs font-medium italic text-[var(--color-secondary)]/60 mt-4 px-2">
                                Puedes desvelar esta carta por <span className="text-[var(--color-secondary)] px-1 rounded">0€</span>, 
                                pero si lo haces, ya no podrás elegir la otra carta.
                            </p>
                        )}
                    </div>
                    <div className="absolute inset-4 border-2 border-[var(--color-secondary)]/10 shadow-[inset_0_0_15px_rgba(255,201,113,0.1)] pointer-events-none" />
                </div>
            )}
        </div>
    );
};