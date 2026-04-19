import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const RecentChatsSidebar = ({
    open, onClose, chats, onChatClick, onLoadMore, hasMore
}) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 backdrop-blur-sm z-60"
                    onClick={() => onClose(false)}
                />
            )}
            {open && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-120 max-w-full bg-[#1e1f20] border-l border-gray-800/60 shadow-2xl flex flex-col z-70"
                >
                    <div className="flex items-center justify-between p-6 pb-4">
                        <span className="font-semibold text-2xl text-gray-200">Recent Chats</span>
                        <button
                            className="p-2 cursor-pointer hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-200"
                            onClick={onClose}
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
                        {chats.length === 0 && (
                            <div className="text-gray-500 text-center mt-10">No recent chats.</div>
                        )}
                        {chats.map(chat => {
                            let firstMsg = '';
                            if (chat.messages && chat.messages.length > 0)
                                firstMsg = chat.messages[0].content || chat.messages[0].text || '';
                            const displayTitle = firstMsg || chat.title || chat._id;
                            return (
                                <button
                                    key={chat._id}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors text-left mb-1 text-gray-300 hover:text-gray-100 hover:bg-[#2d2f31] shadow-sm group cursor-pointer"
                                    onClick={() => onChatClick(chat)}
                                >
                                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shrink-0">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-[15px] truncate transition-colors">{displayTitle}</div>
                                        {chat.updatedAt && (
                                            <div className="text-xs text-gray-400 mt-0.5 truncate">{new Date(chat.updatedAt).toLocaleString()}</div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                        {hasMore && (
                            <button
                                className="my-4 py-2 px-4 text-sm rounded-full hover:bg-[#2d2f31] bg-[#23272f] text-gray-200 transition-colors cursor-pointer w-full max-w-fit mx-auto shadow-lg flex items-center gap-1 justify-center"
                                onClick={onLoadMore}
                            >
                                Load More <ChevronDown  size={18} />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RecentChatsSidebar;
