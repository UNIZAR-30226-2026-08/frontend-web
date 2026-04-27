import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MortgageContentCard } from "./MortgageLayout";
export const PropertyAdminCardContent = ({ data, isMortgaged, constructionLevel }) => {
    if (isMortgaged) {
        return (_jsx(MortgageContentCard, { data: data }));
    }
    const getActiveClasses = (level) => {
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
    return (_jsx("div", { className: "w-full h-full bg-white border-2 border-black p-[12px] flex flex-col shadow-2xl", children: _jsxs("div", { className: "relative w-full h-full border-2 border-black flex flex-col bg-white overflow-hidden", children: [_jsxs("div", { className: "h-24 border-b-2 border-black flex flex-col items-center justify-center p-2", style: { backgroundColor: isSpecial ? '#ffffff' : data.color }, children: [_jsx("span", { className: "text-[10px] text-black font-bold uppercase tracking-[0.15em] mb-0.5", children: isServer ? "Servidor" : isBridge ? "Puente" : "Título de Propiedad" }), _jsx("h3", { className: "text-black font-black uppercase text-center text-xl leading-tight drop-shadow-sm", children: data.name })] }), isSpecial && (_jsx("div", { className: "border-b-2 border-black flex justify-center items-center h-40 p-4", children: _jsx("img", { src: isServer ? "images/server.png" : "icons/bridge.svg", alt: "tile icon", className: "max-h-full max-w-full object-contain" }) })), _jsxs("div", { className: "p-5 flex-1 flex flex-col items-center", children: [!isSpecial && (_jsxs("div", { className: "w-full mt-4 space-y-2 text-[20px] font-bold uppercase tracking-tight", children: [_jsx("div", { className: "flex justify-center border-b border-black/10 pb-1 text-black font-black", children: _jsxs("span", { children: ["Alquileres ", data.rentPrices?.[0], "M"] }) }), [
                                    { id: 'house1', label: 'Con 1 Casa', idx: 1 },
                                    { id: 'house2', label: 'Con 2 Casas', idx: 2 },
                                    { id: 'house3', label: 'Con 3 Casas', idx: 3 },
                                    { id: 'house4', label: 'Con 4 Casas', idx: 4 },
                                    { id: 'hotel', label: 'Con Hotel', idx: 5 }
                                ].map((row) => (_jsxs("div", { className: `flex justify-between items-end transition-all duration-200 ${getActiveClasses(row.id)}`, children: [_jsx("span", { className: "shrink-0", children: row.label }), _jsx("div", { className: `flex-1 border-b-2 border-dotted mb-[5px] mx-2 
                                                ${constructionLevel === row.id ? 'border-[var(--color-primary)]' : 'border-gray-600'}` }), _jsxs("span", { children: [data.rentPrices?.[row.idx], "M"] })] }, row.id)))] })), isSpecial && (_jsx("div", { className: "w-full mt-8 space-y-6", children: _jsxs("div", { className: "w-full mt-4 space-y-2 text-[20px] font-bold uppercase tracking-tight text-black", children: [_jsx("div", { className: "flex justify-center border-b border-black/10 pb-1 text-black font-black", children: _jsx("span", { children: "Alquileres" }) }), _jsxs("div", { className: "flex justify-between items-end text-gray-600 pt-6", children: [_jsxs("span", { className: "shrink-0", children: ["Con 1 ", typeLabel] }), _jsx("div", { className: "flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" }), _jsxs("span", { children: [data.rentPrices[0], "M"] })] }), _jsxs("div", { className: "flex justify-between items-end text-gray-600", children: [_jsxs("span", { className: "shrink-0", children: ["Con 2 ", typeLabel] }), _jsx("div", { className: "flex-1 border-b-2 border-dotted border-gray-400 mb-[5px] mx-2" }), _jsxs("span", { children: [data.rentPrices[1], "M"] })] })] }) })), _jsxs("div", { className: "mt-auto w-full pt-4 space-y-3", children: [!isSpecial && (_jsxs("div", { className: "text-center", children: [_jsxs("p", { className: "text-[12px] font-black uppercase text-gray-800 leading-none select-none", children: ["Cada casa cuesta ", data.buildPrice, "M"] }), _jsxs("p", { className: "text-[12px] font-black uppercase text-gray-800 mt-1 select-none", children: ["Cada hotel cuesta ", data.buildPrice, "M m\u00E1s 4 casas"] })] })), _jsxs("div", { className: "flex flex-col items-center border-t border-gray-300 pt-3", children: [_jsx("p", { className: "text-[10px] font-black uppercase text-gray-400 tracking-widest select-none", children: "Valor de Hipoteca" }), _jsxs("span", { className: "text-xl font-black text-black select-none", children: [data.buyPrice / 2, "M"] })] })] })] })] }) }));
};
