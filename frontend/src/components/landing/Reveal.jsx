import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Reveal — fade + slide-up on scroll enter
 */
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const show = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
