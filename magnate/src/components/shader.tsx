import React from 'react';

const ShaderLoading = ({ 
  text = "Cargando...", speed = 1.7, 
  jump = 15, size = 60, color = "var(--color-primary)" }) => {
  
    return (
   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', background: 'var(--color-background)' }}>
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); filter: hue-rotate(0deg); }
          50% { transform: translateY(-${jump}px); filter: hue-rotate(45deg); }
        }
      `}</style>

      <div style={{
        fontSize: `${size}px`,
        fontWeight: 'bold',
        display: 'flex',
        background: `linear-gradient(90deg, ${color})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
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

