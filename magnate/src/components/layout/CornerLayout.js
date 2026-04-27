import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CornerTileContent = ({ image, tileText, sound }) => {
    return (_jsx("div", { className: "relative w-[380px] h-[380px] flex items-center justify-center border border-neutral-300 bg-[var(--color-text)]", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("img", { src: image, alt: "tile icon", className: "w-[300px] object-contain mb-4" }), _jsx("span", { className: "absolute bottom-2 text md:text-3xl font-bold mt-2 text-[var(--color-black)]", children: tileText })] }) }));
};
