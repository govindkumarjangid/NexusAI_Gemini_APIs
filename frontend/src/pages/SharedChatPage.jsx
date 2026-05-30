import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, MessageSquare, ArrowRight, Code2, MessageCircle } from 'lucide-react';

import Logo from '../components/common/Logo'
import useChatStore from '../store/useChatStore';
import Spinner from '../components/model/Spinner';
import ChatMessages from '../components/chat/ChatMessages';

const SharedChatPage = () => {
    const [chat, setChat] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { shareId } = useParams();
    const { getSharedChat } = useChatStore();

    useEffect(() => {
        const fetchChat = async () => {
            setLoading(true);
            try {
                const data = await getSharedChat(shareId);
                if (data) setChat(data);
                else setError('Chat not found or no longer shared.');
            } catch (err) {
                setError('Failed to load shared chat.');
            } finally {
                setLoading(false);
            }
        };
        if (shareId) fetchChat();
    }, [shareId, getSharedChat]);

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-(--bg-surface) gap-4">
                <Spinner size={40} />
                <p className="text-(--text-secondary) animate-pulse font-medium">Fetching shared conversation...</p>
            </div>
        );
    }

    if (error || !chat) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-(--bg-surface) p-6 text-center">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-6">
                    <Globe size={48} />
                </div>
                <h1 className="text-2xl font-bold text-(--text-primary) mb-2">Link Expired or Invalid</h1>
                <p className="text-(--text-secondary) max-w-md mb-8">
                    {error || "The shared link you're trying to access is no longer available or the owner has disabled public access."}
                </p>
                <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-(--accent-color) text-white rounded-full text-sm sm:text-base font-semibold hover:brightness-110 transition-all shadow-lg shadow-(--accent-color)/20 group active:scale-99"
                >
                    Go to NexusAI
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
        );
    }
    // console.log(chat);

    return (
        <div className="h-screen flex flex-col bg-(--bg-surface) overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40"
                style={{ backgroundImage: `radial-gradient(circle at 2px 2px, var(--border-color) 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-(--accent-color)/5 to-transparent pointer-events-none z-0" />

            {/* Header */}
            <header className="h-16 shrink-0 w-full flex items-center justify-between px-4 sm:px-8 border-b border-(--border-color) bg-(--bg-surface)/10 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-(--accent-color)/10 flex items-center justify-center text-(--accent-color) shadow-lg shadow-(--accent-color)/30 transform transition-transform hover:rotate-3">
                        <Logo size={38} />
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-(--text-primary) via-(--text-primary) to-(--accent-color)">
                            NexusAI
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-(--text-secondary) opacity-80">Shared Session</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-(--text-primary) hover:bg-(--bg-accent) rounded-xl transition-all duration-300 active:scale-95"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="flex items-center gap-2 px-4 py-2 bg-(--accent-color) text-white rounded-full sm:text-sm text-xs font-medium hover:brightness-110 transition-all shadow-lg shadow-(--accent-color)/20 group active:scale-99"
                    >
                        Try NexusAI
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto scroll-smooth relative flex flex-col z-10">
                <div className="flex-1">
                    <div className="max-w-5xl mx-auto py-8 sm:py-12">
                        <div className="px-4 sm:px-8 mb-8 sm:mb-16 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-(--accent-color)/10 text-(--accent-color) text-[11px] font-black uppercase tracking-widest mb-6 border border-(--accent-color)/20"
                            >
                                <Globe size={14} />
                                Public Access
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, type: "spring", damping: 20 }}
                                className="text-3xl sm:text-5xl font-black text-(--text-primary) mb-5 leading-tight tracking-tight"
                            >
                                {chat.title || 'Untitled Conversation'}
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-center gap-3 sm:gap-4 text-(--text-secondary)"
                            >
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="w-8 h-8 rounded-full bg-(--bg-accent) border border-(--border-color) flex items-center justify-center">
                                        <Code2 size={16} className="text-(--accent-color)" />
                                    </div>
                                    <span>NexusAI Assistant</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-(--border-color)" />
                                <span className="text-xs sm:text-sm font-medium opacity-70">
                                    {new Date(chat.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </motion.div>
                        </div>

                        <div className="mx-0 sm:mx-6 overflow-hidden">
                            <ChatMessages messages={chat.messages} isStreaming={false} />
                        </div>
                    </div>
                </div>

                {/* Footer Banner */}
                <div className="p-4 sm:p-6 bg-(--bg-surface)/80 border-t border-(--border-color) backdrop-blur-2xl mt-auto">
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-(--accent-color)/15 flex items-center justify-center shadow-lg shrink-0 text-(--accent-color)">
                                <Logo size={38} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-(--text-primary)">Enjoying this conversation?</p>
                                <p className="text-[11px] sm:text-xs text-(--text-secondary)">Start your own private AI chat session today.</p>
                            </div>
                        </div>
                        <Link
                            to="/register"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-(--accent-color) text-white rounded-full text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-(--accent-color)/20 group active:scale-99"
                        >
                            Create Your Free Account
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SharedChatPage;
