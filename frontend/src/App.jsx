import { lazy, Suspense, useEffect } from 'react';
import useAuthStore from './store/useAuthStore.js';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Lazy load components for performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SharedChatPage = lazy(() => import('./pages/SharedChatPage'));
const Sidebar = lazy(() => import('./components/sidebar/Sidebar'));
const ChatArea = lazy(() => import('./components/chat/ChatArea'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));


const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-base">
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      <p className="text-sm font-semibold text-muted tracking-widest uppercase">NexusAI</p>
    </motion.div>
  </div>
);


const ChatLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden relative bg-base text-primary">
      <Sidebar />
      <ChatArea />
      <SearchPage />
    </div>
  );
};

const App = () => {

  const {
    user,
    actualTheme,
    isMobile,
    setIsMobile,
    sidebarOpen,
    setSidebarOpen,
    isSearchOpen,
    setIsSearchOpen,
    accentColor,
    ACCENT_COLORS,
  } = useAuthStore();

  const location = useLocation();
  const isDark = actualTheme === 'dark';

  // Dynamic Favicon Update
  useEffect(() => {
    const color = ACCENT_COLORS[accentColor] || '#2196F3';
    const svg = `
      <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop stop-color="${color}" />
            <stop offset="1" stop-color="${color}" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx="256" cy="256" r="60" fill="url(#g)"/>
        <path d="M120 400L120 112L392 400L392 112" stroke="url(#g)" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" opacity="1"/>
        <circle cx="120" cy="112" r="20" fill="${isDark ? 'white' : '#111827'}" />
        <circle cx="120" cy="400" r="20" fill="${isDark ? 'white' : '#111827'}" />
        <circle cx="392" cy="112" r="20" fill="${isDark ? 'white' : '#111827'}" />
        <circle cx="392" cy="400" r="20" fill="${isDark ? 'white' : '#111827'}" />
      </svg>
    `.trim();

    const encodedSvg = btoa(svg);
    const link = document.querySelector("link[rel*='icon']");
    if (link) {
      link.href = `data:image/svg+xml;base64,${encodedSvg}`;
    }
  }, [accentColor, isDark, ACCENT_COLORS]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile, setSidebarOpen]);


  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: isDark ? {
            background: '#1E1E21',
            color: '#e5e7eb',
            border: '1px solid #333338',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.35)',
            borderRadius: '9999px',
            padding: '8px 16px',
          } : {
            background: '#ffffff',
            color: '#1a1a1a',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
            borderRadius: '9999px',
            padding: '8px 16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
            style: isDark ? {
              background: '#1E1E21',
              color: '#e5e7eb',
              border: '1px solid #22c55e',
              borderRadius: '9999px',
            } : {
              background: '#ffffff',
              color: '#1a1a1a',
              border: '1px solid #22c55e',
              borderRadius: '9999px',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: isDark ? {
              background: '#1E1E21',
              color: '#e5e7eb',
              border: '1px solid #ef4444',
              borderRadius: '9999px',
            } : {
              background: '#ffffff',
              color: '#1a1a1a',
              border: '1px solid #ef4444',
              borderRadius: '9999px',
            },
          },



        }}
      />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={
              user ? <Navigate to="/chat" replace /> : <LandingPage />
            } />
            <Route path="/login" element={
              user ? <Navigate to="/chat" replace /> : <LoginPage />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/chat" replace /> : <RegisterPage />
            } />
            <Route path="/share/:shareId" element={<SharedChatPage />} />

            {/* Protected routes */}
            <Route path="/chat" element={
              !user ? <Navigate to="/" replace /> : <ChatLayout />
            } />
            <Route path="/chat/:chatId" element={
              !user ? <Navigate to="/" replace /> : <ChatLayout />
            } />

            {/* Catch-all 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

        </AnimatePresence>
      </Suspense>

    </>
  );
}

export default App;
