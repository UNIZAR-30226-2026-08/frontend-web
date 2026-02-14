import React from 'react';

const ShaderLoading = ({
  text = "Cargando...",
  speed = 2.5,
  jump = 10,
  size = 35,
  color = "white",
  delayOffset = 0
}) => {

  const animationName = `wave-${jump}`;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <style>
        {`
          @keyframes ${animationName} {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-${jump}px); }
          }
        `}
      </style>

      <div
        style={{
          fontSize: `${size}px`,
          fontWeight: '900',
          display: 'flex',
          color: color, 
          padding: `${jump + 5}px 0`,
        }}
      >
        {text.split('').map((char, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              animation: `${animationName} ${speed}s ease-in-out infinite`,
              animationDelay: `${(i + delayOffset) * 0.1}s`,
              minWidth: char === ' ' ? '0.5em' : 'auto' 
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ShaderLoading;
