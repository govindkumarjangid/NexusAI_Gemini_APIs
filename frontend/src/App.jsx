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
    isMobile,
    setIsMobile,
    sidebarOpen,
    setSidebarOpen,
    isSearchOpen,
    setIsSearchOpen,
  } = useAuthStore();

  const navigate = useNavigate();

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
          style: {
            background: '#232326',
            color: '#fff',
            border: '1px solid #F0F0F0',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
            style: {
              background: '#232326',
              color: '#fff',
              border: '1px solid #22c55e',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#232326',
              color: '#fff',
              border: '1px solid #ef4444',
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
          <div className="flex h-screen overflow-hidden bg-[#131314] text-gray-100 relative">
            <Sidebar />
            <ChatArea />
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/10 backdrop-blur-md z-60"
                  onClick={() => setIsSearchOpen(false)}
                />
              )}
            </AnimatePresence>
            <SearchPage />
          </div>
        } />
        <Route path="/chat/:chatId" element={
          <div className="flex h-screen overflow-hidden bg-[#131314] text-gray-100 relative">
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
