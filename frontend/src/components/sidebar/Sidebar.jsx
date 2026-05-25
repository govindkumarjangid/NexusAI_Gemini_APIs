import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SquarePen,
  SquareChevronLeft,
  SquareChevronRight,
  MessageCircle,
  EllipsisVertical,
} from 'lucide-react';

import useAuthStore from '../../store/useAuthStore.js';
import useChatStore from '../../store/useChatStore.js';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';

import ChatList from '../chat/ChatList';
import SidebarBottom from '../sidebar/SidebarBottom';
import RecentChatsSidebar from '../sidebar/RecentChatsSidebar';
import { useState, useEffect } from 'react';
import Tooltip from '../common/Tooltip';


const Sidebar = () => {

  const { isMobile, sidebarOpen, setSidebarOpen, setIsSearchOpen, logout, user } = useAuthStore();
  const { chats, getChatsByUser, createChat, deleteChat, setCurrentChat, currentChat, isLoading: chatLoading } = useChatStore();

  const [recentSidebarOpen, setRecentSidebarOpen] = useState(false);

  // Sort chats: pinned first, then by date
  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const paginatedChats = sortedChats.slice(0, 6);
  const hasMoreRecent = chats.length > 6;


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
  };

  const handleRecentChatClick = (chat) => {
    setCurrentChat(chat);
    navigate(`/chat/${chat._id}`);
    setRecentSidebarOpen(false);
  };

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <motion.div
        initial={false}
        animate={{
          width: isMobile ? 300 : (sidebarOpen ? 300 : 60),
          x: isMobile ? (sidebarOpen ? 0 : -300) : 0
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}

        className={`h-screen flex flex-col whitespace-nowrap ${isMobile ? 'fixed left-0 top-0 z-50 shadow-2xl overflow-hidden px-2 rounded-r-2xl' : 'relative overflow-visible z-20'} bg-(--bg-surface) border-(--border-color) text-(--text-primary)`}
      >
        {/* Top Header */}
        <div className="h-14 flex items-center justify-between shrink-0">
          {(isMobile || sidebarOpen) && (
            <div className="w-full flex items-center justify-between shrink-0 relative group px-3">
              <NavLink to="/chat" className="flex items-center gap-1">
                <Logo size={38} className="text-(--accent-color) drop-shadow-sm transition-all duration-200 hover:scale-105" />
                <h1 className="font-semibold text-lg dark:text-gray-200 text-gray-800">
                  NexusAI
                </h1>
              </NavLink>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-0 sm:p-3 dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full transition-all cursor-pointer duration-300 active:scale-95 dark:text-gray-400 text-gray-500 dark:hover:text-gray-200 hover:text-gray-800"
                title="Collapse Menu"
              >
                <SquareChevronLeft size={20} />
              </button>
            </div>
          )}
          {!isMobile && !sidebarOpen && (
            <div className="w-full flex items-center justify-center shrink-0 relative group">
              <Logo size={38} className="text-(--accent-color) drop-shadow-sm transition-all duration-200 hover:scale-105 group-hover:hidden" />
              <Tooltip text="Expand Menu" position="right" disabled={sidebarOpen}>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-0 sm:p-3 hover:bg-transparent rounded-full hidden group-hover:block transition-all cursor-pointer duration-300 active:scale-95 text-gray-500 dark:text-gray-200 hover:text-gray-800"
                >
                  <SquareChevronRight size={20} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/*  Buttons */}
        <div className="px-2 py-3 mt-1 shrink-0 flex flex-col gap-2">
          {[
            { label: 'New Chat', icon: <SquarePen size={20} />, onClick: handleCreateChat },
            { label: 'Search', icon: <Search size={20} />, onClick: () => setIsSearchOpen(true) },
          ].map(btn => (
            <Tooltip key={btn.label} text={btn.label} position="right" disabled={sidebarOpen}>
              <button
                className={`flex items-center cursor-pointer rounded-full transition-all duration-300 w-full overflow-hidden h-11 active:scale-95 ${
                  sidebarOpen
                    ? 'bg-(--bg-elevated) border border-transparent'
                    : 'bg-transparent border border-transparent hover:bg-(--bg-elevated) hover:border-(--border-color)'
                }`}
                style={{ color: 'var(--text-primary)' }}
                onClick={btn.onClick}
                disabled={chatLoading}
              >
                <div className="w-11 shrink-0 flex items-center justify-center">{btn.icon}</div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium whitespace-nowrap">
                      {btn.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </Tooltip>
          ))}
          {!sidebarOpen && (
            <Tooltip text="Recent Chats" position="right">
              <button
                className="flex items-center cursor-pointer rounded-full transition-all duration-300 w-full overflow-hidden h-11 active:scale-95 bg-transparent border border-transparent hover:bg-(--bg-elevated) hover:border-(--border-color)"
                style={{ color: 'var(--text-primary)' }}
                onClick={handleOpenRecentSidebar}
                disabled={chatLoading}
              >
                <div className="w-11 shrink-0 flex items-center justify-center"><MessageCircle size={20} /></div>
              </button>
            </Tooltip>
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
                  className="text-xs font-semibold dark:text-gray-500 text-gray-400 mb-2 px-2"
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
                        <div key={i} className="flex-1 px-4 py-4 dark:bg-gray-700/40 bg-gray-300/60 rounded-full animate-pulse" />
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
                      className="my-4 py-2 px-4 text-sm rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer w-full max-w-fit mx-auto shadow-lg flex items-center gap-2 justify-center active:scale-95 hover:opacity-90"
                      onClick={() => setIsSearchOpen(true)}
                    >
                      All Chats
                      <EllipsisVertical size={16} className="opacity-80" />
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
        setIsSearchOpen={setIsSearchOpen}
        hasMore={hasMoreRecent}
      />
    </>
  );
}

export default Sidebar;