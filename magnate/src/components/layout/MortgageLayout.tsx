
export const MortgageContentCard = ({ data }: { data?: any }) => {

    return (
        <div className="w-full h-full bg-white border-2 border-black p-[12px] flex flex-col shadow-2xl">
            <div className="relative w-full h-full border-[8px] border-[#e63946] flex flex-col bg-white items-center justify-between p-6 text-center overflow-hidden">
                
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #e63946 0, #e63946 1px, transparent 0, transparent 50%)',
                    backgroundSize: '10px 10px' }} />

                <div className="z-10 w-full">
                    <div className="font-black text-[#e63946] text-xs uppercase tracking-[0.3em] mb-1">
                        Título de Propiedad
                    </div>
                    <h2 className="text-2xl font-black uppercase text-black leading-tight border-b-2 border-black pb-2 mx-4">
                        {data.name}
                    </h2>
                </div>
                
                <div className="z-10 py-4 w-full">
                    <div className="bg-[#e63946] text-white py-2 px-4 rotate-[-2deg] shadow-lg mb-4">
                        <span className="text-3xl font-black uppercase tracking-tighter">Hipotecada</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Hipotecado por</p>
                        <span className="text-5xl font-black text-black tracking-tighter">
                            {data.buyPrice/2}M
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
