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
