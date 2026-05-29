import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
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
    if (chat.title && chat.title !== 'New Chat') return chat.title;
    if (chat.messages && Array.isArray(chat.messages)) {
      const firstMsg = chat.messages.find(m => m && typeof m === 'object');
      if (firstMsg) {
        const content = firstMsg.content || firstMsg.prompt || '';
        return content.length > 60 ? content.slice(0, 60) + '...' : content;
      }
    }
    return 'New Chat';
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
          className="fixed inset-0 bg-black/30 z-60"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {isSearchOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed top-0 right-0 h-full w-full sm:w-112.5 md:w-137.5 border-l z-70 flex flex-col shadow-2xl bg-(--bg-surface) border-(--border-color) text-(--text-primary)"
        >
          {/* Header */}
          <div className="py-4 px-5 flex items-center justify-between pb-1">
            <h2 className="text-xl font-semibold text-(--text-primary)">Search</h2>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="cursor-pointer rounded-full transition-colors hover:opacity-80 text-(--text-secondary)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-(--text-muted)" size={18} />
              <input
                type="text"
                placeholder="Search for chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full text-sm rounded-full pl-12 pr-4 py-3 focus:outline-none border transition-colors bg-(--bg-elevated) text-(--text-primary) border-(--border-color)"
              />
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
            <div className="px-2 py-3">
              <p className="text-[15px] font-semibold mb-3 px-2 text-(--text-primary)">Chats</p>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="dark:text-gray-400  px-4 py-3 text-(--text-muted)">Loading...</div>
                ) : filteredChats.length === 0 ? (
                  <div className="px-4 py-3 text-(--text-muted)">No chats found.</div>
                ) : (
                  <>
                    {paginatedChats.map((chat) => (
                      <div
                        key={chat._id}
                        className="flex items-center justify-between px-4 py-3 rounded-full cursor-pointer transition-colors hover:opacity-80 text-(--text-secondary) hover:bg-(--bg-elevated)"
                        onClick={() => {
                          setCurrentChat(chat);
                          setIsSearchOpen(false);
                          navigate(`/chat/${chat._id}`);
                        }}
                      >
                        <span className="text-sm truncate mr-4">{getChatTitle(chat)}</span>
                        <span className="sm:text-sm text-xs dark:text-gray-400 text-gray-400 whitespace-nowrap">{formatDateTime(chat.updatedAt)}</span>
                      </div>
                    ))}
                    {hasMoreChats && (
                      <div className="flex justify-center mt-4 mb-2">
                        <button
                          className="px-4 py-2 text-xs bg-accent text-accent-contrast font-medium rounded-full transition-all cursor-pointer active:scale-95 hover:opacity-90 shadow-lg flex items-center gap-1"
                          onClick={() => setSearchPage((p) => p + 1)}
                        >
                          Load More <ChevronDown size={16} />
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