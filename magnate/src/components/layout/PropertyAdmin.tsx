import { MortgageContentCard } from "./MortgageLayout";

interface PropertyCardContentProps {
    data: PropertyData;
    isMortgaged?: boolean;
    isAvailable?: boolean; // True if it has already been bought, False otherwise (pay rent)
    constructionLevel: keyof PropertyData['rent']; 
}

export const PropertyAdminCardContent = ({ data, isMortgaged, isAvailable, constructionLevel }:  PropertyCardContentProps ) => {

    if (isMortgaged) {
        return (
            <MortgageContentCard data={data} />
        );
    }
    const getActiveClasses = (level: keyof PropertyData['rent']) => {
        const isActive = constructionLevel === level;
        return isActive 
            ? "text-[var(--color-primary)] font-black scale-[1.07]" 
            : "text-gray-600";
    };
    
    return (
        <div className="w-full h-full bg-white border-2 border-black p-[12px] flex flex-col shadow-2xl">
            <div className="relative w-full h-full border-2 border-black flex flex-col bg-white overflow-hidden">
                
                <div className="h-24 border-b-2 border-black flex flex-col items-center justify-center p-2" 
                    style={{ backgroundColor: data.headerColor }}>
                    <span className="text-[10px] text-black font-bold uppercase tracking-[0.15em] mb-0.5">Título de Propiedad</span>
                    <h3 className="text-black font-black uppercase text-center text-xl leading-tight drop-shadow-sm">{data.name}</h3>
                </div>

                <div className="p-5 flex-1 flex flex-col items-center">
                    <div className="w-full mt-4 space-y-2 text-[20px] font-bold uppercase tracking-tight">
                        
                        {/* Alquiler Base */}
                        <div className="flex justify-center border-b border-black/10 pb-1 text-black font-black">
                            <span>Alquileres {data.rent.base}€</span>
                        </div>

                        {/* Casas y Hotel */}
                        {[
                            { id: 'house1', label: 'Con 1 Casa' },
                            { id: 'house2', label: 'Con 2 Casas' },
                            { id: 'house3', label: 'Con 3 Casas' },
                            { id: 'house4', label: 'Con 4 Casas' },
                            { id: 'hotel', label: 'Con Hotel' }
                        ].map((row, index) => (
                            <div key={row.id} 
                                className={`flex justify-between items-end transition-all duration-200 
                                            ${index === 0 ? 'pt-6' : ''} ${getActiveClasses(row.id as any)}`}>
                                <span className="shrink-0">{row.label}</span>
                                <div className={`flex-1 border-b-2 border-dotted mb-[5px] mx-2 
                                            ${constructionLevel === row.id ? 'border-[var(--color-primary)]' : 'border-gray-600'}`} />
                                <span>{data.rent[row.id as keyof PropertyData['rent']]}€</span>
                            </div>
                        ))}

                    </div>

                    <div className="mt-auto w-full pt-4 space-y-3">
                        <div className="text-center">
                            <p className="text-[12px] font-black uppercase text-gray-800 leading-none select-none">Cada casa cuesta {data.housePrice}€</p>
                            <p className="text-[12px] font-black uppercase text-gray-800 mt-1 select-none">Cada hotel cuesta {data.housePrice}€ más 4 casas</p>
                        </div>
                        <div className="flex flex-col items-center border-t border-gray-300 pt-3">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest select-none">Valor de Hipoteca</p>
                            <span className="text-xl font-black text-black select-none">{data.mortgage}€</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};