import { motion, AnimatePresence } from 'framer-motion';
import { Trash, Loader } from 'lucide-react';

const DeleteConfirmModal = ({
    showDeleteModal,
    setShowDeleteModal,
    isMobile,
    springConfig,
    chatToDelete,
    confirmDelete,
    isDeleting
}) => {
    return (
        <AnimatePresence>
            {showDeleteModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isDeleting && setShowDeleteModal(false)}
                        className="fixed inset-0 z-40 bg-black/40"
                    />

                    <motion.div
                        initial={isMobile ? { y: "100%" } : { opacity: 0, x: "-50%", y: "-50%", scale: 0.98 }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
                        exit={isMobile ? { y: "100%" } : { opacity: 0, x: "-50%", y: "-50%", scale: 0.98 }}
                        transition={springConfig}

                        className={`${isMobile
                            ? "fixed bottom-0 left-0 right-0 rounded-t-3xl border-t"
                            : "fixed top-[50%] left-[50%] w-full max-w-md rounded-3xl border shadow-lg"
                            } bg-(--bg-surface) border-(--border-color) z-50 overflow-hidden`}
                    >
                        {/* Mobile Handle */}
                        {isMobile && (
                            <div className="flex justify-center pt-4 pb-2">
                                <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-(--text-primary) flex items-center gap-2">
                                    <Trash size={20} className="text-red-500" />
                                    Delete Chat
                                </h2>
                            </div>


                            <div className="space-y-6">
                                <p className="text-(--text-secondary) px-1">
                                    Are you sure you want to delete <span className="font-semibold text-(--text-primary)">
                                        "{(() => {
                                            if (!chatToDelete) return 'this chat';
                                            if (chatToDelete.title && chatToDelete.title !== 'New Chat') return chatToDelete.title;
                                            if (chatToDelete.messages && chatToDelete.messages.length > 0) {
                                                const firstUserMsg = chatToDelete.messages.find(m => m.role === 'user' && m.content);
                                                if (firstUserMsg) return firstUserMsg.content.length > 40 ? firstUserMsg.content.substring(0, 40) + '...' : firstUserMsg.content;
                                            }
                                            return chatToDelete.title || 'this chat';
                                        })()}"
                                    </span>? This action cannot be undone.
                                </p>


                                <div className="flex gap-3 pt-2 px-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={isDeleting}
                                        className={`flex-1 rounded-full border border-(--border-color) text-(--text-primary) hover:bg-(--bg-accent) transition-all font-medium cursor-pointer px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className={`flex-1 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all font-medium cursor-pointer px-3 py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader size={16} className="animate-spin shrink-0" />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete Chat'
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
