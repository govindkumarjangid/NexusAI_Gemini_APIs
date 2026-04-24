import { motion } from 'framer-motion';

const PLANETS = [
  { name: 'Mercury', radius: 60, size: 8, duration: 6, color: '#b5a7a7', delay: 0 },
  { name: 'Venus', radius: 90, size: 14, duration: 10, color: '#e3bb76', delay: 1.5 },
  { name: 'Earth', radius: 125, size: 16, duration: 16, color: '#4b70dd', delay: 0.8 },
  { name: 'Mars', radius: 160, size: 12, duration: 24, color: '#c1440e', delay: 2.3 },
  { name: 'Jupiter', radius: 210, size: 28, duration: 38, color: '#d39c7e', delay: 0.5 },
  { name: 'Saturn', radius: 260, size: 24, duration: 54, color: '#ead6b8', delay: 3.0 },
];

const ASTEROIDS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  angle: (i / 24) * 360,
  r: 185 + Math.sin(i * 3) * 8,
  size: 1.5 + (i % 2),
}));


const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.7 + 0.3,
  delay: `${Math.random() * 4}s`,
}));

const SolarSystem = ({ scale = 1, opacity = 1 }) => {
  const maxR = 260;
  const totalSize = (maxR + 40) * 2;

  return (
    <motion.div
      style={{ scale, opacity }}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-[pulse-dot_4s_ease-in-out_infinite] w-(--size) h-(--size) opacity-(--opacity) top-(--top) left-(--left)"
            style={{
              '--top': star.top,
              '--left': star.left,
              '--size': `${star.size}px`,
              '--opacity': star.opacity,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.5] sm:scale-[0.65] md:scale-[0.8] w-(--total-size) h-(--total-size)"
        style={{
          '--total-size': `${totalSize}px`,
        }}
      >
        {/* Ambient glow behind the sun */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[140px] h-[140px] bg-[radial-gradient(circle,rgba(255,204,0,0.4)_0%,transparent_70%)] blur-2xl"
        />

        {/* Realistic Sun */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10 flex items-center justify-center w-12 h-12 bg-[radial-gradient(circle_at_center,#ffffff_0%,#ffdf00_40%,#ff8c00_100%)] shadow-[0_0_20px_8px_rgba(255,140,0,0.6),0_0_40px_15px_rgba(255,69,0,0.3)]"
        />

        {/* Orbit rings + Planets */}
        {PLANETS.map((planet, i) => {
          const orbitSize = planet.radius * 2;
          const offset = (totalSize - orbitSize) / 2;

          return (
            <div
              key={i}
              className="absolute w-(--orbit-size) h-(--orbit-size) top-(--offset) left-(--offset)"
              style={{
                '--orbit-size': `${orbitSize}px`,
                '--offset': `${offset}px`,
              }}
            >
              {/* Orbit Track */}
              <div
                className="absolute inset-0 rounded-full border-[1.5px] border-white/15"
              />

              {/* Planet wrapper */}
              <div
                className="absolute inset-0 animate-[orbit-spin_var(--duration)_linear_infinite]"
                style={{
                  '--duration': `${planet.duration}s`,
                  animationDelay: `-${planet.delay}s`,
                }}
              >
                {/* Planet positioned at the top of its orbit */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full w-(--size) h-(--size) -top-(--half-size) bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--color)_40%,white),var(--color)_80%,black)] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.5)]"
                  style={{
                    '--size': `${planet.size}px`,
                    '--half-size': `${planet.size / 2}px`,
                    '--color': planet.color,
                  }}
                />

                {/* Special case for Saturn's ring */}
                {planet.name === 'Saturn' && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-(--ring-w) h-(--ring-h) border-[3px] border-[rgba(234,214,184,0.6)] rounded-full rotate-x-75 shadow-[0_0_2px_rgba(234,214,184,0.4)]"
                    style={{
                      '--ring-w': `${planet.size * 2.2}px`,
                      '--ring-h': `${planet.size * 0.8}px`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Asteroid Belt */}
        {ASTEROIDS.map((a) => {
          const rad = (a.angle * Math.PI) / 180;
          const cx = totalSize / 2 + a.r * Math.cos(rad);
          const cy = totalSize / 2 + a.r * Math.sin(rad);
          return (
            <div
              key={a.id}
              className="absolute rounded-full bg-[#969696]/50 animate-[orbit-spin_var(--duration)_linear_infinite] w-(--size) h-(--size) top-(--top) left-(--left)"
              style={{
                '--size': `${a.size}px`,
                '--top': `${cy - a.size / 2}px`,
                '--left': `${cx - a.size / 2}px`,
                '--duration': `${80 + a.id * 3}s`,
                animationDelay: `-${a.id * 4}s`,
                transformOrigin: `${totalSize / 2 - (cx - a.size / 2)}px ${totalSize / 2 - (cy - a.size / 2)}px`,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default SolarSystem;
