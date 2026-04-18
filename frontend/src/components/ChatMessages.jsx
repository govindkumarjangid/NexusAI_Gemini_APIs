import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { renderMessageContent } from '../configs/renderMessageContent.jsx';
import useChatStore from '../store/useChatStore.js';
import useAuthStore from '../store/useAuthStore.js';

const ChatMessages = ({ messages }) => {

    const { user } = useAuthStore();
    const { currentChat } = useChatStore();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current)
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 w-full">
            <div className="max-w-xl md:max-w-4xl mx-auto space-y-6 h-full">
                {(!currentChat || messages.length === 0) ? (
                    <div className="flex flex-col items-strat justify-end-safe h-full text-gray-400 select-none px-4">
                        <div className="text-2xl font-semibold mb-2">Hi, {user?.name || user?.username || 'Govind'}</div>
                        <div className="text-3xl">Where should we start?</div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 sm:gap-4 w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Message Content */}
                            <div
                                className={`min-w-0 ${msg.role === 'user'
                                    ? 'bg-[#2d2f31] text-gray-100 rounded-3xl rounded-tr-sm px-4 py-2 sm:px-5 sm:py-2 shadow-xl max-w-[95%] sm:max-w-[85%] md:max-w-[70%] w-fit'
                                    : 'text-gray-200 px-1 py-2 sm:px-4 sm:py-3 leading-relaxed w-full'
                                    }`}
                            >
                                <div className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words w-full overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                    {renderMessageContent(msg.content || msg.text)}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatMessages;
