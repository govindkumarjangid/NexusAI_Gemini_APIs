import { useState, useEffect, useMemo, memo } from 'react';
import {
    EllipsisVertical,
    Share2,
    SquareChevronRight,
    ChevronLeft,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import MoreMenuPopup from './MoreMenuPopup';
import ShareModal from './ShareModal';
import EditTitleModal from './EditTitleModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Logo from '../common/Logo'

const ChatAreaHeader = memo(() => {

    const [showMore, setShowMore] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [copied, setCopied] = useState(false);

    // useAuthStore granular selection
    const isMobile = useAuthStore(state => state.isMobile);
    const sidebarOpen = useAuthStore(state => state.sidebarOpen);
    const setSidebarOpen = useAuthStore(state => state.setSidebarOpen);
    const user = useAuthStore(state => state.user);
    const getInitials = useAuthStore(state => state.getInitials);

    // useChatStore granular selection
    const currentChat = useChatStore(state => state.currentChat);
    const shareChat = useChatStore(state => state.shareChat);
    const updateChatTitle = useChatStore(state => state.updateChatTitle);
    const togglePinChat = useChatStore(state => state.togglePinChat);
    const deleteChat = useChatStore(state => state.deleteChat);
    const showEditModal = useChatStore(state => state.showEditModal);
    const setShowEditModal = useChatStore(state => state.setShowEditModal);
    const chatToEdit = useChatStore(state => state.chatToEdit);
    const setChatToEdit = useChatStore(state => state.setChatToEdit);
    const showDeleteModal = useChatStore(state => state.showDeleteModal);
    const setShowDeleteModal = useChatStore(state => state.setShowDeleteModal);
    const chatToDelete = useChatStore(state => state.chatToDelete);
    const setChatToDelete = useChatStore(state => state.setChatToDelete);

    const navigate = useNavigate();

    const initials = useMemo(() => getInitials(), [user, getInitials]);

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
                className={`h-14 shrink-0 w-full flex items-start justify-between px-3 sm:px-4 absolute top-0 left-0 z-10 pointer-events-none text-(--text-primary) py-4 ${isMobile ? 'bg-(--bg-base)' : sidebarOpen ? 'bg-(--bg-surface) backdrop-blur-sm' : 'gemini-header'} transition-colors duration-300`}
            >


                <div className="flex items-center gap-1.5 sm:gap-3 pointer-events-auto">
                    {isMobile && !sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 sm:p-3 dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full transition-all cursor-pointer duration-300 active:scale-95 text-(--text-secondary)"
                            title="Expand Sidebar"
                        >
                            <SquareChevronRight size={18} />
                        </button>
                    )}
                    <span className="font-bold sm:text-lg text-md tracking-tight bg-clip-text text-transparent bg-linear-to-r from-(--text-primary) via-(--text-primary) to-(--accent-color) flex items-center">
                        NexusAI
                    </span>
                </div>
                {
                    currentChat ? (
                        <div className="flex items-center gap-3 pointer-events-auto">
                            <button
                                onClick={handleShare}
                                className='flex gap-2 bg-(--bg-accent) px-2 py-1 rounded-md cursor-pointer hover:bg-(--bg-accent-hover) transition-all duration-300 active:scale-95 text-sm'>
                                <Share2 size={18} />
                            </button>
                            <button
                                onClick={handleMore}
                                className='flex  gap-1 bg-(--bg-accent) px-2 py-1 rounded-md cursor-pointer hover:bg-(--bg-accent-hover) transition-all duration-300 active:scale-95 text-sm' >
                                <EllipsisVertical size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <div className="w-7 h-7 rounded-full bg-accent text-accent-contrast flex items-center justify-center font-semibold text-xs">
                                {initials}
                            </div>
                            <span className="hidden sm:flex font-normal text-sm max-w-30 truncate text-(--text-secondary)">{user?.name || user?.username || 'User'}</span>
                        </div>
                    )
                }
            </header>

            <MoreMenuPopup
                showMore={showMore}
                setShowMore={setShowMore}
                isMobile={isMobile}
                springConfig={springConfig}
                handlePin={handlePin}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                currentChat={currentChat}
            />

            <ShareModal
                showShareModal={showShareModal}
                setShowShareModal={setShowShareModal}
                isMobile={isMobile}
                springConfig={springConfig}
                currentChat={currentChat}
                handleShareToggle={handleShareToggle}
                copyToClipboard={copyToClipboard}
                copied={copied}
            />

            <EditTitleModal
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                isMobile={isMobile}
                springConfig={springConfig}
                editedTitle={editedTitle}
                setEditedTitle={setEditedTitle}
                handleSaveTitle={handleSaveTitle}
            />

            <DeleteConfirmModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isMobile={isMobile}
                springConfig={springConfig}
                chatToDelete={chatToDelete}
                confirmDelete={confirmDelete}
            />

        </>
    );
});



export default ChatAreaHeader;