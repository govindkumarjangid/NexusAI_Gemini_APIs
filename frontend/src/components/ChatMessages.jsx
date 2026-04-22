import { useEffect, useRef } from 'react';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import Spinner from './Spinner';
import { motion } from 'framer-motion';
import { renderMessageContent } from '../configs/renderMessageContent';

const ChatMessages = ({ messages, isStreaming }) => {

    const { user, actualTheme } = useAuthStore();
    const { currentChat } = useChatStore();
    const isDark = actualTheme === 'dark';

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current)
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
                                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words w-full overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                        {renderMessageContent(msg.content || msg.text, isDark)}
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
        </div>
    );
};

export default ChatMessages;
