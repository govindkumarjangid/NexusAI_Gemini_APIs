import { motion } from 'framer-motion';

// Realistic planet colors
const PLANETS = [
  { name: 'Mercury', radius: 60,  size: 8,  duration: 6,  color: '#b5a7a7', delay: 0   },
  { name: 'Venus',   radius: 90,  size: 14, duration: 10, color: '#e3bb76', delay: 1.5 },
  { name: 'Earth',   radius: 125, size: 16, duration: 16, color: '#4b70dd', delay: 0.8 },
  { name: 'Mars',    radius: 160, size: 12, duration: 24, color: '#c1440e', delay: 2.3 },
  { name: 'Jupiter', radius: 210, size: 28, duration: 38, color: '#d39c7e', delay: 0.5 },
  { name: 'Saturn',  radius: 260, size: 24, duration: 54, color: '#ead6b8', delay: 3.0 },
];

const ASTEROIDS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  angle: (i / 24) * 360,
  r: 185 + Math.sin(i * 3) * 8, // Between Mars and Jupiter
  size: 1.5 + (i % 2),
}));

// Random background stars
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
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animation: `pulse-dot 4s ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.5] sm:scale-[0.65] md:scale-[0.8]" // Reduced overall size further
        style={{
          width: totalSize,
          height: totalSize,
        }}
      >
        {/* Ambient glow behind the sun (Animation Removed) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 140,
            height: 140,
            background: 'radial-gradient(circle, rgba(255, 204, 0, 0.4) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Realistic Sun (Animation Removed) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10 flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            background: 'radial-gradient(circle at center, #ffffff 0%, #ffdf00 40%, #ff8c00 100%)',
            boxShadow: `0 0 20px 8px rgba(255, 140, 0, 0.6),
                        0 0 40px 15px rgba(255, 69, 0, 0.3)`,
          }}
        />

        {/* Orbit rings + Planets */}
        {PLANETS.map((planet, i) => {
          const orbitSize = planet.radius * 2;
          const offset = (totalSize - orbitSize) / 2;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                width: orbitSize,
                height: orbitSize,
                top: offset,
                left: offset,
              }}
            >
              {/* Orbit Track (Fixed visibility) */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                }}
              />

              {/* Planet wrapper */}
              <div
                className="absolute inset-0"
                style={{
                  animation: `orbit-spin ${planet.duration}s linear infinite`,
                  animationDelay: `-${planet.delay}s`,
                }}
              >
                {/* Planet positioned at the top of its orbit */}
                <div
                  style={{
                    position: 'absolute',
                    top: -(planet.size / 2),
                    left: '50%',
                    marginLeft: -(planet.size / 2),
                    width: planet.size,
                    height: planet.size,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, ${planet.color} 40%, white), ${planet.color} 80%, black)`,
                    boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.5)`,
                  }}
                />
                
                {/* Special case for Saturn's ring */}
                {planet.name === 'Saturn' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -(planet.size / 2) + (planet.size / 2), // vertically centered on planet
                      left: '50%',
                      width: planet.size * 2.2,
                      height: planet.size * 0.8,
                      border: '3px solid rgba(234, 214, 184, 0.6)',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%) rotateX(75deg)',
                      boxShadow: '0 0 2px rgba(234, 214, 184, 0.4)',
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
              className="absolute rounded-full"
              style={{
                width: a.size,
                height: a.size,
                top: cy - a.size / 2,
                left: cx - a.size / 2,
                backgroundColor: 'rgba(150, 150, 150, 0.5)',
                animation: `orbit-spin ${80 + a.id * 3}s linear infinite`,
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
