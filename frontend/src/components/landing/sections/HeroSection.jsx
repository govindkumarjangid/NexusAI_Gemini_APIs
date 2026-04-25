import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const headingFont = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const HeroSection = ({ heroY, heroOpacity, heroScale }) => (
  <section className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-24 pb-16 relative overflow-hidden">

    <div className="landing-grid-bg absolute inset-0 pointer-events-none" />

    {[
      { top: '18%', left: '10%', w: 3, dur: '6s' },
      { top: '62%', right: '14%', left: undefined, w: 4, dur: '8s', del: '1s' },
      { top: '35%', left: '82%', w: 3, dur: '7s', del: '2s' },
      { top: '78%', left: '25%', w: 2, dur: '9s', del: '.5s' },
      { top: '22%', left: '68%', w: 5, dur: '11s', del: '3s' },
    ].map((p, j) => (
      <div
        key={j}
        className="absolute rounded-full pointer-events-none bg-color-mix(in_srgb,var(--accent-color)_40%,transparent) animate-[particle-drift_var(--dur)_ease-in-out_infinite_var(--del)] w-(--w) h-(--w) top-(--top) left-(--left) right-(--right)"
        style={{
          '--top': p.top,
          '--left': p.left,
          '--right': p.right,
          '--w': `${p.w}px`,
          '--dur': p.dur,
          '--del': p.del || '0s',
        }}
      />
    ))}

    <motion.div
      className="relative z-10 flex flex-col items-center mt-12 sm:mt-0"
      style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border mb-8 backdrop-blur-3xl bg-color-mix(in_srgb,var(--accent-color)_8%,transparent) text-(--accent-color) border-color-mix(in_srgb,var(--accent-color)_18%,transparent)"
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-[pulse-dot_2s_ease-in-out_infinite] bg-[#22c55e]"
          />
          Powered by Advanced AI
        </div>
      </motion.div>

      <motion.h1
        className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-[-0.01em] text-center mb-4 sm:mb-6 leading-[1.1] max-w-4xl"
        style={headingFont}
        initial={{ opacity: 0, y: 35, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-(--text-primary)">The Future of </span>
        <span className="gradient-accent-text">AI Conversation</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-sm sm:text-base md:text-lg text-center max-w-xl mb-8 leading-relaxed text-(--text-secondary)"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        Experience next-generation AI chat with real-time streaming,
        contextual understanding, and a beautifully crafted interface.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xs sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
      >
        <Link
          to="/register"
          className="origin-left inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base border transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm group text-(--accent-text-color) border-(--border-color) bg-(--accent-color)/20  animated-accent-btn"
        >
          Get Started Free <ArrowRight size={17} className='group-hover:translate-x-1.5 transition-transform duration-300' />
        </Link>
        <Link
          to="/login"
          className="origin-left inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base border transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm group text-(--accent-text-color) border-(--border-color) bg-color-mix(in_srgb,var(--bg-surface)_50%,transparent) animated-accent-btn"
        >
          Sign In <ChevronRight size={17} className='group-hover:translate-x-1.5 transition-transform duration-300' />
        </Link>
      </motion.div>
    </motion.div>
  </section>
);

export default HeroSection;
