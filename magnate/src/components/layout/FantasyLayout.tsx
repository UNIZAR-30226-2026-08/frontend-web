
export const FantasyCardContent = ({ data, isBack }: { data?: any, isBack?: boolean }) => {
    if (isBack) {
        return (
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
                        
                        <p className="text-center text-xs font-medium italic text-[var(--color-secondary)]/60 mt-4 px-2">
                            Puedes desvelar esta carta por <span className="text-[var(--color-secondary)] px-1 rounded">0€</span>, 
                            pero si lo haces, ya no podrás elegir la otra carta.
                        </p>
                        
                    </div>
                    <div className="absolute inset-4 border-2 border-[var(--color-secondary)]/10 shadow-[inset_0_0_15px_rgba(255,201,113,0.1)] pointer-events-none" />
                </div>
        );
    }

    return ( 
        <div className="w-full h-full bg-white border-2 border-black p-[12px] flex flex-col shadow-2xl">
            
            <div className="relative w-full h-full border-2 border-black flex flex-col bg-white overflow-hidden">
                
                <div className="h-20 border-b-2 border-black flex items-center justify-center p-2 shrink-0 bg-[var(--color-secondary)]" >
                    <h3 className="text-black font-black uppercase text-center text-lg leading-tight drop-shadow-sm">
                        FANTASÍA
                    </h3>
                </div>

                <div className="p-5 flex-1 flex flex-col items-center text-center relative h-full">
                    
                    <h2 className="font-black uppercase tracking-tighter mb-1 text-black text-2xl leading-none">
                        {data.title}
                        
                    </h2>
                    <div className="w-full h-0.5 bg-black/10 my-2" />
                    
                    <p className="text-sm font-medium leading-relaxed text-gray-700 my-4 px-2">
                        {data.description}
                    </p>

                    {data.price !== undefined && data.price !== 0 && (
                        <div className="mt-auto pt-3 border-t-2 w-full border-dashed border-gray-300">
                                <p className="text-[9px] font-black uppercase text-gray-400 mb-0.5 tracking-widest">Valor de Compra</p>
                                <span className="text-3xl font-black text-[var(--color-secondary)] leading-none">
                                    {data.buyPrice}M
                                </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    
    );
        
};