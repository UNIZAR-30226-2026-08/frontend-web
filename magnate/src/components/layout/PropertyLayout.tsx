import { MortgageContentCard } from "./MortgageLayout";

interface PropertyCardContentProps {
    data: PropertyData;
    isMortgaged?: boolean;
    isAvailable?: boolean; // True if it has already been bought, False otherwise (pay rent)
	constructionLevel: keyof PropertyData['rent']; 
}

export const PropertyCardContent = ({ data, isMortgaged, isAvailable, constructionLevel }:  PropertyCardContentProps ) => {

    if (isMortgaged) {
        return (
            <MortgageContentCard data={data} />
        );
    }

    return (
        <div className="w-full h-full bg-white border-2 border-black p-[12px] flex flex-col shadow-2xl">
            <div className="relative w-full h-full border-2 border-black flex flex-col bg-white overflow-hidden">
                
                <div className="h-24 border-b-2 border-black flex flex-col items-center justify-center p-2" 
                    style={{ backgroundColor: data.headerColor }}>
                    
                    <span className="text-[10px] text-black font-bold uppercase tracking-[0.15em] mb-0.5">
                        Título de Propiedad
                    </span>
                    
                    <h3 className="text-black font-black uppercase text-center text-xl leading-tight drop-shadow-sm">
                        {data.name}
                    </h3>
                </div>

                <div className="p-5 flex-1 flex flex-col items-center">

                    {/* Alquileres */}
                    <div className="w-full mt-4 space-y-2 text-[20px] font-bold uppercase tracking-tight text-black">
                        
                        <div className="flex justify-center border-b border-black/10 pb-1 text-black font-black">
                            <span>Alquileres {data.rent.base}€</span>
                        </div>

                        {/* Con 1 Casa */}
                        <div className="flex justify-between items-end text-gray-600 pt-6">
                            <span className="shrink-0">Con 1 Casa</span>
                            <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                            <span>{data.rent.house1}€</span>
                        </div>

                        {/* Con 2 Casas */}
                        <div className="flex justify-between items-end text-gray-600">
                            <span className="shrink-0">Con 2 Casas</span>
                            <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                            <span>{data.rent.house2}€</span>
                        </div>

                        {/* Con 3 Casas */}
                        <div className="flex justify-between items-end text-gray-600">
                            <span className="shrink-0">Con 3 Casas</span>
                            <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                            <span>{data.rent.house3}€</span>
                        </div>

                        {/* Con 4 Casas */}
                        <div className="flex justify-between items-end text-gray-600">
                            <span className="shrink-0">Con 4 Casas</span>
                            <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                            <span>{data.rent.house4}€</span>
                        </div>

                        {/* HOTEL */}
                        <div className="flex justify-between items-end text-gray-600">
                            <span className="shrink-0">Con Hotel</span>
                            <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                            <span>{data.rent.hotel}€</span>
                        </div>
                    </div>

                    <div className="mt-auto w-full pt-4 space-y-3">
                        
                        <div className="text-center">
                            <p className="text-[12px] font-black uppercase text-gray-800 leading-none">
                                Cada casa cuesta {data.housePrice}€
                            </p>
                            <p className="text-[12px] font-black uppercase text-gray-800 mt-1">
                                Cada hotel cuesta {data.housePrice}€ más 4 casas
                            </p>
                        </div>

                        {/* Hipoteca */}
                        <div className="flex flex-col items-center border-t border-gray-300 pt-3">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Valor de Hipoteca</p>
                            <span className="text-xl font-black text-black">{data.mortgage}€</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
