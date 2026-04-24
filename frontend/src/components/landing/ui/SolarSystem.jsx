import { motion, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

const PLANETS = [
  { name: 'Mercury', radius: 60, size: 8, color: '#b5a7a7', initialAngle: 0, duration: 25 },
  { name: 'Venus', radius: 90, size: 14, color: '#e3bb76', initialAngle: 45, duration: 35 },
  { name: 'Earth', radius: 125, size: 16, color: '#4b70dd', initialAngle: 90, duration: 50 },
  { name: 'Mars', radius: 160, size: 12, color: '#c1440e', initialAngle: 135, duration: 70 },
  { name: 'Jupiter', radius: 210, size: 28, color: '#d39c7e', initialAngle: 180, duration: 100 },
  { name: 'Saturn', radius: 260, size: 24, color: '#ead6b8', initialAngle: 225, duration: 140 },
];

const ASTEROIDS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  angle: (i / 24) * 360,
  r: 185 + Math.sin(i * 3) * 8,
  size: 1.5 + (i % 2),
}));


const STARS = Array.from({ length: 400 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 1.5 + 0.6,
  opacity: Math.random() * 0.7 + 0.3,
  delay: `${Math.random() * 4}s`,
  driftDur: `${15 + Math.random() * 20}s`,
  driftDel: `${Math.random() * 10}s`,
}));

const SolarSystem = ({ scale = 1, opacity = 1, scrollYProgress }) => {
  const maxR = 260;
  const totalSize = (maxR + 40) * 2;

  const [shootingStars, setShootingStars] = useState([]);
  const [spaceShips, setSpaceShips] = useState([]);

  useEffect(() => {
    // Shooting Stars Loop
    const ssInterval = setInterval(() => {
      const duration = 2.5 + Math.random() * 1.5;
      const newStar = {
        id: Date.now(),
        top: `${Math.random() * 60}%`,
        left: `${10 + Math.random() * 80}%`,
        dur: `${duration}s`,
        angle: -30 - Math.random() * 30,
      };
      setShootingStars(prev => [...prev, newStar]);
      setTimeout(() => setShootingStars(prev => prev.filter(s => s.id !== newStar.id)), duration * 1000 + 100);
    }, 1500 + Math.random() * 3000);

    // Space Ships Loop - More frequent
    const shipInterval = setInterval(() => {
      const duration = 10 + Math.random() * 10;
      const newShip = {
        id: Date.now(),
        top: `${10 + Math.random() * 80}%`,
        left: Math.random() > 0.5 ? '-50px' : 'calc(100% + 50px)',
        tx: Math.random() > 0.5 ? '120vw' : '-120vw',
        ty: `${(Math.random() - 0.5) * 300}px`,
        dur: `${duration}s`,
        color: Math.random() > 0.5 ? '#3b82f6' : '#ef4444',
      };
      setSpaceShips(prev => [...prev, newShip]);
      setTimeout(() => setSpaceShips(prev => prev.filter(s => s.id !== newShip.id)), duration * 1000 + 100);
    }, 4000 + Math.random() * 8000);

    return () => {
      clearInterval(ssInterval);
      clearInterval(shipInterval);
    };
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

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
            className="absolute rounded-full bg-white animate-[pulse-dot_4s_ease-in-out_infinite,star-drift_var(--drift-dur)_ease-in-out_infinite_var(--drift-del)] w-(--size) h-(--size) opacity-(--opacity) top-(--top) left-(--left)"
            style={{
              '--top': star.top,
              '--left': star.left,
              '--size': `${star.size}px`,
              '--opacity': star.opacity,
              '--drift-dur': star.driftDur,
              '--drift-del': star.driftDel,
              animationDelay: `${star.delay}, 0s`,
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute w-[180px] h-[1.5px] bg-linear-to-l from-white via-white/80 to-transparent rounded-full animate-[shooting-star_var(--dur)_ease-out_forwards]"
          style={{
            top: star.top,
            left: star.left,
            '--dur': star.dur,
            transform: `rotate(${star.angle}deg)`,
          }}
        />
      ))}

      {/* Space Ships */}
      {spaceShips.map(ship => (
        <div
          key={ship.id}
          className="absolute z-10 animate-[ship-fly_var(--dur)_linear_forwards]"
          style={{
            top: ship.top,
            left: ship.left,
            '--dur': ship.dur,
            '--tx': ship.tx,
            '--ty': ship.ty,
          }}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
          <div
            className="absolute -top-1 -right-1 w-1 h-1 rounded-full animate-pulse"
            style={{ backgroundColor: ship.color }}
          />
        </div>
      ))}

      {/* Solar System Container */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.5] sm:scale-[0.65] md:scale-[0.8] w-(--total-size) h-(--total-size)"
        style={{
          '--total-size': `${totalSize}px`,
          rotate: rotate,
        }}
      >
        {/* The Sun */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
           <div className="w-14 h-14 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#ffdf00_40%,#ff8c00_100%)] shadow-[0_0_50px_20px_rgba(255,140,0,0.5),inset_-4px_-4px_10px_rgba(0,0,0,0.5)]" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(255,160,0,0.2)_0%,transparent_70%)] blur-3xl -z-10" />
        </div>

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
              <div className="absolute inset-0 rounded-full border border-white/10" />

              <div
                className="absolute inset-0"
                style={{
                  transform: `rotate(${planet.initialAngle}deg)`,
                }}
              >
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full w-(--size) h-(--size) -top-(--half-size) shadow-[0_0_15px_rgba(255,255,255,0.1),inset_-3px_-3px_6px_rgba(0,0,0,0.7)]"
                  style={{
                    '--size': `${planet.size}px`,
                    '--half-size': `${planet.size / 2}px`,
                    backgroundColor: planet.color,
                    backgroundImage: `radial-gradient(circle at 35% 35%, color-mix(in srgb, ${planet.color} 60%, white), ${planet.color} 80%, black)`,
                  }}
                />

                {planet.name === 'Saturn' && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-(--ring-w) h-(--ring-h) border-[3px] border-[rgba(234,214,184,0.3)] rounded-full rotate-x-75 shadow-[0_0_2px_rgba(234,214,184,0.2)]"
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
              className="absolute rounded-full bg-[#969696]/20 w-(--size) h-(--size) top-(--top) left-(--left)"
              style={{
                '--size': `${a.size}px`,
                '--top': `${cy - a.size / 2}px`,
                '--left': `${cx - a.size / 2}px`,
                transformOrigin: `${totalSize / 2 - (cx - a.size / 2)}px ${totalSize / 2 - (cy - a.size / 2)}px`,
              }}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default SolarSystem;
