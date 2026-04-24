import React from 'react';

const Spinner = ({ size = 36 }) => {
    const colors = ['#2B7FFF', '#9810fa', '#9810fa'];
    return (
        <div className="flex gap-2 items-center">
            {colors.map((c, i) => (
                <div key={i}
                    className="w-2 h-2 rounded-full animate-[pulseDot_1.4s_ease-in-out_infinite] bg-(--c) shadow-[0_0_8px_var(--shadow)]"
                    style={{
                        '--c': c,
                        '--shadow': `${c}80`,
                        animationDelay: `${i * 0.2}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default Spinner;