import { useRef, useState, useEffect } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import SettingsModal from './SettingsModal';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

const desktopVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 22, stiffness: 280 } },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
};

const mobileVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 260 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

const SidebarBottom = ({ sidebarOpen, handleLogout }) => {
  const { user } = useAuthStore();
  const [popupOpen, setPopupOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const isMobile = useIsMobile();

  const initial = (() => {
    if (!user?.name) return '?';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  useEffect(() => {
    if (!popupOpen) return;
    function handleClick(e) {
      if (
        popupRef.current && !popupRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) setPopupOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [popupOpen]);

  return (
    <div className="p-3 space-y-1 shrink-0 relative">

      <AnimatePresence>
        {popupOpen && (
          <>
            {isMobile && (
              <motion.div
                key="profile-backdrop"
                className="fixed inset-0 z-40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setPopupOpen(false)}
              />
            )}

            <motion.div
              key="profile-popup"
              ref={popupRef}
              variants={isMobile ? mobileVariants : desktopVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={
                isMobile
                  ? 'fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl border-t overflow-hidden'
                  : sidebarOpen
                    ? 'absolute bottom-full left-2 right-2 mb-2 z-50 rounded-2xl shadow-2xl border overflow-hidden'
                    : 'absolute bottom-0 left-full ml-2 w-64 z-50 rounded-2xl shadow-2xl border overflow-hidden'
              }
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {/* Mobile drag handle */}
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full opacity-30" style={{ backgroundColor: 'var(--text-primary)' }} />
                </div>
              )}

              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0 text-accent-contrast bg-accent"
                >
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {user?.email || ''}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-4 border-t" style={{ borderColor: 'var(--border-color)' }} />

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={() => { setPopupOpen(false); setShowSettings(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm transition-all cursor-pointer hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Settings size={18} />
                  <span>Preferences</span>
                </button>

                <button
                  onClick={() => { setPopupOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm transition-all cursor-pointer hover:text-red-400 hover:bg-red-500/10"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </div>

              {/* Safe area for mobile */}
              {isMobile && <div className="pb-safe h-4" />}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Profile Button (combined) ── */}
      <button
        ref={buttonRef}
        onClick={() => setPopupOpen(v => !v)}
        className="w-full flex items-center rounded-full cursor-pointer transition-all text-sm h-11 overflow-hidden hover:opacity-80"
        style={{ color: 'var(--text-secondary)' }}
        title={!sidebarOpen ? 'Profile & Settings' : ''}
      >
        {/* Avatar circle */}
        <div className="w-11 h-11 shrink-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-accent text-accent-contrast">
            {initial}
          </div>
        </div>
        {sidebarOpen && (
          <div className="min-w-0 flex flex-col items-start pr-3">
            <span className="font-medium text-sm truncate w-full" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'Profile'}
            </span>
            <span className="text-xs truncate w-full" style={{ color: 'var(--text-muted)' }}>
              {user?.email || ''}
            </span>
          </div>
        )}
      </button>

      {/* Settings modal */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default SidebarBottom;
