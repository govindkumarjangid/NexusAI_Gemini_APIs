import React, { useState } from 'react';
import  { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MessageSquare, Settings, LogOut,
  Search, Menu, MoreVertical, Trash2, Edit2, UserCircle, SquarePen,
  SquareChevronLeft,
  SquareChevronRight
} from 'lucide-react';

export default function Sidebar({ setOnLogout, sidebarOpen, setSidebarOpen, onSearchClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Mock data
  const chats = [
    { id: 1, title: 'Learn React Hooks', date: 'Today' },
    { id: 2, title: 'Tailwind CSS Tips', date: 'Yesterday' },
    { id: 3, title: 'Framer Motion Guide', date: 'Previous 7 Days' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{
        width: sidebarOpen ? 260 : 70
      }}
      className="h-screen flex flex-col bg-[#1e1f20] border-r border-gray-800/60 overflow-hidden whitespace-nowrap"
    >
      {/* Top Header */}
      <div className="p-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-200 mx-auto sm:mx-0"
          title={sidebarOpen ? "Collapse Menu" : "Expand Menu"}
        >
        {
          sidebarOpen ? <SquareChevronLeft  size={20} /> : <SquareChevronRight  size={20} />
        }
        </button>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex gap-1 overflow-hidden"
            >
              <button
                onClick={onSearchClick}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              >
                <Search size={20} />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200">
                <Plus size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Chat Button (Prominent) */}
      <div className="px-3 pb-3">
        <button className={`flex items-center bg-[#2d2f31] hover:bg-[#383a3c] rounded-xl transition-colors text-gray-200 w-full ${sidebarOpen ? 'p-3 gap-3' : 'p-3 justify-center'}`}>
          <SquarePen size={18} className="shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium overflow-hidden"
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
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs font-semibold text-gray-500 mb-2 px-2"
              >
                Recent
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    title={chat.title}
                    className="group flex items-center justify-between rounded-lg hover:bg-[#2d2f31] cursor-pointer text-gray-300 hover:text-gray-100 transition-colors p-2"
                  >
                    <div className="flex items-center gap-3 overflow-hidden text-sm">
                      <MessageSquare size={18} className="shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:text-blue-400 text-gray-400 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1 hover:text-red-400 text-gray-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="p-3 border-t border-gray-800/60 space-y-1">
        <button className={`w-full flex items-center rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300 ${sidebarOpen ? 'p-3 gap-3' : 'p-3 justify-center'}`} title={!sidebarOpen ? "Profile Settings" : ""}>
          <UserCircle size={20} className="shrink-0" />
          {sidebarOpen && <span>Profile Settings</span>}
        </button>
        <button className={`w-full flex items-center rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300 ${sidebarOpen ? 'p-3 gap-3' : 'p-3 justify-center'}`} title={!sidebarOpen ? "Preferences" : ""}>
          <Settings size={20} className="shrink-0" />
          {sidebarOpen && <span>Preferences</span>}
        </button>
        <button
          onClick={setOnLogout}
          className={`w-full flex items-center rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm text-gray-300 ${sidebarOpen ? 'p-3 gap-3' : 'p-3 justify-center'}`}
          title={!sidebarOpen ? "Log out" : ""}
        >
          <LogOut size={20} className="shrink-0" />
          {sidebarOpen && <span>Log out</span>}
        </button>
      </div>
    </motion.div>
  );
}
