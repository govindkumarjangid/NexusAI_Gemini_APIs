import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/useAuthStore.js';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({ name: formData.name, email: formData.email, password: formData.password, navigate });
  };

  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden px-4 py-8 bg-(--bg-base)">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-87.5 h-87.5 rounded-full -top-[8%] -right-[4%] animate-[orb-float_10s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-color)_30%,transparent),transparent_70%)] blur-[70px]"
        />
        <div
          className="absolute w-75 h-75 rounded-full -bottom-[8%] -left-[4%] animate-[orb-float_12s_ease-in-out_infinite_2s] bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-color)_30%,transparent),transparent_70%)] blur-[70px]"
        />
      </div>

      {/* Grid */}
      <div className="landing-grid-bg absolute inset-0 pointer-events-none" />

      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-5 left-5 z-10"
      >
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80 text-(--text-muted) cursor-pointer">
          <ArrowLeft size={15} /> Back
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        className="w-full sm:max-w-md sm:rounded-4xl px-2 sm:px-10 py-7 sm:py-10 relative z-10 border-0 sm:border backdrop-blur-none sm:backdrop-blur-xl bg-transparent sm:bg-[color-mix(in_srgb,var(--bg-surface)_80%,transparent)] border-(--border-color)"
        initial={{ opacity: 0, y: 36, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1.5 tracking-tight text-(--text-primary) font-['Outfit','Inter',sans-serif]">Create an account</h1>
          <p className="text-center text-sm mb-8 text-(--text-muted)">Join NexusAI and start your AI journey</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label
              className="block text-xs font-semibold mb-1.5 ml-2 tracking-wide text-(--text-secondary)"
              htmlFor="reg-name">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name} onChange={handleChange} autoComplete="name"
              className="w-full px-4 py-3 rounded-full text-sm outline-none transition-all duration-200 border focus:ring-3 bg-(--bg-elevated) border-(--border-color) text-(--text-primary) focus:border-(--accent-color) ring-[color-mix(in_srgb,var(--accent-color)_30%,transparent)]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label
              className="block text-xs font-semibold mb-1.5 ml-2 tracking-wide text-(--text-secondary)"
              htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email} onChange={handleChange}  autoComplete="email"
              className="w-full px-4 py-3 rounded-full text-sm outline-none transition-all duration-200 border focus:ring-3 bg-(--bg-elevated) border-(--border-color) text-(--text-primary) focus:border-(--accent-color) ring-[color-mix(in_srgb,var(--accent-color)_30%,transparent)]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <label
              className="block text-xs font-semibold mb-1.5 ml-2 tracking-wide text-(--text-secondary)"
              htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password} onChange={handleChange} autoComplete="new-password"
              className="w-full px-4 py-3 rounded-full text-sm outline-none transition-all duration-200 border focus:ring-3 bg-(--bg-elevated) border-(--border-color) text-(--text-primary) focus:border-(--accent-color) ring-[color-mix(in_srgb,var(--accent-color)_30%,transparent)] mb-3"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <button
              type="submit" disabled={isLoading}
              className="w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-px active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer bg-(--accent-color) text-(--accent-text-color) "
            >
              {isLoading ? <><Loader size={17} className="animate-spin" /> Creating account...</> : <><UserPlus size={17} /> Create Account</>}
            </button>
          </motion.div>
        </form>

        <motion.p className="text-center mt-7 text-sm text-(--text-muted)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          Already have an account ?{' '}
          <Link to="/login" className="font-semibold transition-colors duration-200 text-(--accent-color)">Sign in</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
