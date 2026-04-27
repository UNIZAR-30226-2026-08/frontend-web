import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ShaderLoading = ({ text = "Cargando...", speed = 2.5, jump = 10, size = 35, color = "white", delayOffset = 0 }) => {
    const animationName = `wave-${jump}`;
    return (_jsxs("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' }, children: [_jsx("style", { children: `
          @keyframes ${animationName} {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-${jump}px); }
          }
        ` }), _jsx("div", { style: {
                    fontSize: `${size}px`,
                    fontWeight: '900',
                    display: 'flex',
                    color: color,
                    padding: `${jump + 5}px 0`,
                }, children: text.split('').map((char, i) => (_jsx("span", { style: {
                        display: 'inline-block',
                        animation: `${animationName} ${speed}s ease-in-out infinite`,
                        animationDelay: `${(i + delayOffset) * 0.1}s`,
                        minWidth: char === ' ' ? '0.5em' : 'auto'
                    }, children: char }, i))) })] }));
};
export default ShaderLoading;
