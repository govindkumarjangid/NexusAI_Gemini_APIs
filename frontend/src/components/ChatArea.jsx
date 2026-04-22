import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Mic, Sparkles, User, Plus, ArrowUp, FolderUp, SquareChevronRight, Check } from 'lucide-react';
import ChatAreaHeader from './ChatAreaHeader';
import ChatMessages from './ChatMessages';
import ChatInputArea from './ChatInputArea';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import useMessageStore from '../store/useMessageStore';
import { useParams } from 'react-router-dom';

const ChatArea = () => {

  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputText, setInputText] = useState("");

  const { isMobile, sidebarOpen, setSidebarOpen, user } = useAuthStore();
  const { currentChat, setCurrentChat, chats, createChat } = useChatStore();
  const { sendAndStreamMessage } = useMessageStore();
  const { chatId } = useParams();


  useEffect(() => {
    if (chatId && chats && chats.length > 0) {
      const found = chats.find(c => c._id === chatId);
      if (found) setCurrentChat(found);
    }
  }, [chatId, chats]);

  useEffect(() => {
    if (currentChat && currentChat.messages) {
      setMessages(currentChat.messages.map((msg, idx) => ({
        ...msg,
        id: msg._id || idx
      })));
      document.title = `${currentChat.messages?.currentChat || 'Chat'} - NexusAI`;
    } else {
      setMessages([]);
    }
  }, [currentChat]);



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let chat_id = currentChat?._id;
    let chatJustCreated = false;
    const userMessage = inputText;
    setInputText("");

    if (!chat_id && user) {
      await createChat({ userId: user.id || user._id });
      chat_id = useChatStore.getState().currentChat?._id;
      if (user.id || user._id) {
        const { getChatsByUser } = useChatStore.getState();
        await getChatsByUser(user.id || user._id);
      }
      chatJustCreated = true;
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessages(prev => [...prev, { role: 'assistant', content: "" }]);
    setIsStreaming(true);

    if (currentChat) {
      setCurrentChat({
        ...currentChat,
        messages: [
          ...(currentChat.messages || []),
          { role: 'user', content: userMessage },
          { role: 'assistant', content: "" }
        ]
      });
    }

    await sendAndStreamMessage({
      chatId: chat_id,
      content: userMessage,
      onStream: (text) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex].content += text;
          return newMessages;
        });
      },
      onDone: async () => {
        setIsStreaming(false);
        if (user && (user.id || user._id)) {
          const { getChatsByUser } = useChatStore.getState();
          await getChatsByUser(user.id || user._id);
        }
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col h-dvh w-full max-w-[100vw] overflow-x-hidden" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* Top Navbar */}
      <ChatAreaHeader />

      {/* Chat Messages */}
      <ChatMessages messages={messages} isStreaming={isStreaming} />


      {/* Input Area */}
      <ChatInputArea
        inputText={inputText}
        setInputText={setInputText}
        isStreaming={isStreaming}
        handleSendMessage={handleSendMessage}
      />

    </div>
  );
}

export default ChatArea;