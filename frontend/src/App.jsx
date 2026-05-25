import { lazy, Suspense, useEffect } from 'react';
import useAuthStore from './store/useAuthStore.js';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ToastProvider from './components/common/ToastProvider';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SharedChatPage = lazy(() => import('./pages/SharedChatPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PageLoader = lazy(() => import('./components/common/PageLoader'));
const ChatLayout = lazy(() => import('./components/chat/ChatLayout'));


const App = () => {
  const { user, actualTheme, setIsMobile, setSidebarOpen, accentColor, ACCENT_COLORS } = useAuthStore();

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
            <stop offset="0.5" stop-color="${color}" stop-opacity="0.8" />
            <stop offset="1" stop-color="${color}" stop-opacity="0.4" />
          </linearGradient>
          <radialGradient id="cr" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="25%" stop-color="${color}" stop-opacity="0.9" />
            <stop offset="65%" stop-color="${color}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background Matrix Mesh Indicator */}
        <circle cx="256" cy="256" r="220" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 12" opacity="0.2" />

        {/* Outer Orbit HUD Ring */}
        <circle cx="256" cy="256" r="236" stroke="${color}" stroke-width="3" stroke-dasharray="20 40 80 40" opacity="0.45" />

        {/* Dynamic Connection Path Backdrop */}
        <path d="M120 400L120 112L392 400L392 112" stroke="${color}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" opacity="0.15" />

        {/* Main Connection Path (N Shape) */}
        <path d="M120 400L120 112L392 400L392 112" stroke="url(#g)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />

        {/* Glowing Laser Center Core Path */}
        <path d="M120 400L120 112L392 400L392 112" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8" />

        {/* Central Quantum Singularity Core */}
        <circle cx="256" cy="256" r="66" fill="url(#cr)"/>
        <circle cx="256" cy="256" r="30" fill="${color}"/>
        <circle cx="256" cy="256" r="12" fill="#ffffff"/>

        {/* Corner Synaptic Nodes */}
        <circle cx="120" cy="112" r="22" stroke="${color}" stroke-width="2.5" fill="none" opacity="0.75" />
        <circle cx="120" cy="112" r="12" fill="${color}" />
        <circle cx="120" cy="112" r="5" fill="#ffffff" />

        <circle cx="120" cy="400" r="22" stroke="${color}" stroke-width="2.5" fill="none" opacity="0.75" />
        <circle cx="120" cy="400" r="12" fill="${color}" />
        <circle cx="120" cy="400" r="5" fill="#ffffff" />

        <circle cx="392" cy="112" r="22" stroke="${color}" stroke-width="2.5" fill="none" opacity="0.75" />
        <circle cx="392" cy="112" r="12" fill="${color}" />
        <circle cx="392" cy="112" r="5" fill="#ffffff" />

        <circle cx="392" cy="400" r="22" stroke="${color}" stroke-width="2.5" fill="none" opacity="0.75" />
        <circle cx="392" cy="400" r="12" fill="${color}" />
        <circle cx="392" cy="400" r="5" fill="#ffffff" />
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
      <ToastProvider />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname.split('/')[1] || 'root'}>
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
            <Route path="/chat/:chatId?" element={
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
