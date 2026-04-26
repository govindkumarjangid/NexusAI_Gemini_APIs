import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, X } from 'lucide-react';

const RecentChatsSidebar = ({ open, onClose, chats, onChatClick, onLoadMore, hasMore }) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 z-60"
                    onClick={() => onClose(false)}
                />
            )}
            {open && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 260 }}

                    className="fixed top-0 right-0 h-full w-120 max-w-full border-l shadow-2xl flex flex-col z-70 bg-(--bg-surface) border-(--border-color) text-(--text-primary)"
                >
                    <div className="flex items-center justify-between p-6 pb-4">
                        <span className="font-semibold text-2xl text-(--text-primary)">Recent Chats</span>
                        <button
                            className="p-2 cursor-pointer rounded-full transition-colors hover:opacity-80 text-(--text-secondary)"
                            onClick={onClose}
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
                        {chats.length === 0 && (
                            <div className="dark:text-gray-500 text-gray-400 text-center mt-10">No recent chats.</div>
                        )}
                        {chats.map(chat => {
                            const displayTitle = (() => {
                                if (chat.title && chat.title !== 'New Chat') return chat.title;
                                if (chat.messages && chat.messages.length > 0) {
                                    const firstUserMsg = chat.messages.find(m => m.role === 'user' && m.content);
                                    if (firstUserMsg)
                                        return firstUserMsg.content.length > 40 ? firstUserMsg.content.substring(0, 40) + '...' : firstUserMsg.content;
                                }
                                return 'New Chat';
                            })();
                            return (

                                <button
                                    key={chat._id}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors text-left mb-1 shadow-sm group cursor-pointer hover:opacity-80 text-(--text-secondary) hover:bg-(--bg-elevated)"
                                    onClick={() => onChatClick(chat)}
                                >
                                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white font-bold text-lg shrink-0">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-[15px] truncate transition-colors">{displayTitle}</div>
                                        {chat.updatedAt && (
                                            <div className="text-xs dark:text-gray-400 text-gray-400 mt-0.5 truncate">{new Date(chat.updatedAt).toLocaleString()}</div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                        {hasMore && (
                            <button
                                className="my-4 py-2 px-5 text-sm rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer w-full max-w-fit mx-auto shadow-lg flex items-center gap-1 justify-center active:scale-95 hover:opacity-90"
                                onClick={onLoadMore}
                            >
                                Load More <ChevronDown size={16} />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RecentChatsSidebar;
