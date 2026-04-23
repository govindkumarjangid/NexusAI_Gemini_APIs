import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Loader2, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/useAuthStore.js';

const heading = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email: formData.email, password: formData.password, navigate });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[350px] h-[350px] rounded-full -top-[8%] -right-[4%] animate-[orb-float_10s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-color) 14%, transparent), transparent 70%)', filter: 'blur(70px)' }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full -bottom-[8%] -left-[4%] animate-[orb-float_12s_ease-in-out_infinite_2s]"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-color) 10%, transparent), transparent 70%)', filter: 'blur(70px)' }}
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
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        className="w-full max-w-md rounded-2xl p-7 sm:p-10 relative z-10 border backdrop-blur-xl"
        style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 80%, transparent)', borderColor: 'var(--border-color)' }}
        initial={{ opacity: 0, y: 36, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-1.5 tracking-tight" style={{ color: 'var(--text-primary)', ...heading }}>Welcome back</h1>
          <p className="text-center text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Sign in to continue your AI journey</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: 'var(--text-secondary)' }} htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:ring-2"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'color-mix(in srgb, var(--accent-color) 30%, transparent)' }}
              type="email" name="email" placeholder="you@example.com"
              value={formData.email} onChange={handleChange} required autoComplete="email"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: 'var(--text-secondary)' }} htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:ring-2"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'color-mix(in srgb, var(--accent-color) 30%, transparent)' }}
              type="password" name="password" placeholder="••••••••"
              value={formData.password} onChange={handleChange} required autoComplete="current-password"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <button
              type="submit" disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-px active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: 'var(--accent-color)', color: 'var(--accent-text-color)', boxShadow: '0 6px 24px color-mix(in srgb, var(--accent-color) 30%, transparent)' }}
            >
              {isLoading ? <><Loader2 size={17} className="animate-spin" /> Signing in...</> : <><LogIn size={17} /> Sign In</>}
            </button>
          </motion.div>
        </form>

        <motion.p className="text-center mt-7 text-sm" style={{ color: 'var(--text-muted)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold transition-colors duration-200" style={{ color: 'var(--accent-color)' }}>Create one</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
