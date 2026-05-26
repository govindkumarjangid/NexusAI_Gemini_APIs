import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const headingFont = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const HeroSection = () => (

  <section className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-24 pb-16 relative overflow-hidden">

    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at center, color-mix(in srgb, var(--accent-color) 20%, transparent) 0, transparent 50%)`
        }}
      />
    </div>

    <div className="landing-grid-bg absolute inset-0 pointer-events-none" />
    <motion.div
      className="relative z-10 flex flex-col items-center mt-12 sm:mt-0"
    >

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border mb-8 backdrop-blur-3xl bg-color-mix(in_srgb,var(--accent-color)_8%,transparent) text-(--accent-color) border-color-mix(in_srgb,var(--accent-color)_18%,transparent) group"
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-[pulse-dot_2s_ease-in-out_infinite] bg-[#22c55e]"
          />
          Powered by Advanced AI
          <ChevronRight size={17} className='group-hover:translate-x-1.5 transition-transform duration-300' />
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
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xs sm:w-full sm:max-w-md items-center justify-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
      >
        <Link
          to="/register"
          className="py-4 px-8 text-sm rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer w-full max-w-fit shadow-lg flex items-center gap-2 justify-center active:scale-95 hover:opacity-90 group"
        >
          Get Started Free <ArrowRight size={17} className='group-hover:translate-x-1.5 transition-transform duration-300' />
        </Link>
        <Link
          to="/login"
          className="py-4 px-8 text-sm rounded-full  text-accent-contrast font-semibold transition-all cursor-pointer w-full max-w-fit  shadow-lg flex items-center gap-2 justify-center active:scale-95 hover:opacity-90 border border-(--accent-color)/50 bg-(--accent-color)/20 group"
        >
          Sign In <ArrowRight size={17} className='group-hover:translate-x-1.5 transition-transform duration-300' />
        </Link>
      </motion.div>
    </motion.div>
  </section>
);

export default HeroSection;
