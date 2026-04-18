import { MessageSquare, Edit2, Trash2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore.js';

const ChatList = ({ chats, currentChat, setCurrentChat, navigate, deleteChat, getChatsByUser }) => {

  const { user } = useAuthStore();

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    deleteChat(chatId);
    if (user?.id) getChatsByUser(user.id);
  }
  return (
    <div className="space-y-1">
      {chats && chats.length > 0 ? (
        chats.map((chat) => {
          const isActive = currentChat && currentChat._id === chat._id;
          // Get first user message as title
          let userMsg = '';
          if (chat.messages && Array.isArray(chat.messages)) {
            const found = chat.messages.find(m => m.role === 'user' && m.content);
            userMsg = found ? found.content.slice(0, 60) : 'Untitled Chat';
          } else {
            userMsg = 'Untitled Chat';
          }
          return (
            <div
              key={chat._id}
              title={userMsg}
              className={`group flex items-center justify-between rounded-full cursor-pointer transition-colors px-4 py-2 ${isActive ? 'bg-[#131314] text-gray-400' : 'hover:bg-[#2d2f31] text-gray-300 hover:text-gray-100'}`}
              onClick={() => {
                setCurrentChat(chat);
                navigate(`/chat/${chat._id}`);
              }}
            >
              <div className="flex items-center gap-3 overflow-hidden text-sm">
                <MessageSquare size={18} className="shrink-0" />
                <span className="truncate">{userMsg}</span>
              </div>
              <div className={`flex items-center space-x-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}> 
                <button className="p-1 hover:text-blue-400 text-gray-400 transition-colors cursor-pointer">
                  <Edit2 size={14} />
                </button>
                <button
                  className="p-1 hover:text-red-400 text-gray-400 transition-colors cursor-pointer"
                  onClick={e => handleDeleteChat(e, chat._id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 px-2 py-4 text-center">No chats found.</div>
      )}
    </div>
  );
};

export default ChatList;
