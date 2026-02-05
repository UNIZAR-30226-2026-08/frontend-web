import React from 'react';

const ShaderLoading = ({
  text = "Cargando...", speed = 1.7, 
  jump = 15, size = 80, color = "var(--color-text-secondary)" }) => {
  
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', 
                    height: '100vh',
                    width: '100%',
                    boxSizing: 'border-box',
                    position:'absolute',
                    }}>
        <style>{`
          @keyframes wave {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-${jump}px);}
          }
        `}</style>

        <div 
          style={{
          fontSize: `${size}px`,
          fontWeight: 'bold',
          display: 'flex',
          background: `linear-gradient(90deg, ${color})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin:'20px',
        }}>
          {text.split('').map((char, i) => (
            <span key={i} style={{
              display: 'inline-block',
              animation: `wave ${speed}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`
            }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
  );
};

export default ShaderLoading;

