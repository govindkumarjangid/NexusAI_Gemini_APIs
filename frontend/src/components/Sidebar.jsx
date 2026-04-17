import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MessageSquare, Settings, LogOut,
  Search, Trash2, Edit2, UserCircle, SquarePen,
  SquareChevronLeft,
  SquareChevronRight
} from 'lucide-react';

import logo from '/nexusai-logo.svg';
import useAuthStore from '../store/useAuthStore.js';
import useChatStore from '../store/useChatStore.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

  const {
    isMobile,
    sidebarOpen,
    setSidebarOpen,
    setIsSearchOpen,
    logout,
    user
  } = useAuthStore();

  const {
    chats,
    getChatsByUser,
    createChat,
    deleteChat,
    setCurrentChat,
    isLoading: chatLoading
  } = useChatStore();

  const navigate = useNavigate();
  console.log(chats)

  useEffect(() => {
    if (user?.id)
      getChatsByUser(user.id);
  }, [user, getChatsByUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreateChat = async () => {
    setCurrentChat(null);
    navigate('/chat');
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
            {sidebarOpen ? (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-0 sm:p-3 hover:bg-gray-800 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-200"
                title="Collapse Menu"
              >
                <SquareChevronLeft size={22} />
              </button>
            ) : (
              <div className="group">
                <img
                  src={logo}
                  alt="NexusAI Logo"
                  className="w-9 h-9 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 group-hover:hidden"
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

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-1 pr-3"
              >
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-gray-800 rounded-full cursor-pointer transition-colors text-gray-400 hover:text-gray-200"
                >
                  <Search size={20} />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full cursor-pointer transition-colors text-gray-400 hover:text-gray-200">
                  <Plus size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-3 mt-1 shrink-0">
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
                  {chats && chats.length > 0 ? (
                    chats.map((chat) => (
                      <div
                        key={chat._id}
                        title={chat.title}
                        className="group flex items-center justify-between rounded-full hover:bg-[#2d2f31] cursor-pointer text-gray-300 hover:text-gray-100 transition-colors px-4 py-2"
                        onClick={() => {
                          setCurrentChat(chat);
                          navigate(`/chat/${chat._id}`);
                        }}
                      >
                        <div className="flex items-center gap-3 overflow-hidden text-sm">
                          <MessageSquare size={18} className="shrink-0" />
                          <span className="truncate">{chat.title}</span>
                        </div>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:text-blue-400 text-gray-400 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="p-1 hover:text-red-400 text-gray-400 transition-colors"
                            onClick={e => {
                              e.stopPropagation();
                              deleteChat(chat._id);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 px-2 py-4 text-center">No chats found.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="p-3 border-t border-gray-800/60 space-y-1 shrink-0">
          <button className="w-full flex items-center rounded-full hover:bg-gray-800 cursor-pointer transition-colors text-sm text-gray-300 h-11.5 overflow-hidden" title={!sidebarOpen ? "Profile Settings" : ""}>
            <div className="w-11.5 shrink-0 flex items-center justify-center">
              <UserCircle size={20} />
            </div>
            {sidebarOpen && <span className="whitespace-nowrap truncate pr-3">Profile Settings</span>}
          </button>
          <button className="w-full flex items-center rounded-full hover:bg-gray-800 cursor-pointer transition-colors text-sm text-gray-300 h-11.5 overflow-hidden" title={!sidebarOpen ? "Preferences" : ""}>
            <div className="w-11.5 shrink-0 flex items-center justify-center">
              <Settings size={20} />
            </div>
            {sidebarOpen && <span className="whitespace-nowrap truncate pr-3">Preferences</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-full hover:bg-red-500/10 cursor-pointer hover:text-red-400 transition-colors text-sm text-gray-300 h-11.5 overflow-hidden"
            title={!sidebarOpen ? "Log out" : ""}
          >
            <div className="w-11.5 shrink-0 flex items-center justify-center">
              <LogOut size={20} />
            </div>
            {sidebarOpen && <span className="whitespace-nowrap truncate pr-3">Log out</span>}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;