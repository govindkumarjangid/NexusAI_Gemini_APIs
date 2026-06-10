import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import Spinner from '../model/Spinner';
import UserMessageItem from './UserMessageItem';
import AssistantMessageItem from './AssistantMessageItem';
import ImagePreviewModal from './ImagePreviewModal';

const ChatMessages = ({ messages, isStreaming }) => {
    const { user, actualTheme, isMobile } = useAuthStore();
    const isDark = actualTheme === 'dark';

    const [selectedImage, setSelectedImage] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const messagesEndRef = useRef(null);
    const prevChatIdRef = useRef(null);
    const prevMessagesLength = useRef(0);
    const scrollTimeoutRef = useRef(null);
    const lastStreamingScrollRef = useRef(0);
    const { currentChat } = useChatStore();

    useEffect(() => {
        if (messagesEndRef.current) {
            const isChatSwitch = prevChatIdRef.current !== currentChat?._id;
            const messagesJustAppeared = prevMessagesLength.current === 0 && messages.length > 0;
            const shouldScroll = isChatSwitch || isStreaming || messagesJustAppeared;

            if (shouldScroll) {
                const scrollToBottom = (behavior) => {
                    if (messagesEndRef.current)
                        messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
                };

                if (isChatSwitch || messagesJustAppeared) {
                    scrollToBottom('auto');
                } else {
                    const now = Date.now();
                    const throttleDelay = 120;
                    const elapsed = now - lastStreamingScrollRef.current;

                    if (elapsed >= throttleDelay) {
                        lastStreamingScrollRef.current = now;
                        scrollToBottom('auto');
                    } else {
                        clearTimeout(scrollTimeoutRef.current);
                        scrollTimeoutRef.current = setTimeout(() => {
                            lastStreamingScrollRef.current = Date.now();
                            scrollToBottom('auto');
                        }, throttleDelay - elapsed);
                    }
                }
            }
            prevChatIdRef.current = currentChat?._id;
            prevMessagesLength.current = messages.length;
        }
        return () => {
            clearTimeout(scrollTimeoutRef.current);
        };
    }, [messages, currentChat?._id, isStreaming]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`w-full ${messages.length === 0 ? 'flex-1 flex flex-col' : ''}`}
        >
            <div className={`max-w-4xl mx-auto space-y-6 ${messages.length === 0 ? 'flex-1 flex flex-col justify-end items-start w-full' : ''}`}>
                {(messages.length === 0) ? (
                    <div className="flex flex-col items-start select-none">
                        <div className="text-2xl font-semibold mb-2 text-(--text-secondary)">Hi, {user?.name || user?.username || 'Guest'}</div>
                        <div className="text-3xl font-bold text-(--text-primary)">Where should we start?</div>
                    </div>

                ) : (

                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={msg._id || idx}
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

                            </div>
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

            <ImagePreviewModal
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                isMobile={isMobile}
            />


        </motion.div>
    );
};

export default ChatMessages;
