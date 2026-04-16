import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Auth from './pages/Auth';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SearchPage from './pages/SearchPage';

const App = () => {
  const [user, setUser] = useState({
    name: 'User',
    email: 'user@gmail.com'
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#131314] text-gray-100 relative">
      <Sidebar
        setOnLogout={() => setUser(null)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSearchClick={() => setIsSearchOpen(true)}
        isMobile={isMobile}
      />

      {/* Mobile Backdrop for Sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <ChatArea
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Search Drawer Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            onClick={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>
      <SearchPage isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default App;
