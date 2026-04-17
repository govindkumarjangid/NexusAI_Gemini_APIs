import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Mic, Sparkles, User, Plus, ArrowUp, FolderUp, SquareChevronRight } from 'lucide-react';
import logo from '/nexusai-logo.svg';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import useMessageStore from '../store/useMessageStore';
import { useParams } from 'react-router-dom';

const ChatArea = () => {

  const [messages, setMessages] = useState([]);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const { isMobile, sidebarOpen, setSidebarOpen, user } = useAuthStore();
  const { currentChat, setCurrentChat, chats, createChat } = useChatStore();
  const { sendAndStreamMessage } = useMessageStore();
  const { chatId } = useParams();

  const textareaRef = useRef(null);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load chat by URL param
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
    } else {
      setMessages([]);
    }
  }, [currentChat]);


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsAddMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  // Unified send message handler (always uses sendMessage)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let chat_id = currentChat?._id;
    let chatJustCreated = false;
    const userMessage = inputText;
    setInputText("");

    // If no chat exists, create one first
    if (!chat_id && user) {
      await createChat({ userId: user.id || user._id });
      chat_id = useChatStore.getState().currentChat?._id;
      // Refresh chat list in sidebar
      if (user.id || user._id) {
        const { getChatsByUser } = useChatStore.getState();
        await getChatsByUser(user.id || user._id);
      }
      chatJustCreated = true;
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessages(prev => [...prev, { role: 'assistant', content: "" }]);
    setIsStreaming(true);

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
      onDone: () => setIsStreaming(false)
    });
  };


  return (
    <div className="flex-1 flex flex-col h-screen bg-[#131314]">

      {/* Top Navbar */}
      <header className="h-14 flex items-center justify-between px-3 sm:px-4 border-b border-gray-700/40 sticky top-0 z-20 bg-[#131314]">
        <div className="flex items-center gap-3">
          {isMobile && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-0 sm:p-2 hover:text-gray-200 rounded-full text-gray-400 transition-colors cursor-pointer"
            >
              <SquareChevronRight size={22} />
            </button>
          )}
          <img src={logo} alt="NexusAI Logo" className="w-8 h-8 rounded-full shadow-lg" />
          <h1 className="font-semibold text-lg text-gray-200">NexusAI</h1>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg uppercase">
              {user.name?.[0] || '?'}
            </div>
            <span className="text-gray-200 hidden sm:flex font-normal text-base max-w-30 truncate">{user.name || 'User'}</span>
          </div>
        )}
      </header>


      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {(!currentChat || messages.length === 0) ? (
            <div className="flex flex-col items-start justify-end h-80 text-center text-gray-400 select-none">
              <div className="text-2xl font-semibold mb-2">Hi {user?.name || user?.username || 'Govind kumar'}</div>
              <div className="text-3xl">Where should we start?</div>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 sm:w-10 sm:h-10 ${msg.role === 'user'
                    ? 'bg-gray-800 text-gray-300 hidden sm:flex'
                    : 'bg-linear-to-br from-blue-500 to-purple-600 text-white'
                    }`}
                >
                  {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[90%] sm:max-w-[80%] ${msg.role === 'user'
                    ? 'bg-[#2d2f31] text-gray-100 rounded-3xl rounded-tr-sm px-5 py-3.5 shadow-sm'
                    : 'text-gray-200 px-2 py-2 sm:px-4 sm:py-3 leading-relaxed'
                    }`}
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                >
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words">
                    {msg.content || msg.text}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-linear-to-t from-[#131314] to-transparent pt-0">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="flex flex-col bg-[#1e1f20] border border-gray-700/60 rounded-3xl px-2 py-2 shadow-sm focus-within:border-gray-600 transition-all"
          >
            <textarea
              ref={textareaRef}
              rows="1"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="Ask NexusAI anything..."
              className="w-full max-h-62.5 min-h-12.5 bg-transparent text-gray-100 placeholder-gray-500 px-4 py-3 focus:outline-none resize-none overflow-y-auto custom-scrollbar"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />

            <div className="flex items-center justify-between mt-1 px-2 pb-1 relative">
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                  className={`p-2 rounded-full transition-colors ${isAddMenuOpen ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 text-gray-400'
                    }`}
                >
                  <Plus size={22} className={`transition-transform duration-200 active:scale-95 cursor-pointer ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                </button>

                <AnimatePresence>
                  {isAddMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 100, scale: 0 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 100, scale: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 mb-3 w-48 bg-[#2d2f31] border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden z-50 p-2 text-sm font-semibold"
                    >
                      <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left rounded-xl cursor-pointer">
                        <Image size={18} className="text-gray-400" />
                        <span>Upload Image</span>
                      </button>
                      <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left rounded-xl cursor-pointer">
                        <FolderUp size={18} className="text-gray-400" />
                        <span>Upload File</span>
                      </button>
                      <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left border-t border-gray-700/50 mt-1 pt-3 rounded-xl cursor-pointer">
                        <Mic size={18} className="text-gray-400" />
                        <span>Voice Input</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-[#2563eb] hover:bg-blue-500 disabled:bg-[#2d2f31] disabled:text-gray-500 text-white rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <ArrowUp size={20} />
                </button>
              </div>
            </div>
          </form>

          <p className="text-center text-xs text-gray-500 mt-3 hidden sm:block">
            NexusAI may produce inaccurate information about people, places, or facts.
          </p>
        </div>

      </div>
    </div>
  );
}

export default ChatArea;