import { Link } from 'react-router-dom';
import { headingFont } from './constants';

const LandingNav = () => (
  <nav
    className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between backdrop-blur-2xl border-b"
    style={{
      backgroundColor: 'color-mix(in srgb, var(--bg-base) 65%, transparent)',
      borderColor: 'var(--border-color)',
    }}
  >
    <Link
      to="/"
      className="text-xl sm:text-2xl font-extrabold tracking-tight gradient-accent-text"
      style={headingFont}
    >
      NexusAI
    </Link>
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="px-3.5 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
        style={{ color: 'var(--accent-color)' }}
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-3.5 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-px active:scale-95"
        style={{
          backgroundColor: 'var(--accent-color)',
          color: 'var(--accent-text-color)',
        }}
      >
        Get Started
      </Link>
    </div>
  </nav>
);

export default LandingNav;
