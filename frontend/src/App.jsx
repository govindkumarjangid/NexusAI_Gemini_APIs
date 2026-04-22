import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import Auth from './pages/Auth';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SearchPage from './pages/SearchPage';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
  } = useAuthStore();

  const navigate = useNavigate();
  const isDark = actualTheme === 'dark';

  useEffect(() => {
    if (!user && window.location.pathname !== '/') navigate('/');
    if (user && window.location.pathname === '/') navigate('/chat');
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, navigate, setIsMobile, setSidebarOpen]);


  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: isDark ? {
            background: 'rgba(19, 19, 20, 0.85)',
            color: '#e5e7eb',
            border: '1px solid #232326',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.35)',
            backdropFilter: 'blur(10px)',
          } : {
            background: 'rgba(255, 255, 255, 0.92)',
            color: '#1a1a1a',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: isDark ? '#131314' : '#ffffff',
            },
            style: isDark ? {
              background: 'rgba(34,197,94,0.10)',
              color: '#bbf7d0',
              border: '1px solid #22c55e',
              backdropFilter: 'blur(10px)',
            } : {
              background: 'rgba(34,197,94,0.08)',
              color: '#166534',
              border: '1px solid #22c55e',
              backdropFilter: 'blur(10px)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDark ? '#131314' : '#ffffff',
            },
            style: isDark ? {
              background: 'rgba(239,68,68,0.10)',
              color: '#fecaca',
              border: '1px solid #ef4444',
              backdropFilter: 'blur(10px)',
            } : {
              background: 'rgba(239,68,68,0.08)',
              color: '#991b1b',
              border: '1px solid #ef4444',
              backdropFilter: 'blur(10px)',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={
          user
            ? (
              <Navigate to="/chat" />
            )
            : <Auth />
        }
        />
        <Route path="/chat" element={
          <div className="flex h-screen overflow-hidden relative" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Sidebar />
            <ChatArea />
            <SearchPage />
          </div>
        } />
        <Route path="/chat/:chatId" element={
          <div className="flex h-screen overflow-hidden dark:bg-[#131314] bg-white dark:text-gray-100 text-gray-900 relative">
            <Sidebar />
            <ChatArea />
            <SearchPage />
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;
