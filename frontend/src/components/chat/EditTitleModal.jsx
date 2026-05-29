import { motion, AnimatePresence } from 'framer-motion';
import { Pencil } from 'lucide-react';

const EditTitleModal = ({
    showEditModal,
    setShowEditModal,
    isMobile,
    springConfig,
    editedTitle,
    setEditedTitle,
    handleSaveTitle
}) => {
    return (
        <AnimatePresence>
            {showEditModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowEditModal(false)}
                        className='fixed inset-0 z-40 bg-black/40'
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
                                    <Pencil size={20} className="text-(--accent-color)" />
                                    Rename Chat
                                </h2>
                            </div>


                            <form onSubmit={handleSaveTitle} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-medium uppercase tracking-wider text-(--text-secondary) ml-2">
                                        Chat Title
                                    </label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        placeholder="Enter chat title..."
                                        className="w-full px-4 py-3 rounded-full text-sm outline-none transition-all duration-200 border focus:ring-3 bg-(--bg-elevated) border-(--border-color) text-(--text-primary) focus:border-(--accent-color) ring-[color-mix(in_srgb,var(--accent-color)_30%,transparent)]"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2 px-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className={`flex-1 rounded-full border border-(--border-color) text-(--text-primary) hover:bg-(--bg-accent) transition-all font-medium cursor-pointer px-3 py-2 text-sm`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`flex-1 rounded-full bg-(--accent-color) text-white hover:brightness-110 shadow-lg shadow-(--accent-color)/20 transition-all font-medium cursor-pointer px-3 py-2 text-sm`}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditTitleModal;
