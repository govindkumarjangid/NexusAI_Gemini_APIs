import { useState, useEffect } from 'react';
import ChatAreaHeader from './ChatAreaHeader';
import ChatMessages from '../chat/ChatMessages';
import ChatInputArea from './ChatInputArea';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import useMessageStore from '../../store/useMessageStore';
import { useParams } from 'react-router-dom';

const ChatArea = () => {

  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputText, setInputText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const { user } = useAuthStore();
  const { currentChat, setCurrentChat, chats, createChat, isLoading } = useChatStore();
  const { sendAndStreamMessage } = useMessageStore();
  const { chatId } = useParams();


  useEffect(() => {
    if (chatId && chats && chats.length > 0) {
      const found = chats.find(c => c._id === chatId);
      if (found) setCurrentChat(found);
    }
  }, [chatId, chats]);

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (chatId) {
      setIsSyncing(true);
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    if (currentChat && currentChat._id === chatId && isSyncing) {
      // Ensure the spinner stays visible long enough to be seen and allows UI thread to breathe
      const timer = setTimeout(() => {
        if (currentChat.messages) {
          const mappedMessages = currentChat.messages.map((msg, idx) => {
            const msgData = typeof msg.toObject === 'function' ? msg.toObject() : msg;
            return {
              ...msgData,
              id: msgData._id || idx
            };
          });
          setMessages(mappedMessages);
          document.title = `${currentChat.title || 'Chat'} - NexusAI`;
        }
        setIsSyncing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentChat, chatId, isSyncing]);



  const handleSendMessage = async (e, selectedImageUrl = null) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImageUrl) return;

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

    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage, imageUrl: selectedImageUrl },
      { role: 'assistant', content: "" }
    ]);
    setIsStreaming(true);

    if (currentChat) {
      setCurrentChat({
        ...currentChat,
        messages: [
          ...(currentChat.messages || []),
          { role: 'user', content: userMessage, imageUrl: selectedImageUrl },
          { role: 'assistant', content: "" }
        ]
      });
    }

    await sendAndStreamMessage({
      chatId: chat_id,
      content: userMessage,
      imageUrl: selectedImageUrl,
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

  const isTransitioning = chatId && currentChat?._id !== chatId;
  const showLoader = isLoading || isSyncing || isTransitioning;

  return (
    <div className="flex-1 flex flex-col h-dvh w-full max-w-[100vw] overflow-x-hidden bg-(--bg-base) text-(--text-primary)">

      {/* Top Navbar */}
      <ChatAreaHeader />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 flex flex-col relative">
        {showLoader ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-(--bg-base) z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-muted animate-pulse">Syncing conversation...</p>
            </div>
          </div>
        ) : null}
        <ChatMessages messages={messages} isStreaming={isStreaming} />
      </div>



      {/* Input Area */}
      <ChatInputArea
        inputText={inputText}
        setInputText={setInputText}
        isStreaming={isStreaming}
        handleSendMessage={handleSendMessage}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
      />

    </div>
  );
}

export default ChatArea;