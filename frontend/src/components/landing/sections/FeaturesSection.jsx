import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Zap, Shield } from 'lucide-react';
import { headingFont } from '../ui/constants';
import Reveal from '../ui/Reveal';

const FEATURES = [
  {
    icon: <Sparkles size={22} />,
    title: 'AI-Powered Intelligence',
    desc: 'Advanced AI models for natural, contextual conversations that truly understand you.',
    iconBg: 'color-mix(in srgb, var(--accent-color) 12%, transparent)',
    iconColor: 'var(--accent-color)',
  },
  {
    icon: <Zap size={22} />,
    title: 'Lightning Fast',
    desc: 'Real-time streaming responses with near-zero latency on optimized infrastructure.',
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: '#60a5fa',
  },
  {
    icon: <Shield size={22} />,
    title: 'Secure & Private',
    desc: 'End-to-end encryption and secure auth. Your data stays yours — always.',
    iconBg: 'rgba(16,185,129,0.12)',
    iconColor: '#34d399',
  },
];

const FeatureCard = ({ icon, title, desc, iconBg, iconColor, i }) => {
  const ref = useRef(null);
  const show = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className="perspective-[1000px]"
      initial={{ opacity: 0, rotateX: 20, rotateY: i === 0 ? -12 : i === 2 ? 12 : 0, y: 70 }}
      animate={show ? { opacity: 1, rotateX: 0, rotateY: 0, y: 0 } : {}}
      transition={{ duration: 0.85, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <div
        className="rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:shadow-lg"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: 'var(--text-primary)', ...headingFont }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => (
  <section className="px-5 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto" id="features">
    <Reveal>
      <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-center mb-3" style={{ color: 'var(--accent-color)' }}>Features</p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-3" style={{ color: 'var(--text-primary)', ...headingFont }}>Built for the future</h2>
      <p className="text-sm sm:text-base text-center max-w-lg mx-auto mb-12 sm:mb-16 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Every detail carefully crafted to deliver the best AI experience possible.
      </p>
    </Reveal>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {FEATURES.map((f, i) => <FeatureCard key={i} {...f} i={i} />)}
    </div>
  </section>
);

export default FeaturesSection;
