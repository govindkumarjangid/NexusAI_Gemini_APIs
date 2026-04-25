import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import Reveal from '../ui/Reveal';

const headingFont = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const CTASection = () => (
  <section className="px-5 sm:px-8 py-16 sm:py-24">
    <Reveal>
      <div
        className="max-w-3xl mx-auto rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden border bg-[color-mix(in_srgb,var(--accent-color)_5%,var(--bg-surface))] border-[color-mix(in_srgb,var(--accent-color)_12%,var(--border-color))]"
      >
        {/* Glow blobs */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-color)_12%,transparent),transparent_70%)] blur-2xl"
        />
        <div
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full pointer-events-none bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-color)_8%,transparent),transparent_70%)] blur-2xl"
        />

        <div className="relative z-10">
          <MessageSquare size={36} className="mx-auto mb-5 text-(--accent-color)" />
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-(--text-primary)"
            style={headingFont}
          >
            Ready to experience the future?
          </h2>
          <p className="text-sm sm:text-base mb-8 text-(--text-secondary)">
            Join thousands of users already using NexusAI for smarter conversations.
          </p>
          <Link
            to="/register"
            className="origin-left inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base border transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm group text-(--accent-text-color) border-(--border-color) bg-(--accent-color)/30  animated-accent-btn"
          >
            Get Started Free <ArrowRight size={17} className='group-hover:translate-x-1.5 transition-transform duration-300'/>
          </Link>
        </div>
      </div>
    </Reveal>
  </section>
);

export default CTASection;
