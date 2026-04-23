import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { headingFont } from '../ui/constants';
import Reveal from '../ui/Reveal';

const CTASection = () => (
  <section className="px-5 sm:px-8 py-16 sm:py-24">
    <Reveal>
      <div
        className="max-w-3xl mx-auto rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden border"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent-color) 5%, var(--bg-surface))',
          borderColor: 'color-mix(in srgb, var(--accent-color) 12%, var(--border-color))',
        }}
      >
        {/* Glow blobs */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-color) 12%, transparent), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-color) 8%, transparent), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative z-10">
          <MessageSquare size={36} className="mx-auto mb-5" style={{ color: 'var(--accent-color)' }} />
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-3"
            style={{ color: 'var(--text-primary)', ...headingFont }}
          >
            Ready to experience the future?
          </h2>
          <p className="text-sm sm:text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of users already using NexusAI for smarter conversations.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 active:scale-95 group"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--accent-text-color)',
            }}
          >
            Get Started Free <ArrowRight size={17} className='group-hover:translate-x-1.5 transition-transform duration-300'/>
          </Link>
        </div>
      </div>
    </Reveal>
  </section>
);

export default CTASection;
