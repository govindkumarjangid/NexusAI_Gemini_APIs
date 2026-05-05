import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Pencil, Trash } from 'lucide-react';

const MoreMenuPopup = ({
    showMore,
    setShowMore,
    isMobile,
    springConfig,
    handlePin,
    handleEdit,
    handleDelete,
    currentChat
}) => {
    return (
        <AnimatePresence>
            {showMore && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowMore(false)}
                        className={`fixed inset-0 z-40 ${isMobile ? "bg-black/40" : ""}`}
                    />
                    <motion.div
                        initial={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
                        exit={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                        transition={springConfig}

                        className={`${isMobile
                            ? "fixed bottom-0 left-0 right-0 rounded-t-3xl border-t px-4"
                            : "absolute top-16 right-4 w-40 p-2 rounded-2xl border shadow-lg"
                            } bg-(--bg-surface) border-(--border-color) z-50 space-y-1`}
                    >
                        {/* Mobile Handle */}
                        {isMobile && (
                            <div className="flex justify-center pt-4 pb-2">
                                <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                            </div>
                        )}

                        <button
                            onClick={handlePin}
                            className={`flex items-center gap-3 rounded-xl cursor-pointer hover:bg-(--bg-hover) transition-all duration-300 active:scale-95 hover:text-(--text-primary) w-full font-medium  ${isMobile ? 'px-2.5 py-2 text-xs mt-4' : 'px-3 py-2.5 text-sm'}`} >
                            <Pin size={isMobile ? 16 : 18} className={`${currentChat?.isPinned ? 'text-(--accent-color) fill-(--accent-color)' : 'text-(--text-secondary)'}`} />
                            <span>{currentChat?.isPinned ? 'Unpin Chat' : 'Pin Chat'}</span>
                        </button>
                        <button
                            onClick={handleEdit}
                            className={`flex items-center gap-3 rounded-xl cursor-pointer hover:bg-(--bg-hover) transition-all duration-300 active:scale-95 hover:text-(--text-primary) w-full font-medium ${isMobile ? 'px-2.5 py-2 text-xs' : 'px-3 py-2.5 text-sm'}`} >
                            <Pencil size={isMobile ? 16 : 18} className="text-(--text-secondary)" />
                            <span>Edit Title</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className={`flex items-center gap-3 rounded-xl cursor-pointer hover:bg-red-500/10 text-red-500 transition-all duration-300 active:scale-95 w-full font-medium  ${isMobile ? 'px-2.5 py-2 text-xs mb-4' : 'px-3 py-2.5 text-sm'}`} >
                            <Trash size={isMobile ? 16 : 18} />
                            <span>Delete Chat</span>
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MoreMenuPopup;
