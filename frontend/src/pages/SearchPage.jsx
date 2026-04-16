import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export default function SearchPage({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  const recentChats = [
    { title: 'Backend Folder Structure Explained', date: 'Today' },
    { title: 'Neck Aur Middle Back Dard Ke Karan Aur Upay', date: 'Yesterday' },
    { title: 'Website Image Formats: Performance Comparison', date: 'Yesterday' },
    { title: 'URL Building Fix Using `window.location.origin`', date: 'Apr 11' },
    { title: 'React useEffect URL Cleanup Bug', date: 'Apr 11' },
    { title: 'ye bson format jo direct mongodb me add ker saku', date: 'Apr 11' },
    { title: 'Dummy Resume Data Generation', date: 'Apr 10' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[450px] md:w-[550px] bg-[#1e1f20] border-l border-gray-800/60 z-50 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between pb-2">
            <h2 className="text-2xl font-semibold text-gray-100">Search</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-200"
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
              <p className="text-[15px] font-semibold text-gray-200 mb-3 px-2">Recent</p>
              <div className="space-y-1">
                {recentChats.map((chat, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#2d2f31] cursor-pointer text-gray-300 hover:text-gray-100 transition-colors"
                  >
                    <span className="text-[15px] truncate mr-4">{chat.title}</span>
                    <span className="text-sm text-gray-400 whitespace-nowrap">{chat.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
