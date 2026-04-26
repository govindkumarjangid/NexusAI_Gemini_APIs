import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useChatStore from '../store/useChatStore';
import ChatMessages from '../components/chat/ChatMessages';
import { Globe, MessageSquare, ArrowRight, Code2 } from 'lucide-react';
import Spinner from '../components/model/Spinner';
import { motion } from 'framer-motion';

const SharedChatPage = () => {
    const { shareId } = useParams();
    const { getSharedChat } = useChatStore();
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChat = async () => {
            setLoading(true);
            try {
                const data = await getSharedChat(shareId);
                if (data) {
                    setChat(data);
                } else {
                    setError('Chat not found or no longer shared.');
                }
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
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 bg-(--accent-color) text-white rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg shadow-(--accent-color)/20"
                >
                    Go to Homepage
                    <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-(--bg-surface) overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40"
                style={{ backgroundImage: `radial-gradient(circle at 2px 2px, var(--border-color) 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-(--accent-color)/5 to-transparent pointer-events-none z-0" />

            {/* Header */}
            <header className="h-16 shrink-0 w-full flex items-center justify-between px-4 sm:px-8 border-b border-(--border-color) bg-(--bg-surface)/10 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-(--accent-color) flex items-center justify-center text-white shadow-lg shadow-(--accent-color)/30 transform transition-transform hover:rotate-3">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-(--text-primary) leading-tight tracking-tight">NexusAI</h1>
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
                        className="origin-left inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold border transition-all duration-300 backdrop-blur-sm group text-(--accent-text-color) border-(--border-color) bg-(--accent-color)/30  animated-accent-btn text-sm active:scale-99"
                    >
                        Try NexusAI
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-hidden relative flex flex-col z-10">
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="max-w-5xl mx-auto py-12">
                        <div className="px-6 mb-16 relative">
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
                                className="text-4xl sm:text-5xl font-black text-(--text-primary) mb-5 leading-tight tracking-tight"
                            >
                                {chat.title || 'Untitled Conversation'}
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-4 text-(--text-secondary)"
                            >
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="w-8 h-8 rounded-full bg-(--bg-accent) border border-(--border-color) flex items-center justify-center">
                                        <Code2 size={16} className="text-(--accent-color)" />
                                    </div>
                                    <span>NexusAI Assistant</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-(--border-color)" />
                                <span className="text-sm font-medium">
                                    {new Date(chat.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </motion.div>
                        </div>

                        <div className="bg-(--bg-surface)/40 backdrop-blur-sm rounded-3xl border border-(--border-color) shadow-sm mx-4 sm:mx-6 overflow-hidden">
                            <ChatMessages messages={chat.messages} isStreaming={false} />
                        </div>
                    </div>
                </div>

                {/* Footer Banner */}
                <div className="p-5 bg-(--bg-surface)/80 border-t border-(--border-color) backdrop-blur-2xl">
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-(--accent-color) flex items-center justify-center text-white shadow-lg">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-(--text-primary)">Enjoying this conversation?</p>
                                <p className="text-xs text-(--text-secondary)">Start your own private AI chat session today.</p>
                            </div>
                        </div>
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-3 origin-left rounded-xl font-semibold border transition-all duration-300 backdrop-blur-sm group text-(--accent-text-color) border-(--border-color) bg-(--accent-color)/30  animated-accent-btn text-sm active:scale-99"
                        >
                            Create Your Free Account
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SharedChatPage;
