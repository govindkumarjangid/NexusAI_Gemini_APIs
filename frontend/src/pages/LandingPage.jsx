import { useScroll, useTransform } from 'framer-motion';

import LandingNav          from '../components/landing/ui/LandingNav';
import HeroSection         from '../components/landing/sections/HeroSection';
import FeaturesSection     from '../components/landing/sections/FeaturesSection';
import HowItWorksSection   from '../components/landing/sections/HowItWorksSection';
import TestimonialsSection from '../components/landing/sections/TestimonialsSection';
import CTASection          from '../components/landing/sections/CTASection';

/* ═══════════════════════════════════════════════════════════════
   LandingPage — thin orchestrator, all sections are components
   ═══════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const { scrollYProgress } = useScroll();

  /* Parallax values passed into HeroSection */
  const heroY       = useTransform(scrollYProgress, [0, 0.3],  [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 0.22], [1, 0.92]);

  /* Solar system scale / fade as user scrolls away */
  const orbScale   = useTransform(scrollYProgress, [0, 0.3], [1, 1.3]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);

  return (
    <div
      className="min-h-screen overflow-x-hidden overflow-y-auto scroll-smooth"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      <LandingNav />

      <HeroSection
        heroY={heroY}
        heroOpacity={heroOpacity}
        heroScale={heroScale}
        orbScale={orbScale}
        orbOpacity={orbOpacity}
      />

      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />

      <footer
        className="py-8 text-center text-xs border-t"
        style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
      >
        © {new Date().getFullYear()} NexusAI. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
