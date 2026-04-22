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
  const [searchPage, setSearchPage] = useState(1);
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

  const paginatedChats = filteredChats.slice(0, searchPage * 6);
  const hasMoreChats = filteredChats.length > paginatedChats.length;

  useEffect(() => {
    setSearchPage(1);
  }, [searchQuery]);

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
          className="fixed top-0 right-0 h-full w-full sm:w-112.5 md:w-137.5 dark:bg-[#1e1f20] bg-white border-l dark:border-gray-800/60 border-gray-200 z-70 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between pb-2">
            <h2 className="text-2xl font-semibold dark:text-gray-100 text-gray-900">Search</h2>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-100 rounded-full transition-colors dark:text-gray-400 text-gray-500 dark:hover:text-gray-200 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Input */}
          <div className="px-6 py-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 dark:text-gray-400 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-200 transition-colors" />
              <input
                type="text"
                placeholder="Search for chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full dark:bg-[#131314] bg-gray-50 text-[15px] dark:text-gray-100 text-gray-900 dark:placeholder-gray-500 placeholder-gray-400 rounded-full pl-12 pr-4 py-3.5 focus:outline-none focus:ring-1 dark:focus:ring-gray-700 focus:ring-gray-300 border dark:border-gray-700/50 border-gray-200 dark:hover:bg-[#252628] hover:bg-gray-100 transition-colors"
              />
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <div className="px-2 py-3">
              <p className="text-[15px] font-semibold dark:text-gray-200 text-gray-800 mb-3 px-2">Chats</p>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="dark:text-gray-400 text-gray-500 px-4 py-3">Loading...</div>
                ) : filteredChats.length === 0 ? (
                  <div className="dark:text-gray-400 text-gray-500 px-4 py-3">No chats found.</div>
                ) : (
                  <>
                    {paginatedChats.map((chat) => (
                      <div
                        key={chat._id}
                        className="flex items-center justify-between px-4 py-3 rounded-full dark:hover:bg-[#2d2f31] hover:bg-gray-100 cursor-pointer dark:text-gray-300 text-gray-600 dark:hover:text-gray-100 hover:text-gray-900 transition-colors"
                        onClick={() => {
                          setCurrentChat(chat);
                          setIsSearchOpen(false);
                          navigate(`/chat/${chat._id}`);
                        }}
                      >
                        <span className="text-[15px] truncate mr-4">{getChatTitle(chat)}</span>
                        <span className="text-sm dark:text-gray-400 text-gray-400 whitespace-nowrap">{formatDateTime(chat.updatedAt)}</span>
                      </div>
                    ))}
                    {hasMoreChats && (
                      <div className="flex justify-center mt-4">
                        <button
                          className="px-4 py-2 dark:bg-gray-700 bg-gray-100 dark:text-gray-200 text-gray-700 rounded-full dark:hover:bg-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                          onClick={() => setSearchPage((p) => p + 1)}
                        >
                          Load More

                        </button>
                      </div>
                    )}
                  </>
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