import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const GameCard = ({ isFlipped, front, back, onClick }) => {
    return (_jsx("div", { className: "w-[375px] h-[575px] [perspective:1000px] cursor-pointer group", onClick: onClick, children: _jsxs("div", { className: `relative w-full h-full duration-700 [transform-style:preserve-3d] 
                            ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`, children: [_jsx("div", { className: "absolute inset-0 z-20 [backface-visibility:hidden]", children: back }), _jsx("div", { className: "absolute inset-0 z-10 [backface-visibility:hidden] [transform:rotateY(180deg)]", children: front })] }) }));
};
