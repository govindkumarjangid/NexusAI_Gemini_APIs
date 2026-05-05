import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Globe, Link2, Check, Copy } from 'lucide-react';

const ShareModal = ({
    showShareModal,
    setShowShareModal,
    isMobile,
    springConfig,
    currentChat,
    handleShareToggle,
    copyToClipboard,
    copied
}) => {
    return (
        <AnimatePresence>
            {showShareModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowShareModal(false)}
                        className={`fixed inset-0 z-40 ${isMobile ? "bg-black/40" : ""}`}
                    />

                    <motion.div
                        initial={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
                        exit={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                        transition={springConfig}

                        className={`${isMobile
                            ? "fixed bottom-0 left-0 right-0 rounded-t-3xl border-t"
                            : "absolute top-16 right-4 w-full max-w-md rounded-2xl border shadow-lg"
                            } bg-(--bg-surface) border-(--border-color) z-50 overflow-hidden`}
                    >
                        {/* Mobile Handle */}
                        {isMobile && (
                            <div className="flex justify-center pt-4 pb-2">
                                <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                            </div>
                        )}

                        <div className={`${isMobile ? "p-4" : "p-6"}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-(--text-primary) flex items-center gap-2 cursor-pointer">
                                    <Share2 size={24} className="text-(--accent-color)" />
                                    Share Chat
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-(--bg-accent)/50 border border-(--border-color)">
                                    <div className="p-2 rounded-full bg-(--accent-color)/10 text-(--accent-color)">
                                        <Globe size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-(--text-primary)">Public Link</h3>
                                            <button
                                                onClick={() => handleShareToggle(!currentChat.isShared)}
                                                className={`relative inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer active:scale-95 focus:outline-none ${isMobile ? 'h-5 w-9' : 'h-6 w-11'} ${currentChat.isShared ? 'bg-(--accent-color)' : 'bg-(--border-color)'}`}
                                            >
                                                <span
                                                    className={`inline-block transform rounded-full bg-white transition-transform duration-300 ${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${currentChat.isShared ? (isMobile ? 'translate-x-4.5' : 'translate-x-6') : 'translate-x-1'}`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-sm text-(--text-secondary) mt-1">
                                            Anyone with the link can view this chat without logging in.
                                        </p>
                                    </div>
                                </div>

                                {currentChat.isShared && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3"
                                    >
                                        <label className="text-xs font-medium uppercase tracking-wider text-(--text-secondary) ml-1">
                                            Shareable URL
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 flex items-center gap-2 bg-(--bg-accent) px-3 py-2.5 rounded-xl border border-(--border-color) overflow-hidden group">
                                                <Link2 size={16} className="text-(--text-secondary) shrink-0" />
                                                <span className="text-sm text-(--text-primary) truncate">
                                                    {`${window.location.origin}/share/${currentChat.shareId}`}
                                                </span>
                                            </div>
                                            <button
                                                onClick={copyToClipboard}
                                                className={`bg-(--accent-color) text-white rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-(--accent-color)/20 cursor-pointer ${isMobile ? 'p-2' : 'p-2.5'}`}
                                            >
                                                {copied ? <Check size={isMobile ? 18 : 20} /> : <Copy size={isMobile ? 18 : 20} />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        {isMobile && <div className="pb-safe h-4" />}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
