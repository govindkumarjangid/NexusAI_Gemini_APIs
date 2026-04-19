import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';

const SearchPage = () => {
  const { isSearchOpen, setIsSearchOpen, user } = useAuthStore();
  const { chats, getChatsByUser, isLoading, setCurrentChat } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen && user && user._id)
      getChatsByUser(user._id);
  }, [isSearchOpen, user, getChatsByUser]);

  function getChatTitle(chat) {
    if (!chat.messages || !Array.isArray(chat.messages)) return 'Untitled Chat';
    const userMsg = chat.messages.find(m => m.role === 'user' && m.content);
    return userMsg ? userMsg.content.slice(0, 60) : 'Untitled Chat';
  }

  function formatDateTime(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const filteredChats = chats
    ? chats.filter(chat =>
      getChatTitle(chat).toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

  return (
    <AnimatePresence>

      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm z-60"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {isSearchOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full sm:w-112.5 md:w-137.5 bg-[#1e1f20] border-l border-gray-800/60 z-70 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between pb-2">
            <h2 className="text-2xl font-semibold text-gray-100">Search</h2>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 cursor-pointer hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Input */}
          <div className="px-6 py-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-200 transition-colors" />
              <input
                type="text"
                placeholder="Search for chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#131314] text-[15px] text-gray-100 placeholder-gray-500 rounded-full pl-12 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-gray-700 border border-gray-700/50 hover:bg-[#252628] transition-colors"
              />
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <div className="px-2 py-3">
              <p className="text-[15px] font-semibold text-gray-200 mb-3 px-2">Chats</p>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="text-gray-400 px-4 py-3">Loading...</div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-gray-400 px-4 py-3">No chats found.</div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat._id}
                      className="flex items-center justify-between px-4 py-3 rounded-full hover:bg-[#2d2f31] cursor-pointer text-gray-300 hover:text-gray-100 transition-colors"
                      onClick={() => {
                        setCurrentChat(chat);
                        setIsSearchOpen(false);
                        navigate(`/chat/${chat._id}`);
                      }}
                    >
                      <span className="text-[15px] truncate mr-4">{getChatTitle(chat)}</span>
                      <span className="text-sm text-gray-400 whitespace-nowrap">{formatDateTime(chat.updatedAt)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchPage;