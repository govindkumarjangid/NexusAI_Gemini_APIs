import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, text, position = 'right', disabled = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) return children;

  const positions = {
    right: 'left-full ml-3 top-1/2',
    left: 'right-full mr-3 top-1/2',
    top: 'bottom-full mb-3 left-1/2',
    bottom: 'top-full mt-3 left-1/2',
  };

  const origins = {
    right: 'left',
    left: 'right',
    top: 'bottom',
    bottom: 'top',
  };

  const initialVariants = {
    right: { opacity: 0, x: -10, y: '-50%', scale: 0.5 },
    left: { opacity: 0, x: 10, y: '-50%', scale: 0.5 },
    top: { opacity: 0, x: '-50%', y: 10, scale: 0.5 },
    bottom: { opacity: 0, x: '-50%', y: -10, scale: 0.5 },
  };

  const animateVariants = {
    right: { opacity: 1, x: 0, y: '-50%', scale: 1 },
    left: { opacity: 1, x: 0, y: '-50%', scale: 1 },
    top: { opacity: 1, x: '-50%', y: 0, scale: 1 },
    bottom: { opacity: 1, x: '-50%', y: 0, scale: 1 },
  };

  return (
    <div
      className="relative w-fit h-fit flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={initialVariants[position]}
            animate={animateVariants[position]}
            exit={initialVariants[position]}
            style={{
              originX: origins[position] === 'left' ? 0 : (origins[position] === 'right' ? 1 : 0.5),
              originY: origins[position] === 'top' ? 0 : (origins[position] === 'bottom' ? 1 : 0.5)
            }}
            transition={{ type: 'spring', damping: 18, stiffness: 400 }}
            className={`absolute z-100 px-2 py-1 text-[10px] font-bold tracking-wider text-accent-contrast bg-accent shadow-xl whitespace-nowrap pointer-events-none rounded-md ${positions[position]}`}
          >
            {text}
            {/* Arrow */}
            <div
              className={`absolute w-1.5 h-1.5 bg-accent rotate-45 pointer-events-none ${
                position === 'right' ? 'left-[-3px] top-1/2 -translate-y-1/2' :
                position === 'left' ? 'right-[-3px] top-1/2 -translate-y-1/2' :
                position === 'top' ? 'bottom-[-3px] left-1/2 -translate-x-1/2' :
                'top-[-3px] left-1/2 -translate-x-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
