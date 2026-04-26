import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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

const SolarSystem = ({ scale = 1, opacity = 1 }) => {
  const [shootingStars, setShootingStars] = useState([]);
  const [spaceShips, setSpaceShips] = useState([]);

  useEffect(() => {
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
          className="absolute w-45 h-[1.5px] bg-linear-to-l from-white via-white/80 to-transparent rounded-full animate-[shooting-star_var(--dur)_ease-out_forwards]"
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
    </motion.div>
  );
};

export default SolarSystem;
