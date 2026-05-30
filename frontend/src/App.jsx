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
    const innerColor = isDark ? '#212121' : '#ffffff';
    const svg = `
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.85">
          <path transform="rotate(0 50 50)" d="M50 50 C66 28 82 38 78 54 C74 70 58 64 50 50" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.65" />
          <path transform="rotate(60 50 50)" d="M50 50 C66 28 82 38 78 54 C74 70 58 64 50 50" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.65" />
          <path transform="rotate(120 50 50)" d="M50 50 C66 28 82 38 78 54 C74 70 58 64 50 50" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.65" />
          <path transform="rotate(180 50 50)" d="M50 50 C66 28 82 38 78 54 C74 70 58 64 50 50" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.65" />
          <path transform="rotate(240 50 50)" d="M50 50 C66 28 82 38 78 54 C74 70 58 64 50 50" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.65" />
          <path transform="rotate(300 50 50)" d="M50 50 C66 28 82 38 78 54 C74 70 58 64 50 50" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.65" />
        </g>
        <path d="M50 10 C50 40 40 50 10 50 C40 50 50 60 50 90 C50 60 60 50 90 50 C60 50 50 40 50 10 Z" fill="${color}" />
        <path d="M50 30 C50 45 45 50 30 50 C45 50 50 55 50 70 C50 55 55 50 70 50 C55 50 50 45 50 30 Z" fill="${innerColor}" opacity="0.95" />
      </svg>
    `.trim();
    const encodedSvg = btoa(svg);
    const link = document.querySelector("link[rel*='icon']");
    if (link)
      link.href = `data:image/svg+xml;base64,${encodedSvg}`;
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
