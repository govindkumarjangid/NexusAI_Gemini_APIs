import { Link } from 'react-router-dom';

const LandingNav = () => (
  <nav
    className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between backdrop-blur-2xl border-b bg-color-mix(in_srgb,var(--bg-base)_65%,transparent) border-(--border-color)"
  >
    <Link
      to="/"
      className="text-xl sm:text-2xl font-extrabold tracking-tight gradient-accent-text font-['Outfit','Inter',sans-serif]"
    >
      NexusAI
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
