import React from 'react';

const Spinner = ({ size = 36 }) => {
    const colors = ['#2B7FFF', '#9810fa', '#9810fa'];
    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['#2B7FFF', '#9810fa', '#9810fa'].map((c, i) => (
                <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: c,
                    boxShadow: `0 0 8px ${c}80`,
                    animation: `pulseDot 1.4s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                }} />
            ))}
            <style>{`@keyframes pulseDot { 0%,80%,100%{transform:scale(.6);opacity:.3} 40%{transform:scale(1.2);opacity:1} }`}</style>
        </div>
    );
};

export default Spinner;