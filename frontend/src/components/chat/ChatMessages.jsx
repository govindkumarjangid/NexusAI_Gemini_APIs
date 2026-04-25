import { useEffect, useRef, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import Spinner from '../model/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { renderMessageContent } from '../../configs/renderMessageContent';
import { X, Download, ExternalLink, Copy, Check } from 'lucide-react';

const ChatMessages = ({ messages, isStreaming }) => {

    const { user, actualTheme } = useAuthStore();
    const { currentChat } = useChatStore();
    const isDark = actualTheme === 'dark';

    const [selectedImage, setSelectedImage] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);

        if (messagesEndRef.current)
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });

        return () => window.removeEventListener('resize', handleResize);
    }, [messages]);

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
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 w-full">
            <div className="max-w-xl md:max-w-4xl mx-auto space-y-6 h-full">
                {(!currentChat || messages.length === 0) ? (
                    <div className="flex flex-col items-strat justify-end-safe h-full dark:text-gray-400 text-gray-500 select-none px-4">
                        <div className="text-2xl font-semibold mb-2">Hi, {user?.name || user?.username || 'Govind'}</div>
                        <div className="text-3xl">Where should we start?</div>
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
                                {/* Message Content */}
                                <div
                                    className={`min-w-0 ${msg.role === 'user'
                                        ? 'bg-accent text-accent-contrast rounded-3xl rounded-tr-sm px-4 py-1 sm:px-5 shadow-xl max-w-[95%] sm:max-w-[85%] md:max-w-[70%] w-fit'
                                        : 'dark:text-gray-200 text-gray-800 px-1 py-2 sm:px-4 sm:py-3 leading-relaxed w-full'
                                        }`}
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
                        className="fixed inset-0 z-999 flex items-end sm:items-center justify-center backdrop-blur-md p-0 sm:p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ 
                                y: 0, 
                                scale: 1,
                                opacity: 1,
                                transition: isMobile 
                                    ? { type: "spring", damping: 28, stiffness: 260 }
                                    : { type: "spring", damping: 22, stiffness: 280 }
                            }}
                            exit={isMobile 
                                ? { y: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } } 
                                : { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
                            }
                            className="bg-(--bg-surface) border-t sm:border border-(--border-color) rounded-t-3xl sm:rounded-2xl p-4 sm:p-10 flex flex-col items-center gap-4 sm:gap-6 shadow-2xl max-w-4xl w-full mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile Handle */}
                            <div className="w-12 h-1.5 bg-(--border-color) rounded-full sm:hidden mb-2" />

                            <button
                                className="absolute top-4 right-4 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full transition-colors z-1000 cursor-pointer sm:flex hidden"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={20} />
                            </button>

                            <div className="relative group max-w-full max-h-[60vh] sm:max-h-[75vh] flex flex-col items-center gap-4">
                                <motion.img
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    src={selectedImage}
                                    alt="Full size preview"
                                    className="max-w-full max-h-full rounded-xl sm:rounded-2xl shadow-xl object-contain border border-(--border-color)"
                                />
                                
                                <motion.div 
                                    className="flex items-center gap-3 bg-(--bg-elevated) backdrop-blur-md px-5 py-2.5 rounded-full border border-(--border-color) shadow-lg"
                                >
                                    <button
                                        onClick={() => handleDownload(selectedImage)}
                                        className="flex items-center gap-2 text-(--text-primary) hover:text-accent transition-colors px-3 py-1 rounded-lg cursor-pointer"
                                        title="Download Image"
                                    >
                                        <Download size={18} />
                                        <span className="text-sm font-medium">Download</span>
                                    </button>
                                    <div className="w-px h-5 bg-(--border-color)" />
                                    <button
                                        onClick={() => window.open(selectedImage, '_blank')}
                                        className="flex items-center gap-2 text-(--text-primary) hover:text-accent transition-colors px-3 py-1 rounded-lg cursor-pointer"
                                        title="Open Original"
                                    >
                                        <ExternalLink size={18} />
                                        <span className="text-sm font-medium">Live Link</span>
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatMessages;
