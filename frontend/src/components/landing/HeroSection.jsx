import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { headingFont } from './constants';
import SolarSystem from './SolarSystem';

const HeroSection = ({ heroY, heroOpacity, heroScale, orbScale, orbOpacity }) => (
  <section className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-24 pb-16 relative overflow-hidden">

    {/* Grid overlay */}
    <div className="landing-grid-bg absolute inset-0 pointer-events-none" />

    {/* ── Solar System Background ── */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <SolarSystem scale={orbScale} opacity={orbOpacity} />
    </div>

    {/* Floating particles */}
    {[
      { top: '18%', left: '10%', w: 3, dur: '6s' },
      { top: '62%', right: '14%', left: undefined, w: 4, dur: '8s', del: '1s' },
      { top: '35%', left: '82%', w: 3, dur: '7s', del: '2s' },
      { top: '78%', left: '25%', w: 2, dur: '9s', del: '.5s' },
      { top: '22%', left: '68%', w: 5, dur: '11s', del: '3s' },
    ].map((p, j) => (
      <div
        key={j}
        className="absolute rounded-full pointer-events-none"
        style={{
          top: p.top, left: p.left, right: p.right,
          width: p.w, height: p.w,
          backgroundColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)',
          animation: `particle-drift ${p.dur} ease-in-out infinite ${p.del || '0s'}`,
        }}
      />
    ))}

    {/* Hero text content */}
    <motion.div
      className="relative z-10 flex flex-col items-center"
      style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border mb-8"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--accent-color) 8%, transparent)',
            color: 'var(--accent-color)',
            borderColor: 'color-mix(in srgb, var(--accent-color) 18%, transparent)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-[pulse-dot_2s_ease-in-out_infinite]"
            style={{ backgroundColor: '#22c55e' }}
          />
          Powered by Advanced AI
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        className="text-[clamp(2.2rem,7vw,4.8rem)] font-black tracking-[-0.04em] text-center mb-4 sm:mb-6 leading-[1.08] max-w-4xl"
        style={headingFont}
        initial={{ opacity: 0, y: 35, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span style={{ color: 'var(--text-primary)' }}>The Future of </span>
        <span className="gradient-accent-text">AI Conversation</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-sm sm:text-base md:text-lg text-center max-w-xl mb-8 leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        Experience next-generation AI chat with real-time streaming,
        contextual understanding, and a beautifully crafted interface.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
      >
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'var(--accent-text-color)',
            boxShadow: '0 8px 32px color-mix(in srgb, var(--accent-color) 35%, transparent)',
          }}
        >
          Get Started Free <ArrowRight size={17} />
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base border transition-all duration-300 hover:-translate-y-0.5"
          style={{
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-color)',
            backgroundColor: 'color-mix(in srgb, var(--bg-surface) 50%, transparent)',
          }}
        >
          Sign In <ChevronRight size={17} />
        </Link>
      </motion.div>
    </motion.div>
  </section>
);

export default HeroSection;
