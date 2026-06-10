import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Search, SquarePen,
  SquareChevronLeft,
  SquareChevronRight,
  MessageCircle,
  EllipsisVertical,
} from 'lucide-react';

import useAuthStore from '../../store/useAuthStore.js';
import useChatStore from '../../store/useChatStore.js';

import Logo from '../common/Logo';
import ChatList from '../chat/ChatList';
import Tooltip from '../common/Tooltip';
import SidebarBottom from '../sidebar/SidebarBottom';
import RecentChatsSidebar from '../sidebar/RecentChatsSidebar';


const Sidebar = () => {

  const { isMobile, sidebarOpen, setSidebarOpen, setIsSearchOpen, logout, user } = useAuthStore();
  const { chats, getChatsByUser, createChat, deleteChat, setCurrentChat, currentChat, isLoading: chatLoading } = useChatStore();

  const [recentSidebarOpen, setRecentSidebarOpen] = useState(false);
  const [visibleRecentCount, setVisibleRecentCount] = useState(5);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  // Separate and sort chats
  const pinnedChats = chats.filter(c => c.isPinned).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentChats = chats.filter(c => !c.isPinned).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedRecentChats = recentChats.slice(0, visibleRecentCount);
  const hasMoreRecent = recentChats.length > visibleRecentCount;

  const handleLoadMore = () => {
    setIsMoreLoading(true);
    setTimeout(() => {
      setVisibleRecentCount(prev => prev + 5);
      setIsMoreLoading(false);
    }, 800);
  };


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

        className={`h-screen flex flex-col whitespace-nowrap ${isMobile ? 'fixed left-0 top-0 z-50 shadow-2xl overflow-hidden px-2 rounded-r-3xl' : 'relative overflow-visible z-30'} bg-(--bg-surface) border-(--border-color) text-(--text-primary)`}
      >
        {/* Top Header */}
        <div className="h-14 flex items-center justify-between shrink-0 px-2">
          {(isMobile || sidebarOpen) && (
            <div className="w-full flex items-center justify-between shrink-0 relative group">
              <NavLink to="/chat" className="flex items-center gap-1">
                <Logo size={36} className="text-(--accent-color) drop-shadow-sm transition-all duration-200 hover:scale-105" />
                <h1 className="font-medium text-md dark:text-gray-200 text-gray-800">
                  NexusAI
                </h1>
              </NavLink>
              <button
                onClick={() => setSidebarOpen(false)}
                className="h-10 w-10 flex items-center justify-center dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full transition-all cursor-pointer duration-300 active:scale-95 dark:text-gray-400 text-gray-500 dark:hover:text-gray-200 hover:text-gray-800"
                title="Collapse Menu"
              >
                <SquareChevronLeft size={18} />
              </button>
            </div>
          )}
          {!isMobile && !sidebarOpen && (
            <div className="w-full flex items-center justify-center shrink-0 relative group">
              <Tooltip text="Expand Menu" position="right" disabled={sidebarOpen}>
                <Logo size={36} className="text-(--accent-color) drop-shadow-sm transition-all duration-200 hover:scale-105 group-hover:hidden" />
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="h-9 w-9 hidden group-hover:flex items-center justify-center hover:bg-transparent rounded-full transition-all cursor-pointer duration-300 active:scale-95 text-gray-500 dark:text-gray-200 hover:text-gray-800"
                >
                  <SquareChevronRight size={18} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/*  Buttons */}
        <div className="px-2 py-3 mt-1 shrink-0 flex flex-col gap-2">
          {[
            { label: 'New Chat', icon: <SquarePen size={16} />, onClick: handleCreateChat },
            { label: 'Search', icon: <Search size={18} />, onClick: () => setIsSearchOpen(true) },
          ].map(btn => (
            <Tooltip key={btn.label} text={btn.label} position="right" disabled={sidebarOpen}>
              <button
                className={`flex items-center cursor-pointer rounded-full transition-all duration-200 overflow-hidden active:scale-98 h-10 ${sidebarOpen
                  ? 'bg-(--bg-elevated)'
                  : 'bg-transparent hover:bg-(--bg-elevated)'
                  }`}
                style={{ color: 'var(--text-primary)' }}
                onClick={btn.onClick}
                disabled={chatLoading}
              >
                <div className="w-10 shrink-0 flex items-center justify-center">{btn.icon}</div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap">
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
                className="flex items-center cursor-pointer rounded-full transition-all duration-300 w-full overflow-hidden h-10 active:scale-95 bg-transparent hover:bg-(--bg-elevated) text-(--text-primary)"
                onClick={handleOpenRecentSidebar}
                disabled={chatLoading}
              >
                <div className="p-3 shrink-0 flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
              </button>
            </Tooltip>
          )}
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-6 custom-scrollbar">
          {/* Pinned Chats Section */}
          {pinnedChats.length > 0 && (
            <div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold dark:text-gray-500 text-gray-400 mb-2 px-2"
                  >
                    Pinned Chats
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
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="flex-1 px-4 py-4 dark:bg-gray-700/40 bg-gray-300/60 rounded-full animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <ChatList
                        chats={pinnedChats}
                        currentChat={currentChat}
                        setCurrentChat={setCurrentChat}
                        navigate={navigate}
                        deleteChat={deleteChat}
                        getChatsByUser={getChatsByUser}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Recent Chats Section */}
          <div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold dark:text-gray-500 text-gray-400 mb-2 px-2"
                >
                  Recent Chats
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
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex-1 px-4 py-4 dark:bg-gray-700/40 bg-gray-300/60 rounded-full animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <ChatList
                      chats={paginatedRecentChats}
                      currentChat={currentChat}
                      setCurrentChat={setCurrentChat}
                      navigate={navigate}
                      deleteChat={deleteChat}
                      getChatsByUser={getChatsByUser}
                    />
                  )}
                  {isMoreLoading && (
                    <div className="space-y-2 mt-2 px-1 animate-pulse">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-gray-300/30 dark:bg-gray-700/30 w-full">
                          <div className="w-4 h-4 rounded-full bg-gray-400/40 dark:bg-gray-600/40 shrink-0" />
                          <div className="h-3.5 bg-gray-400/40 dark:bg-gray-600/40 rounded-full w-2/3" />
                        </div>
                      ))}
                    </div>
                  )}
                  {hasMoreRecent && !isMoreLoading && (
                    <button
                      className="my-4 py-2 px-4 text-xs rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer w-full max-w-fit mx-auto shadow-lg flex items-center gap-2 justify-center active:scale-98 hover:opacity-90"
                      onClick={handleLoadMore}
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
        chats={paginatedRecentChats}
        onChatClick={handleRecentChatClick}
        setIsSearchOpen={setIsSearchOpen}
        hasMore={hasMoreRecent}
      />
    </>
  );
}

export default Sidebar;