import { useState, useEffect } from 'react';
import { EllipsisVertical, Share2, SquareChevronRight, Pin, Pencil, Trash, X, Copy, Check, Globe, Link2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ChatAreaHeader = () => {

    const [showMore, setShowMore] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [copied, setCopied] = useState(false);

    const { isMobile, sidebarOpen, setSidebarOpen, user } = useAuthStore();
    const {
        currentChat, shareChat, updateChatTitle, togglePinChat, deleteChat,
        showEditModal, setShowEditModal, chatToEdit, setChatToEdit,
        showDeleteModal, setShowDeleteModal, chatToDelete, setChatToDelete
    } = useChatStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (chatToEdit) {
            let titleToSet = chatToEdit.title;
            if (!titleToSet || titleToSet === 'New Chat') {
                const firstUserMsg = chatToEdit.messages?.find(m => m.role === 'user' && m.content);
                titleToSet = firstUserMsg ? (firstUserMsg.content.length > 60 ? firstUserMsg.content.substring(0, 60) : firstUserMsg.content) : 'New Chat';
            }
            setEditedTitle(titleToSet);
        }
    }, [chatToEdit]);

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

    const handlePin = async () => {
        await togglePinChat(currentChat._id);
        setShowMore(false);
    }

    const handleEdit = () => {
        setChatToEdit(currentChat);
        setShowEditModal(true);
        setShowMore(false);
    }

    const handleSaveTitle = async (e) => {
        if (e) e.preventDefault();
        if (editedTitle.trim() && (editedTitle !== chatToEdit.title)) {
            await updateChatTitle(chatToEdit._id, editedTitle.trim());
        }
        setShowEditModal(false);
    }

    const handleDelete = async () => {
        setChatToDelete(currentChat);
        setShowDeleteModal(true);
        setShowMore(false);
    }

    const confirmDelete = async () => {
        if (chatToDelete) {
            await deleteChat(chatToDelete._id);
            if (currentChat?._id === chatToDelete._id) {
                navigate('/chat');
            }
        }
        setShowDeleteModal(false);
    }


    const handleMore = () => {
        setShowMore(!showMore);
    }


    const springConfig = { type: "spring", damping: 28, stiffness: 260 };

    return (
        <>
            {/* header  */}

            <header
                className={`h-14 shrink-0 w-full flex items-center justify-between px-3 sm:px-4 sticky top-0 z-10 border-(--border-color) ${sidebarOpen ? "bg-(--bg-surface)" : "bg-(--bg-header)"} text-(--text-primary)`}
            >


                <div className="flex items-center gap-1.5 sm:gap-3">
                    {isMobile && !sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 sm:p-3 dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full transition-all cursor-pointer duration-300 active:scale-95 text-(--text-secondary)"
                            title="Expand Sidebar"
                        >
                            <SquareChevronRight size={22} />
                        </button>
                    )}
                    <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-(--text-primary) via-(--text-primary) to-(--accent-color)">
                        NexusAI
                    </span>
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

            {/* More Menu Popup */}
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

            {/* Share Modal */}
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

            {/* Edit Title Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            className={`fixed inset-0 z-40 ${isMobile ? "bg-black/40" : ""}`}
                        />

                        <motion.div
                            initial={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
                            exit={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                            transition={springConfig}

                            className={`${isMobile
                                ? "fixed bottom-0 left-0 right-0 rounded-t-3xl border-t"
                                : "absolute top-16 right-4 w-full max-w-md rounded-xl border shadow-lg"
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
                                    <h2 className="text-xl font-bold text-(--text-primary) flex items-center gap-2">
                                        <Pencil size={24} className="text-(--accent-color)" />
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

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className={`flex-1 rounded-full border border-(--border-color) text-(--text-primary) hover:bg-(--bg-accent) transition-all font-semibold cursor-pointer ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3'}`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={`flex-1 rounded-full bg-(--accent-color) text-white hover:brightness-110 shadow-lg shadow-(--accent-color)/20 transition-all font-semibold cursor-pointer ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3'}`}
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className={`fixed inset-0 z-40 ${isMobile ? "bg-black/40" : ""}`}
                        />

                        <motion.div
                            initial={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
                            exit={isMobile ? { y: "100%" } : { opacity: 0, y: -10 }}
                            transition={springConfig}

                            className={`${isMobile
                                ? "fixed bottom-0 left-0 right-0 rounded-t-3xl bord er-t"
                                : "absolute top-16 right-4 w-full max-w-md rounded-xl border shadow-lg"
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
                                    <h2 className="text-xl font-bold text-(--text-primary) flex items-center gap-2">
                                        <Trash size={24} className="text-red-500" />
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


                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(false)}
                                            className={`flex-1 rounded-full border border-(--border-color) text-(--text-primary) hover:bg-(--bg-accent) transition-all font-semibold cursor-pointer ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3'}`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            className={`flex-1 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all font-semibold cursor-pointer ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3'}`}
                                        >
                                            Delete Chat
                                        </button>
                                    </div>
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