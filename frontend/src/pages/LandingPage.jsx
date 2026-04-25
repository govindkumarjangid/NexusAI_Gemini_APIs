import { useScroll, useTransform } from 'framer-motion';

import LandingNav from '../components/landing/ui/LandingNav';
import HeroSection from '../components/landing/sections/HeroSection';
import FeaturesSection from '../components/landing/sections/FeaturesSection';
import HowItWorksSection from '../components/landing/sections/HowItWorksSection';
import TestimonialsSection from '../components/landing/sections/TestimonialsSection';
import CTASection from '../components/landing/sections/CTASection';
import SolarSystem from '../components/landing/ui/SolarSystem';

const LandingPage = () => {

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);

  const orbScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 1]);

  return (
    <div
      className="min-h-screen overflow-x-hidden overflow-y-auto scroll-smooth bg-(--bg-base) text-(--text-primary)"
    >
      <LandingNav />

      {/* Fixed Solar System Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <SolarSystem scale={orbScale} opacity={orbOpacity} scrollYProgress={scrollYProgress} />
      </div>

      <div className="relative z-10">
        <HeroSection
          heroY={heroY}
          heroOpacity={heroOpacity}
          heroScale={heroScale}
        />

        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />

        <footer
          className="z-50 py-4 text-center backdrop-blur-2xl border-t bg-color-mix(in_srgb,var(--bg-base)_65%,transparent) border-(--border-color) text-sm"
        >
          © {new Date().getFullYear()} NexusAI. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
