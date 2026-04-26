
const Spinner = () => {
    return (
        <div className="flex gap-2 items-center">
            {[1, 2, 3].map((_, i) => (
                <div key={i}
                    className="w-3 h-3 rounded-full animate-[pulseDot_1.4s_ease-in-out_infinite] bg-(--accent-color) shadow-[0_0_8px_var(--shadow)]"
                    style={{
                        animationDelay: `${i * 0.2}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default Spinner;