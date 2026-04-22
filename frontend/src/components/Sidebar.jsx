import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, SquarePen,
  SquareChevronLeft,
  SquareChevronRight,
  MessageCircle,
  ChevronDown,
  EllipsisVertical,
} from 'lucide-react';

import logo from '/nexusai-logo.svg';
import useAuthStore from '../store/useAuthStore.js';
import useChatStore from '../store/useChatStore.js';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ChatList from './ChatList.jsx';
import SidebarBottom from './SidebarBottom.jsx';
import RecentChatsSidebar from './RecentChatsSidebar.jsx';

import { useState } from 'react';

const Sidebar = () => {

  const { isMobile, sidebarOpen, setSidebarOpen, setIsSearchOpen, logout, user } = useAuthStore();
  const { chats, getChatsByUser, createChat, deleteChat, setCurrentChat, currentChat, isLoading: chatLoading } = useChatStore();

  const [recentSidebarOpen, setRecentSidebarOpen] = useState(false);
  const [recentPage, setRecentPage] = useState(1);

  const paginatedChats = chats.slice(0, recentPage * 6);
  const hasMoreRecent = chats.length > paginatedChats.length;

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

  const handleOpenRecentSidebar = () => {
    setRecentSidebarOpen(true);
    setRecentPage(1);
  };

  const handleLoadMoreRecent = () => {
    setRecentPage(p => p + 1);
  };

  const handleRecentChatClick = (chat) => {
    setCurrentChat(chat);
    setRecentSidebarOpen(false);
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
          width: isMobile ? 300 : (sidebarOpen ? 300 : 70),
          x: isMobile ? (sidebarOpen ? 0 : -300) : 0
        }}
        transition={{ ease: "easeInOut", duration: 0.2 }}
        className={`h-screen flex flex-col bg-[#1e1f20] border-r border-gray-800/60 overflow-hidden whitespace-nowrap ${isMobile ? 'fixed left-0 top-0 z-50 shadow-2xl' : 'relative'
          }`}
      >
        {/* Top Header */}
        <div className="h-14 flex items-center justify-between shrink-0">
          {sidebarOpen && (sidebarOpen && isMobile ? isMobile : !isMobile) && (
            <div className="w-full flex items-center justify-between shrink-0 relative group px-3">
              <NavLink to="/chat" className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="NexusAI Logo"
                  className="w-11 h-11 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 "
                />
                <h1 className="font-semibold text-lg text-gray-200">NexusAI</h1>
              </NavLink>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-0 sm:p-3 hover:bg-gray-800 rounded-full transition-all cursor-ew-resize duration-300 active:scale-95 text-gray-400 hover:text-gray-200"
                title="Collapse Menu"
              >
                <SquareChevronLeft size={22} />
              </button>
            </div>
          )}
          {
            (!sidebarOpen || !isMobile) && (
              <div className="w-17.5 flex items-center justify-center shrink-0 relative group">
                <img
                  src={logo}
                  alt="NexusAI Logo"
                  className="w-11 h-11 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 group-hover:hidden"
                />
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-0 sm:p-3 hover:bg-gray-800 rounded-full hidden group-hover:block transition-all cursor-ew-resize duration-300 active:scale-95 text-gray-400 hover:text-gray-200"
                  title="Collapse Menu"
                >
                  <SquareChevronRight size={22} />
                </button>
              </div>
            )
          }
        </div>

        {/*  Buttons */}
        <div className="px-3 py-3 mt-1 shrink-0 flex flex-col gap-2 border-b border-gray-700/40">
          <button
            className="flex items-center bg-[#2d2f31] hover:bg-[#383a3c] cursor-pointer rounded-full transition-colors text-gray-200 w-full overflow-hidden h-11"
            title="New Chat"
            onClick={handleCreateChat}
            disabled={chatLoading}
          >
            <div className="w-11 shrink-0 flex items-center justify-center">
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
            className="flex items-center bg-[#2d2f31] hover:bg-[#383a3c] cursor-pointer rounded-full transition-colors text-gray-200 w-full overflow-hidden h-11"
            onClick={() => setIsSearchOpen(true)}
            disabled={chatLoading}
            title="Search in Chats"
          >
            <div className="w-11 shrink-0 flex items-center justify-center">
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
              className="flex items-center bg-[#2d2f31] hover:bg-[#383a3c] cursor-pointer rounded-full transition-colors text-gray-200 w-full overflow-hidden h-11"
              onClick={handleOpenRecentSidebar}
              disabled={chatLoading}
              title="Recent Chats"
            >
              <div className="w-11 shrink-0 flex items-center justify-center">
                <AnimatePresence>
                  {!sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      <MessageCircle size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
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
                  {chatLoading ? (
                    <div className="space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 px-4 py-4 bg-gray-700/40 rounded-full animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <ChatList
                      chats={paginatedChats}
                      currentChat={currentChat}
                      setCurrentChat={setCurrentChat}
                      navigate={navigate}
                      deleteChat={deleteChat}
                      getChatsByUser={getChatsByUser}
                    />
                  )}
                  {hasMoreRecent && (
                    <button
                      className="my-4 py-2 px-4 text-sm rounded-full hover:bg-[#2d2f31] bg-[#23272f] text-gray-200 transition-colors cursor-pointer w-full max-w-fit mx-auto shadow-lg flex items-center gap-2 justify-center"
                      onClick={() => setIsSearchOpen(true)}
                    >
                      All Chats
                      <EllipsisVertical size={20} className="p-1 bg-[#131314] rounded-full" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Area */}
        <SidebarBottom sidebarOpen={sidebarOpen} handleLogout={handleLogout} />
      </motion.div>
      {/* Recent Chats Sidebar */}
      <RecentChatsSidebar
        open={recentSidebarOpen}
        onClose={() => setRecentSidebarOpen(false)}
        chats={paginatedChats}
        onChatClick={handleRecentChatClick}
        onLoadMore={handleLoadMoreRecent}
        hasMore={hasMoreRecent}
      />
    </>
  );
}

export default Sidebar;