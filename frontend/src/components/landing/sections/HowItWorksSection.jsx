import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { headingFont } from '../ui/constants';
import Reveal from '../ui/Reveal';

const STEPS = [
  { title: 'Create Your Account', desc: 'Sign up in seconds with your email. No credit card required.' },
  { title: 'Start a Conversation', desc: 'Begin chatting — ask anything from coding to creative writing.' },
  { title: 'Get Brilliant Answers', desc: 'Receive intelligent, context-aware responses streamed in real-time.' },
];

const StepItem = ({ num, title, desc, i }) => {
  const ref = useRef(null);
  const show = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left"
      initial={{ opacity: 0, x: -30 }}
      animate={show ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="w-12 h-12 min-w-[48px] rounded-xl flex items-center justify-center font-extrabold text-base border"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent-color) 12%, transparent)',
          color: 'var(--accent-color)',
          borderColor: 'color-mix(in srgb, var(--accent-color) 20%, transparent)',
        }}
      >
        {num}
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-bold mb-1 tracking-tight" style={{ color: 'var(--text-primary)', ...headingFont }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => (
  <section className="px-5 sm:px-8 py-16 sm:py-24 max-w-3xl mx-auto" id="how-it-works">
    <Reveal>
      <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-center mb-3" style={{ color: 'var(--accent-color)' }}>How It Works</p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-3" style={{ color: 'var(--text-primary)', ...headingFont }}>Start in minutes</h2>
      <p className="text-sm sm:text-base text-center max-w-lg mx-auto mb-12 sm:mb-16 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Three simple steps to unlock the power of AI-driven conversations.
      </p>
    </Reveal>
    <div className="flex flex-col gap-8 sm:gap-10">
      {STEPS.map((s, i) => <StepItem key={i} num={i + 1} {...s} i={i} />)}
    </div>
  </section>
);

export default HowItWorksSection;
