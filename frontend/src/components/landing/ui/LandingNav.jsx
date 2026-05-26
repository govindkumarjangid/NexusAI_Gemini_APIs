import { Link } from 'react-router-dom';
import Logo from '../../common/Logo';

const LandingNav = () => (
  <nav
    className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between backdrop-blur-2xl bg-color-mix(in_srgb,var(--bg-base)_65%,transparent) w-full border-b border-(--border-color)"
  >
    <Link
      to="/"
      className="text-xl sm:text-2xl font-extrabold tracking-tight gradient-accent-text font-['Outfit','Inter',sans-serif] flex items-center"
    >
      <Logo size={38} className="text-(--accent-color) drop-shadow-sm transition-all duration-200 hover:scale-105" />
      <h1 className="font-semibold text-2xl dark:text-gray-200 text-gray-800">
        NexusAI
      </h1>
    </Link>
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="p-2 sm:px-5 rounded-lg text-sm font-semibold transition-all duration-200 text-(--text-primary) active:scale-95 hover:text-(--accent-color)"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="p-2 sm:px-5  rounded-lg text-sm font-semibold transition-all duration-200 text-(--text-primary) active:scale-95 hover:text-(--accent-color)"
      >
        Register
      </Link>
    </div>
  </nav>
);

export default LandingNav;
