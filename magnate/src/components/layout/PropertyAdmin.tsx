import { MortgageContentCard } from "./MortgageLayout";


export const PropertyAdminCardContent = ({ data, isMortgaged, constructionLevel }: any) => {

    if (isMortgaged) {
        return (
            <MortgageContentCard data={data} />
        );
    }
    const getActiveClasses = (level: any) => {
        const isActive = constructionLevel === level;
        return isActive 
            ? "text-[var(--color-primary)] font-black scale-[1.07]" 
            : "text-gray-600";
    };
    const isServer = data.group === 13;
    const isBridge = data.group === 14;
    const isSpecial = isServer || isBridge;

    const iconPath = isServer ? "/icons/server_icon.svg" : "/icons/bridge_icon.svg";
    const typeLabel = isServer ? "Servidor" : "Puente";
    
    return (
        <div className="w-full h-full bg-white border-2 border-black p-[12px] flex flex-col shadow-2xl">
            <div className="relative w-full h-full border-2 border-black flex flex-col bg-white overflow-hidden">
            
                <div className="h-24 border-b-2 border-black flex flex-col items-center justify-center p-2"
                    style={{ backgroundColor: isSpecial ? '#ffffff' : data.color }}>
                    <span className="text-[10px] text-black font-bold uppercase tracking-[0.15em] mb-0.5">
						 {isServer ? "Servidor" : isBridge ? "Puente" : "Título de Propiedad"}
                    </span>
                    
                    <h3 className="text-black font-black uppercase text-center text-xl leading-tight drop-shadow-sm">
                        {data.name}
                    </h3>
                </div>
                {isSpecial && (
                    <div className="border-b-2 border-black flex justify-center items-center h-40 p-4">
                    
                        <img
                            src={isServer ? "images/server.png" : "icons/bridge.svg"} 
                            alt="tile icon"
                            className="max-h-full max-w-full object-contain"
                        />
                    
                    </div>
                )}

                <div className="p-5 flex-1 flex flex-col items-center">
                    {!isSpecial && (
                        <div className="w-full mt-4 space-y-2 text-[20px] font-bold uppercase tracking-tight">
                            {/* Alquiler Base */}
                            <div className="flex justify-center border-b border-black/10 pb-1 text-black font-black">
                                <span>Alquileres {data.rentPrices?.[0]}M</span>
                            </div>

                            {/* Casas y Hotel */}
                            {[
                                { id: 'house1', label: 'Con 1 Casa', idx: 1 },
                                { id: 'house2', label: 'Con 2 Casas', idx: 2 },
                                { id: 'house3', label: 'Con 3 Casas', idx: 3 },
                                { id: 'house4', label: 'Con 4 Casas', idx: 4 },
                                { id: 'hotel', label: 'Con Hotel', idx: 5 }
                            ].map((row) => (
                                <div key={row.id} 
                                    className={`flex justify-between items-end transition-all duration-200 ${getActiveClasses(row.id)}`}>
                                    <span className="shrink-0">{row.label}</span>
                                    <div className={`flex-1 border-b-2 border-dotted mb-[5px] mx-2 
                                                ${constructionLevel === row.id ? 'border-[var(--color-primary)]' : 'border-gray-600'}`} />
                                    <span>{data.rentPrices?.[row.idx]}M</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {isSpecial && (
                        <div className="w-full mt-8 space-y-6">
                            <div className="w-full mt-4 space-y-2 text-[20px] font-bold uppercase tracking-tight text-black">
                        
                                <div className="flex justify-center border-b border-black/10 pb-1 text-black font-black">
                                    <span>Alquileres</span>
                                </div>

                                {/* Con 1 del grupo*/}
                                <div className="flex justify-between items-end text-gray-600 pt-6">
                                    <span className="shrink-0">Con 1 {typeLabel}</span>
                                    <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                                    <span>{data.rentPrices[0]}M</span>
                                </div>

                                {/* Con los 2 del grupo */}
                                <div className="flex justify-between items-end text-gray-600">
                                    <span className="shrink-0">Con 2 {typeLabel}</span>
                                    <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                                    <span>{data.rentPrices[1]}M</span>
                                </div>

                            </div>
                        </div>
                    )}

                    <div className="mt-auto w-full pt-4 space-y-3">
                        {!isSpecial && (
                            <div className="text-center">
                                <p className="text-[12px] font-black uppercase text-gray-800 leading-none select-none">Cada casa cuesta {data.buildPrice}M</p>
                                <p className="text-[12px] font-black uppercase text-gray-800 mt-1 select-none">Cada hotel cuesta {data.buildPrice}M más 4 casas</p>
                            </div>
                        )}
                        <div className="flex flex-col items-center border-t border-gray-300 pt-3">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest select-none">Valor de Hipoteca</p>
                            <span className="text-xl font-black text-black select-none">{data.buyPrice/2}M</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
