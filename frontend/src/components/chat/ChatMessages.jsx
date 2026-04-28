import { useEffect, useRef, useState, memo } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import Spinner from '../model/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { renderMessageContent } from '../../configs/renderMessageContent';
import { X, Download, ExternalLink, Copy, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const ImageSkeleton = () => (
    <div className="w-full max-w-[300px] aspect-square rounded-xl bg-(--accent-color)/10 dark:bg-(--accent-color)/15 animate-pulse flex flex-col items-center justify-center gap-3 border border-(--accent-color)/20 shadow-inner">
        <div className="relative">
            <Sparkles className="text-(--accent-color) animate-bounce" size={32} />
            <div className="absolute inset-0 bg-(--accent-color)/30 blur-2xl animate-pulse rounded-full" />
        </div>
        <p className="text-xs font-bold text-(--accent-color) uppercase tracking-widest animate-pulse text-center px-4">Creating Magic...</p>
    </div>
);


const UserMessageItem = memo(({ msg, setSelectedImage, handleCopy, copiedId, idx }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);
    const [shouldShowExpand, setShouldShowExpand] = useState(false);

    useEffect(() => {
        if (contentRef.current) {
            const isLong = contentRef.current.scrollHeight > 100;
            setShouldShowExpand(isLong);
        }
    }, [msg.content]);

    return (
        <div
            className="group relative bg-accent text-accent-contrast rounded-3xl rounded-tr-sm px-4 py-2 sm:px-5 shadow-lg max-w-[95%] sm:max-w-[85%] md:max-w-[70%] w-fit self-end transition-all duration-300"
        >
            <div className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words w-full relative">
                {(msg.imageUrl || msg.image) && (
                    <div className="mb-2 max-w-[280px] sm:max-w-[300px] overflow-hidden rounded-xl border border-white/20 bg-black/10 p-1 group relative">
                        <img
                            src={msg.imageUrl || msg.image}
                            alt="User upload"
                            className="max-h-[260px] w-full rounded-lg object-cover cursor-pointer hover:brightness-110 transition-all"
                            onClick={() => setSelectedImage(msg.imageUrl || msg.image)}
                        />
                    </div>

                )}
                <motion.div
                    animate={{ height: isExpanded || !shouldShowExpand ? 'auto' : 100 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="overflow-hidden relative"
                >
                    <div
                        ref={contentRef}
                        className={`transition-all duration-300 ${!isExpanded && shouldShowExpand ? 'line-clamp-4' : ''}`}
                    >
                        {msg.content || msg.text}
                    </div>
                </motion.div>


                {shouldShowExpand && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp size={14} />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown size={14} />
                                Read More
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Copy button on hover */}
            <button
                onClick={() => handleCopy(msg.content || msg.text, msg._id || idx)}
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer border border-white/10"
                title="Copy message"
            >
                {copiedId === (msg._id || idx) ? (
                    <Check size={14} className="text-green-400" />
                ) : (
                    <Copy size={14} className="text-white/70" />
                )}
            </button>
        </div>
    );
});

const AssistantMessageItem = memo(({ msg, isDark, setSelectedImage, handleCopy, copiedId, idx }) => {
    if (msg.isGeneratingImage && !msg.imageUrl) {
        return (
            <div className="min-w-0 transition-all duration-300 dark:bg-[#1e1e21] bg-(--bg-panel) border border-(--border-color) text-(--text-primary) px-4 py-3 sm:px-6 sm:py-4 rounded-3xl rounded-tl-sm leading-relaxed w-full shadow-sm">
                <ImageSkeleton />
            </div>
        );
    }
    return (
        <div
            className="min-w-0 transition-all duration-300 dark:bg-[#1e1e21] bg-(--bg-panel) border border-(--border-color) text-(--text-primary) px-4 py-3 sm:px-6 sm:py-4 rounded-3xl rounded-tl-sm leading-relaxed w-full shadow-sm"
        >
            <div className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words w-full overflow-hidden">
                {(msg.imageUrl || msg.image) && (
                    <div className="mb-2 max-w-[280px] sm:max-w-[300px] overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-700/50 bg-black/5 dark:bg-white/5 p-1 group relative">
                        <img
                            src={msg.imageUrl || msg.image}
                            alt="Uploaded content"
                            className="max-h-[260px] w-full rounded-lg object-cover cursor-pointer opacity-0 transition-all duration-300 ease-in hover:brightness-90"
                            onClick={() => setSelectedImage(msg.imageUrl || msg.image)}
                            onLoad={(e) => e.target.classList.replace('opacity-0', 'opacity-100')}
                        />
                    </div>
                )}
                <div className="mt-1">
                    {renderMessageContent(msg.content || msg.text, isDark)}
                </div>

                {msg.role === 'assistant' && msg.content && (
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            onClick={() => handleCopy(msg.content, msg._id || idx)}
                            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                            title="Copy response"
                        >
                            {copiedId === (msg._id || idx) ? (
                                <>
                                    <Check size={14} className="text-green-500" />
                                    <span className="text-green-500">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

const ChatMessages = ({ messages, isStreaming }) => {


    const { user, actualTheme } = useAuthStore();
    const isDark = actualTheme === 'dark';

    const [selectedImage, setSelectedImage] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    const messagesEndRef = useRef(null);
    const prevChatIdRef = useRef(null);
    const prevMessagesLength = useRef(0);
    const { currentChat } = useChatStore();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        if (messagesEndRef.current) {
            const isChatSwitch = prevChatIdRef.current !== currentChat?._id;
            const messagesJustAppeared = prevMessagesLength.current === 0 && messages.length > 0;
            if (isChatSwitch || isStreaming || messagesJustAppeared) {
                messagesEndRef.current.scrollIntoView({
                    behavior: (isChatSwitch || messagesJustAppeared) ? 'auto' : 'smooth'
                });
            }
            prevChatIdRef.current = currentChat?._id;
            prevMessagesLength.current = messages.length;
        }
        return () => window.removeEventListener('resize', handleResize);
    }, [messages, currentChat?._id, isStreaming]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownload = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `nexusai-image-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(imageUrl, '_blank');
        }
    };

    return (
        <div className={`w-full ${messages.length === 0 ? 'flex-1 flex flex-col' : ''}`}>
            <div className={`max-w-4xl mx-auto space-y-6 ${messages.length === 0 ? 'flex-1 flex flex-col justify-end items-start w-full' : ''}`}>
                {(messages.length === 0) ? (
                    <div className="flex flex-col items-start select-none pb-4">
                        <div className="text-2xl font-semibold mb-2 text-(--text-secondary)">Hi, {user?.name || user?.username || 'Guest'}</div>
                        <div className="text-3xl font-bold text-(--text-primary)">Where should we start?</div>
                    </div>

                ) : (

                    <>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg._id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 sm:gap-4 w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {msg.role === 'user' ? (
                                    <UserMessageItem
                                        msg={msg}
                                        setSelectedImage={setSelectedImage}
                                        handleCopy={handleCopy}
                                        copiedId={copiedId}
                                        idx={idx}
                                    />
                                ) : (msg.content || msg.text || msg.imageUrl || msg.image || msg.isGeneratingImage) ? (
                                    <AssistantMessageItem
                                        msg={msg}
                                        isDark={isDark}
                                        setSelectedImage={setSelectedImage}
                                        handleCopy={handleCopy}
                                        copiedId={copiedId}
                                        idx={idx}
                                    />
                                ) : null}

                            </motion.div>
                        ))}
                        {isStreaming && (
                            <div className="flex gap-3 sm:gap-4 w-full mt-2">
                                <div className="min-w-0 px-2 py-2 sm:px-4 leading-relaxed w-full flex items-center">
                                    <Spinner />
                                    <span className="ml-3 text-[15px] font-medium dark:text-gray-400 text-gray-500 animate-pulse">
                                        NexusAI is thinking...
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/30 sm:bg-black/50 backdrop-blur-md  p-0 sm:p-8"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.9 }}
                            animate={{
                                y: 0,
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-full sm:max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center gap-4 sm:gap-6 bg-(--bg-surface) sm:bg-transparent rounded-t-3xl sm:rounded-none p-6 sm:p-0 shadow-2xl sm:shadow-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile Handle */}
                            <div className="w-12 h-1.5 bg-(--border-color) rounded-full sm:hidden mb-4 shrink-0" />

                            {/* Close Button */}
                            <button
                                className="absolute top-2 right-2 sm:-top-10 sm:-right-50 p-2.5 bg-accent text-white rounded-full transition-all duration-200 cursor-pointer"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={24} />
                            </button>

                            <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                                <motion.img
                                    src={selectedImage}
                                    alt="Full size preview"
                                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain"
                                />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 shadow-xl"
                            >
                                <button
                                    onClick={() => handleDownload(selectedImage)}
                                    className="flex items-center gap-2 text-white hover:text-accent transition-colors px-4 py-1.5 cursor-pointer hover:bg-(--accent-color)/30 rounded-full"
                                    title="Download Image"
                                >
                                    <Download size={20} />
                                    <span className="text-sm font-semibold">Download</span>
                                </button>
                                <div className="w-px h-6 bg-white/20" />
                                <button
                                    onClick={() => window.open(selectedImage, '_blank')}
                                    className="flex items-center gap-2 text-white hover:text-accent transition-colors px-4 py-1.5 rounded-full cursor-pointer hover:bg-(--accent-color)/30"
                                    title="Open Original"
                                >
                                    <ExternalLink size={20} />
                                    <span className="text-sm font-semibold">Original</span>
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatMessages;
