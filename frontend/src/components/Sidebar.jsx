import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, SquarePen,
  SquareChevronLeft,
  SquareChevronRight,
  MessageCircle
} from 'lucide-react';

import logo from '/nexusai-logo.svg';
import useAuthStore from '../store/useAuthStore.js';
import useChatStore from '../store/useChatStore.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList.jsx';
import SidebarBottom from './SidebarBottom.jsx';

const Sidebar = () => {

  const { isMobile, sidebarOpen, setSidebarOpen, setIsSearchOpen, logout, user } = useAuthStore();
  const { chats, getChatsByUser, createChat, deleteChat, setCurrentChat, currentChat, isLoading: chatLoading } = useChatStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id)
      getChatsByUser(user.id);
  }, [user, getChatsByUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreateChat = async () => {
    if (!user?.id) return;
    await createChat({ userId: user.id, navigate });
    await getChatsByUser(user.id);
  };

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <motion.div
        initial={false}
        animate={{
          width: isMobile ? 280 : (sidebarOpen ? 260 : 70),
          x: isMobile ? (sidebarOpen ? 0 : -280) : 0
        }}
        transition={{ ease: "easeInOut", duration: 0.3 }}
        className={`h-screen flex flex-col bg-[#1e1f20] border-r border-gray-800/60 overflow-hidden whitespace-nowrap ${isMobile ? 'fixed left-0 top-0 z-50 shadow-2xl' : 'relative'
          }`}
      >
        {/* Top Header */}
        <div className="h-14 flex items-center justify-between border-b border-gray-800/60 shrink-0">
          <div className="w-17.5 flex items-center justify-center shrink-0 relative group">
            {sidebarOpen && !isMobile ? (
              <div className="w-17.5 flex items-center justify-between">
                <img
                  src={logo}
                  alt="NexusAI Logo"
                  className="w-8 h-8 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 "
                />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-0 sm:p-3 hover:bg-gray-800 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-200"
                  title="Collapse Menu"
                >
                  <SquareChevronLeft size={22} />
                </button>
              </div>
            ) : (
              <div className="group">
                <img
                  src={logo}
                  alt="NexusAI Logo"
                  className="w-8 h-8 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 group-hover:hidden"
                />
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-0 sm:p-3 hover:bg-gray-800 rounded-full transition-colors hidden group-hover:flex cursor-pointer text-gray-400 hover:text-gray-200"
                  title="Collapse Menu"
                >
                  <SquareChevronRight size={22} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-3 mt-1 shrink-0 flex flex-col gap-2">
          <button
            className="flex items-center bg-[#2d2f31] hover:bg-[#383a3c] cursor-pointer rounded-full transition-colors text-gray-200 w-full overflow-hidden h-11.5"
            onClick={handleCreateChat}
            disabled={chatLoading}
          >
            <div className="w-11.5 shrink-0 flex items-center justify-center">
              <SquarePen size={18} />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  New Chat
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            className="flex items-center bg-[#2d2f31] hover:bg-[#383a3c] cursor-pointer rounded-full transition-colors text-gray-200 w-full overflow-hidden h-11.5"
            onClick={() => setIsSearchOpen(true)}
            disabled={chatLoading}
          >
            <div className="w-11.5 shrink-0 flex items-center justify-center">
              <Search size={18} />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Search
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          {!sidebarOpen && (
            <button
              className="flex items-center bg-[#2d2f31] hover:bg-[#383a3c] cursor-pointer rounded-full transition-colors text-gray-200 w-full overflow-hidden h-11.5"
              onClick={() => setIsSearchOpen(true)}
              disabled={chatLoading}
            >
              <div className="w-11.5 shrink-0 flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
            </button>
          )}
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-6 custom-scrollbar">
          <div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-gray-500 mb-2 px-2"
                >
                  Recent
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1"
                >
                  <ChatList
                    chats={chats}
                    currentChat={currentChat}
                    setCurrentChat={setCurrentChat}
                    navigate={navigate}
                    deleteChat={deleteChat}
                    getChatsByUser={getChatsByUser}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Area */}
        <SidebarBottom sidebarOpen={sidebarOpen} handleLogout={handleLogout} />
      </motion.div>
    </>
  );
}

export default Sidebar;