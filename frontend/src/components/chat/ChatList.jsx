import { memo } from 'react';
import { Edit2, Trash2, MessageCircle, Pin } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore.js';
import useChatStore from '../../store/useChatStore.js';

const ChatList = memo(({ chats, currentChat, setCurrentChat, navigate, deleteChat, getChatsByUser }) => {

  const { user } = useAuthStore();
  const { togglePinChat, setShowEditModal, setChatToEdit, setShowDeleteModal, setChatToDelete } = useChatStore();

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    const chat = chats.find(c => c._id === chatId);
    if (chat) {
      setChatToDelete(chat);
      setShowDeleteModal(true);
    }
  }


  const handleTogglePin = async (e, chatId) => {
    e.stopPropagation();
    await togglePinChat(chatId);
  }

  const handleEditClick = (e, chat) => {
    e.stopPropagation();
    setChatToEdit(chat);
    setShowEditModal(true);
  }

  return (
    <div className="space-y-1">
      {chats && chats.length > 0 ? (
        chats.map((chat) => {
          const isActive = currentChat && currentChat._id === chat._id;
          let chatDisplayName = chat.title;
          if (!chatDisplayName || chatDisplayName === 'New Chat') {
            if (chat.messages && Array.isArray(chat.messages)) {
              const firstMsg = chat.messages.find(m => m && typeof m === 'object');
              if (firstMsg) {
                const content = firstMsg.content || firstMsg.prompt || '';
                chatDisplayName = content.length > 60 ? content.slice(0, 60) + '...' : content;
              }
            }
          }
          if (!chatDisplayName || chatDisplayName === 'New Chat') chatDisplayName = 'New Chat';
          return (
            <div
              key={chat._id}
              title={chatDisplayName}
              className={`group flex items-center justify-between rounded-full cursor-pointer transition-colors px-4 py-2 select-none ${isActive ? 'dark:bg-[#131314] bg-gray-200 dark:text-gray-400 text-gray-500' : 'dark:hover:bg-[#2d2f31] hover:bg-gray-200 dark:text-gray-300 text-gray-600 dark:hover:text-gray-100 hover:text-gray-900'}`}
              onClick={() => {
                requestAnimationFrame(() => {
                  setCurrentChat(chat);
                  navigate(`/chat/${chat._id}`);
                });
              }}
            >
              <div className="flex items-center gap-3 overflow-hidden text-sm">
                <MessageCircle size={18} className="shrink-0" />
                <span className="truncate">{chatDisplayName}</span>
                {chat.isPinned && <Pin size={12} className="shrink-0 text-(--accent-color) fill-(--accent-color)" />}
              </div>

              <div className={`flex items-center space-x-0.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button
                  onClick={e => handleTogglePin(e, chat._id)}
                  className={`p-1 hover:text-(--accent-color) transition-colors cursor-pointer ${chat.isPinned ? 'text-(--accent-color)' : 'dark:text-gray-400 text-gray-500'}`}
                  title={chat.isPinned ? 'Unpin' : 'Pin'}
                >
                  <Pin size={14} className={chat.isPinned ? 'fill-(--accent-color)' : ''} />
                </button>

                <button
                  onClick={e => handleEditClick(e, chat)}
                  className="p-1 hover:text-blue-400 dark:text-gray-400 text-gray-500 transition-colors cursor-pointer"
                  title="Rename"
                >
                  <Edit2 size={14} />
                </button>

                <button
                  className="p-1 hover:text-red-400 dark:text-gray-400 text-gray-500 transition-colors cursor-pointer"
                  onClick={e => handleDeleteChat(e, chat._id)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          );
        })
      ) : (
        <div className="dark:text-gray-500 text-gray-400 px-2 py-4 text-center">No chats found.</div>
      )}
    </div>
  );
});

export default ChatList;