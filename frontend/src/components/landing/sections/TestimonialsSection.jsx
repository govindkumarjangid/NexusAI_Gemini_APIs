import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import { headingFont } from '../ui/constants';
import Reveal from '../ui/Reveal';

const TESTIMONIALS = [
  {
    name: 'Alex Chen',
    role: 'Software Engineer',
    text: 'NexusAI completely transformed my workflow. The response quality is incredibly impressive.',
    color: 'linear-gradient(135deg, var(--accent-color), color-mix(in srgb, var(--accent-color) 60%, #000))',
  },
  {
    name: 'Sarah Kim',
    role: 'Product Designer',
    text: "The interface is beautiful and the AI truly understands what I need. Best AI chat I've used.",
    color: 'color-mix(in srgb, var(--accent-color) 80%, #333)',
  },
  {
    name: 'Marcus T.',
    role: 'Data Scientist',
    text: 'Fast, accurate, and the streaming feels magical. This is the future of AI interaction.',
    color: 'color-mix(in srgb, var(--accent-color) 65%, #222)',
  },
];

const TestimonialCard = ({ name, role, text, color, i }) => {
  const ref = useRef(null);
  const show = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      className="perspective-[1000px]"
      initial={{ opacity: 0, rotateY: i === 0 ? -15 : i === 2 ? 15 : 0, y: 50 }}
      animate={show ? { opacity: 1, rotateY: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="rounded-2xl p-6 border h-full transition-all duration-300 hover:-translate-y-1"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex gap-0.5 mb-3" style={{ color: '#fbbf24' }}>
          {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="currentColor" />)}
        </div>
        <p className="text-sm leading-relaxed mb-5 italic" style={{ color: 'var(--text-secondary)' }}>"{text}"</p>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-white"
            style={{ background: color }}
          >
            {name[0]}
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => (
  <section className="px-5 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto" id="testimonials">
    <Reveal>
      <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-center mb-3" style={{ color: 'var(--accent-color)' }}>Testimonials</p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-3" style={{ color: 'var(--text-primary)', ...headingFont }}>Loved by thousands</h2>
      <p className="text-sm sm:text-base text-center max-w-lg mx-auto mb-12 sm:mb-16 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        See what our users are saying about NexusAI.
      </p>
    </Reveal>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} i={i} />)}
    </div>
  </section>
);

export default TestimonialsSection;
