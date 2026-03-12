
interface ServiceData {
    title: string;
    typeName: string;
    image: string;
    price: number;
    rent: {
        one: number;
        all: number;
    };
    mortgage: number;
}

interface ServiceCardContentProps {
    data: ServiceData;
    isMortgaged?: boolean;
    isAvailable?: boolean; // True if it has already been bought, False otherwise (pay rent)
	hasAll?: keyof ServiceData['rent']; 		// Has every one of this group
}

export const ServiceCardContent = ({ data, isMortgaged, isAvailable, hasAll }:  ServiceCardContentProps ) => {

    if (isMortgaged) {
        return (
            <div className="w-full h-full bg-white border-2 border-black p-[12px] flex flex-col shadow-2xl">
                <div className="relative w-full h-full border-[8px] border-[#e63946] flex flex-col bg-white items-center justify-between p-6 text-center overflow-hidden">
                    
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #e63946 0, #e63946 1px, transparent 0, transparent 50%)',
                        backgroundSize: '10px 10px' }} />

                    <div className="z-10 w-full">
                        <div className="font-black text-[#e63946] text-xs uppercase tracking-[0.3em] mb-1">
							<h3>{data.typeName}</h3>
                        </div>
                        <h2 className="text-2xl font-black uppercase text-black leading-tight border-b-2 border-black pb-2 mx-4">
                            {data.title}
                        </h2>
                    </div>
                    
                    <div className="z-10 py-4 w-full">
                        <div className="bg-[#e63946] text-white py-2 px-4 rotate-[-2deg] shadow-lg mb-4">
                            <span className="text-3xl font-black uppercase tracking-tighter">Hipotecada</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Hipotecado por</p>
                            <span className="text-5xl font-black text-black tracking-tighter">
                                {Math.floor(data.mortgage * 1.1)}€
                            </span>
                        </div>
                    </div>
                    <div className="z-10 w-full border-t border-gray-200 pt-4">
                        <p className="text-[11px] leading-tight text-gray-400 font-bold uppercase italic px-2">
                            "Como esta casilla esta hipotecada, no hace falta pagar a su propietario"
                        </p>
                    </div>

                </div>
            </div>
        );
}
    
    return (
        <div className="w-full h-full bg-white border-2 border-black p-[12px] flex flex-col shadow-2xl">
            <div className="relative w-full h-full border-2 border-black flex flex-col bg-white overflow-hidden">
                
                <div className="h-24 border-b-2 border-black flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] text-black font-bold uppercase tracking-[0.15em] mb-0.5">
						{data.typeName}
                    </span>
                    
                    <h3 className="text-black font-black uppercase text-center text-xl leading-tight drop-shadow-sm">
                        {data.title}
                    </h3>
                </div>
				<div className="border-b-2 border-black flex justify-center items-center h-40 p-4">
				    <img
				        src={data.image}
				        alt="tile icon"
				        className="max-h-full max-w-full object-contain"
				    />
				</div>

                <div className="p-5 flex-1 flex flex-col items-center">

                    {/* Alquileres */}
                    <div className="w-full mt-4 space-y-2 text-[20px] font-bold uppercase tracking-tight text-black">
                        
                        <div className="flex justify-center border-b border-black/10 pb-1 text-black font-black">
                            <span>Alquileres</span>
                        </div>

                        {/* Con 1 del grupo*/}
                        <div className="flex justify-between items-end text-gray-600 pt-6">
                            <span className="shrink-0">Con 1 {data.typeName}</span>
                            <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                            <span>{data.rent.one}€</span>
                        </div>

                        {/* Con los 2 del grupo */}
                        <div className="flex justify-between items-end text-gray-600">
                            <span className="shrink-0">Con 2 {data.typeName}</span>
                            <div className="flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" />
                            <span>{data.rent.all}€</span>
                        </div>

                    </div>

                    <div className="mt-auto w-full  pt-4 space-y-3">
                        
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
