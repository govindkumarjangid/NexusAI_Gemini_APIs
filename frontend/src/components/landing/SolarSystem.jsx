import { motion } from 'framer-motion';

/**
 * Planet data — each orbits the central "sun" at different radii, speeds, sizes and tilts.
 * The `label` icons simulate AI-themed "planets".
 */
const PLANETS = [
  { radius: 90,  size: 12, duration: 6,  color: '#60a5fa', delay: 0,    tiltX: 10 }, // Mercury-like
  { radius: 130, size: 16, duration: 10, color: '#34d399', delay: 1.5,  tiltX: -15 }, // Venus-like
  { radius: 175, size: 20, duration: 16, color: 'var(--accent-color)', delay: 0.8, tiltX: 8 }, // Earth-like (accent)
  { radius: 225, size: 14, duration: 24, color: '#f87171', delay: 2.3,  tiltX: -20 }, // Mars-like
  { radius: 280, size: 30, duration: 38, color: '#fbbf24', delay: 0.5,  tiltX: 5  }, // Jupiter-like (big)
  { radius: 335, size: 18, duration: 54, color: '#c084fc', delay: 3.0,  tiltX: -28 }, // Saturn-like
];

/**
 * Asteroid belt — tiny dots distributed around radius ~255
 */
const ASTEROIDS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  angle: (i / 18) * 360,
  r: 255 + Math.sin(i * 2.4) * 10, // slight variance
  size: 2 + (i % 3),
}));

/* ────────────────────────────────────────────────────────────────
   SolarSystem — the central hero background animation
   All planets orbit a glowing "AI Sun" using CSS keyframes
   so performance stays butter-smooth (no JS per-frame).
   ──────────────────────────────────────────────────────────────── */
const SolarSystem = ({ scale = 1, opacity = 1 }) => {
  const maxR = 335;
  const totalSize = (maxR + 40) * 2; // bounding box

  return (
    <motion.div
      style={{ scale, opacity }}
      className="absolute top-1/2 left-1/2 pointer-events-none select-none"
      /* Center the square viewport on the page mid-point */
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div
        style={{
          width: totalSize,
          height: totalSize,
          transform: 'translate(-50%, -50%)',
          position: 'relative',
        }}
      >
        {/* ── Ambient glow behind the sun ── */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 180,
            height: 180,
            background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-color) 28%, transparent) 0%, transparent 70%)',
            filter: 'blur(36px)',
            animation: 'orb-float 7s ease-in-out infinite',
          }}
        />

        {/* ── The Sun ── */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10 flex items-center justify-center"
          style={{
            width: 52,
            height: 52,
            background: 'radial-gradient(circle at 35% 35%, #fff8cc, var(--accent-color) 55%, color-mix(in srgb, var(--accent-color) 50%, #000) 100%)',
            boxShadow: `0 0 18px 4px color-mix(in srgb, var(--accent-color) 50%, transparent),
                        0 0 40px 8px color-mix(in srgb, var(--accent-color) 22%, transparent)`,
            animation: 'orb-float 5s ease-in-out infinite',
          }}
        />

        {/* ── Orbit rings + Planets ── */}
        {PLANETS.map((planet, i) => {
          const orbitSize = planet.radius * 2;
          const offset = (totalSize - orbitSize) / 2;

          return (
            <div key={i}>
              {/* Orbit ring */}
              <div
                className="absolute rounded-full border"
                style={{
                  width: orbitSize,
                  height: orbitSize,
                  top: offset,
                  left: offset,
                  borderColor: 'color-mix(in srgb, var(--accent-color) 8%, rgba(255,255,255,0.04))',
                  transform: `rotateX(${planet.tiltX}deg)`,
                }}
              />

              {/* Planet wrapper — rotates around center */}
              <div
                className="absolute"
                style={{
                  width: orbitSize,
                  height: orbitSize,
                  top: offset,
                  left: offset,
                  animation: `orbit-spin ${planet.duration}s linear infinite`,
                  animationDelay: `-${planet.delay}s`,
                  transformOrigin: 'center center',
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
                    background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${planet.color} 90%, white), ${planet.color})`,
                    boxShadow: `0 0 ${planet.size * 0.7}px ${planet.size * 0.3}px color-mix(in srgb, ${planet.color} 40%, transparent)`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* ── Asteroid Belt ── */}
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
                backgroundColor: 'color-mix(in srgb, var(--accent-color) 20%, rgba(200,200,200,0.15))',
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
