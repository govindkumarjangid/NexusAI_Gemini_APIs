import { useState, useEffect } from 'react';
import { EllipsisVertical, Share2, SquareChevronRight, Pin, Pencil, Trash, X, Copy, Check, Globe, Link2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ChatAreaHeader = () => {

    const [showMore, setShowMore] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const { isMobile, sidebarOpen, setSidebarOpen, user } = useAuthStore();
    const { currentChat, shareChat } = useChatStore();

    const handleShare = () => {
        setShowShareModal(!showShareModal);
    }

    const handleShareToggle = async (isShared) => {
        await shareChat(currentChat._id, isShared);
    }

    const copyToClipboard = () => {
        const shareUrl = `${window.location.origin}/share/${currentChat.shareId}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    }

    const handlePin = () => {
        console.log('Pin');
    }

    const handleEdit = () => {
        console.log('Edit');
    }

    const handleDelete = () => {
        console.log('Delete');
    }

    const handleMore = () => {
        setShowMore(!showMore);
    }

    return (
        <>
            <header
                className="h-14 shrink-0 w-full flex items-center justify-between px-3 sm:px-4 border-b sticky top-0 z-10 backdrop-blur-sm border-(--border-color) bg-(--bg-surface) text-(--text-primary)"
            >
                <div className="flex items-center gap-3">
                    {isMobile && !sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-0 sm:p-3 rounded-full transition-all cursor-ew-resize duration-300 active:scale-95 text-(--text-secondary)"
                        >
                            <SquareChevronRight size={22} />
                        </button>
                    )}
                    <h1 className="font-semibold text-lg text-(--text-primary)">NexusAI</h1>
                </div>
                {
                    currentChat ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className='flex gap-2 bg-(--bg-accent) px-2 py-1 rounded-md cursor-pointer hover:bg-(--bg-accent-hover) transition-all duration-300 active:scale-95 text-sm'>
                                <Share2 size={18} />
                                <span className='hidden sm:block'>Share</span>
                            </button>
                            <button
                                onClick={handleMore}
                                className='flex  gap-1 bg-(--bg-accent) px-2 py-1 rounded-md cursor-pointer hover:bg-(--bg-accent-hover) transition-all duration-300 active:scale-95 text-sm' >
                                <EllipsisVertical size={18} />
                                <span className='hidden sm:block'>More</span>
                            </button>
                        </div>
                    ) : (
                        (() => {
                            const initial = (() => {
                                if (!user.name) return '?';
                                const parts = user.name.trim().split(/\s+/);
                                if (parts.length === 1) return parts[0][0].toUpperCase();
                                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                            })();

                            return (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-accent text-accent-contrast flex items-center justify-center font-semibold text-sm">
                                        {initial}
                                    </div>
                                    <span className="hidden sm:flex font-normal text-base max-w-30 truncate text-(--text-secondary)">{user.name || 'User'}</span>
                                </div>
                            );
                        })()
                    )
                }
            </header>

            {/* More Menu Popover / Bottom Sheet */}
            <AnimatePresence>
                {showMore && (
                    <>
                        {/* Backdrop for mobile */}
                        {isMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowMore(false)}
                                className="fixed inset-0 bg-black/40 z-40"
                            />
                        )}

                        <motion.div
                            initial={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
                            exit={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`${isMobile
                                ? "fixed bottom-0 left-0 right-0 rounded-t-3xl border-t p-6"
                                : "absolute top-16 right-4 w-40 p-3 rounded-lg border shadow-lg"
                                } bg-(--bg-surface) border-(--border-color) z-50 space-y-1`}
                        >
                            {/* Mobile Handle */}
                            {isMobile && (
                                <div className="flex justify-center -mt-3 pb-1">
                                    <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                                </div>
                            )}

                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-(--bg-accent) transition-all duration-300 active:scale-95 text-sm hover:text-(--text-primary) w-full font-medium" >
                                <Pin size={18} className="text-(--text-secondary)" />
                                <span>Pin Chat</span>
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-(--bg-accent) transition-all duration-300 active:scale-95 text-sm hover:text-(--text-primary) w-full font-medium" >
                                <Pencil size={18} className="text-(--text-secondary)" />
                                <span>Edit Title</span>
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/10 text-red-500 transition-all duration-300 active:scale-95 text-sm w-full font-medium" >
                                <Trash size={18} />
                                <span>Delete Chat</span>
                            </button>

                            {isMobile && (
                                <button
                                    onClick={() => setShowMore(false)}
                                    className="absolute block sm:hidden top-2 right-2 p-2 rounded-full text-sm bg-accent cursor-pointer"
                                >
                                    <X size={18} className='text-(--text-primary)' />
                                </button>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Share Modal / Bottom Sheet */}
            <AnimatePresence>
                {showShareModal && (
                    <>
                        {/* Backdrop for mobile */}
                        {isMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowShareModal(false)}
                                className="fixed inset-0 bg-black/40 z-40"
                            />
                        )}

                        <motion.div
                            initial={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
                            exit={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`${isMobile
                                ? "fixed bottom-0 left-0 right-0 rounded-t-3xl border-t"
                                : "absolute top-16 right-4 w-full max-w-md rounded-xl border shadow-lg"
                                } bg-(--bg-surface) border-(--border-color) z-50 overflow-hidden`}
                        >
                            {/* Mobile Handle */}
                            {isMobile && (
                                <div className="flex justify-center pt-3 pb-1">
                                    <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-(--text-primary) flex items-center gap-2 cursor-pointer">
                                        <Share2 size={24} className="text-(--accent-color)" />
                                        Share Chat
                                    </h2>
                                </div>

                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="block sm:hidden absolute top-2 right-2 p-2 rounded-full bg-accent transition-colors text-(--text-contrast) cursor-pointer"
                                >
                                    <X size={20} />
                                </button>

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
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer active:scale-95 focus:outline-none ${currentChat.isShared ? 'bg-(--accent-color)' : 'bg-(--border-color)'}`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${currentChat.isShared ? 'translate-x-6' : 'translate-x-1'}`}
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
                                                    className="p-2.5 bg-(--accent-color) text-white rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-(--accent-color)/20 cursor-pointer"
                                                >
                                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatAreaHeader;
