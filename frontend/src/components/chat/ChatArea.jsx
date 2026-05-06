import { useState, useEffect } from 'react';
import ChatAreaHeader from './ChatAreaHeader';
import ChatMessages from '../chat/ChatMessages';
import ChatInputArea from './ChatInputArea';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import useMessageStore from '../../store/useMessageStore';
import { useParams, useNavigate } from 'react-router-dom';

const ChatArea = () => {

  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputText, setInputText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isImageMode, setIsImageMode] = useState(false);

  const { user } = useAuthStore();
  const { currentChat, setCurrentChat, chats, createChat, isLoading } = useChatStore();
  const { sendAndStreamMessage, generateImage, getMessagesByChat } = useMessageStore();
  const { chatId } = useParams();
  const navigate = useNavigate();


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
    const fetchMessages = async () => {
      if (chatId && !isStreaming) {
        const msgs = await getMessagesByChat(chatId);
        setMessages(msgs.map((m, idx) => ({ ...m, id: m._id || idx })));
        setIsSyncing(false);
      }
    };

    fetchMessages();
  }, [chatId, isStreaming]);

  useEffect(() => {
    if (currentChat && currentChat._id === chatId)
      document.title = `${currentChat.title || 'Chat'} - NexusAI`;
  }, [currentChat, chatId]);


  const handleSendMessage = async (e, selectedImageUrl = null) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImageUrl) return;

    let chat_id = currentChat?._id;
    const userMessage = inputText;
    setInputText("");

    if (!chat_id && user) {
      await createChat({ userId: user.id || user._id });
      const newChat = useChatStore.getState().currentChat;
      chat_id = newChat?._id;

      if (chat_id) {
        navigate(`/chat/${chat_id}`, { replace: true });
        if (user.id || user._id) {
          const { getChatsByUser } = useChatStore.getState();
          await getChatsByUser(user.id || user._id);
        }
      }
    }

    if (!chat_id) return;

    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage, imageUrl: selectedImageUrl },
      { role: 'assistant', content: "", isGeneratingImage: isImageMode }
    ]);
    setIsStreaming(true);

    const activeChat = useChatStore.getState().currentChat;

    if (activeChat) {
      setCurrentChat({
        ...activeChat,
        messages: [
          ...(activeChat.messages || []),
          { role: 'user', content: userMessage, imageUrl: selectedImageUrl },
          { role: 'assistant', content: "", isGeneratingImage: isImageMode }
        ]
      });
    }

    if (isImageMode) {
      setIsImageMode(false);
      try {
        const imageUrl = await generateImage({ chatId: chat_id, prompt: userMessage });
        if (imageUrl) {
          const assistantMsg = { role: 'assistant', content: "Generated image:", imageUrl: imageUrl };
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = assistantMsg;
            return newMsgs;
          });

          const latestChat = useChatStore.getState().currentChat;
          if (latestChat) {
            setCurrentChat({
              ...latestChat,
              messages: [...latestChat.messages, assistantMsg]
            });
          }
        } else {
          setMessages(prev => prev.slice(0, -1));
        }
      } catch {
        setMessages(prev => prev.slice(0, -1));
      } finally {
        setIsStreaming(false);
      }
      return;
    }

    await sendAndStreamMessage({
      chatId: chat_id,
      content: userMessage,
      imageUrl: selectedImageUrl,
      onStream: (text) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          const lastMessage = newMessages[lastIndex] || {};
          newMessages[lastIndex] = {
            ...lastMessage,
            content: `${lastMessage.content || ''}${text}`
          };
          return newMessages;
        });
      },
      onDone: async () => {
        setIsStreaming(false);
        const finalMsgs = await getMessagesByChat(chat_id);
        setMessages(finalMsgs.map((m, idx) => ({ ...m, id: m._id || idx })));
        if (user && (user.id || user._id)) {
          const { getChatsByUser } = useChatStore.getState();
          await getChatsByUser(user.id || user._id);
        }
      },
      onError: (fallbackMessage) => {
        setIsStreaming(false);
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          const lastMessage = newMessages[lastIndex] || {};
          newMessages[lastIndex] = {
            ...lastMessage,
            role: 'assistant',
            content: fallbackMessage,
            isGeneratingImage: false
          };
          return newMessages;
        });
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
        isImageMode={isImageMode}
        setIsImageMode={setIsImageMode}
      />

    </div>
  );
}

export default ChatArea;
