import axiosInstance from '../configs/axiosInstance.js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const useChatStore = create((set) => ({
    chats: [],
    error: null,
    isLoading: false,
    currentChat: null,
    setCurrentChat: (chat) => set({ currentChat: chat }),

    createChat: async ({ userId, navigate, firstMessage }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/chats/create', { userId });
            set({ isLoading: false });
            if (response.data.success) {
                const chat = response.data.chat;
                set({ currentChat: chat });
                if (navigate) navigate(`/chat/${chat._id}`);
                toast.success('Chat created successfully');
                if (firstMessage) {
                    const useMessageStore = (await import('./useMessageStore.js')).default;
                    await useMessageStore.getState().sendMessage({ chatId: chat._id, ...firstMessage });
                    await useChatStore.getState().getChatsByUser(userId);
                }
            } else {
                set({ error: response.data.message || 'Chat creation failed' });
                toast.error(response.data.message || 'Chat creation failed');
            }
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Chat creation failed' });
            toast.error(error.response?.data?.message || 'Chat creation failed');
        }
    },

    getChatsByUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/chats/user-chats/${userId}`);
            const { chats } = response.data;
            set({ chats, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Failed to fetch chats' });
            console.log("Error : ", error);
            toast.error(error.response?.data?.message || 'Failed to fetch chats');
        }
    },

    deleteChat: async (chatId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.delete(`/chats/${chatId}`);
            set({ isLoading: false });

            if (response.data.success) {
                set((state) => ({
                    chats: state.chats.filter((chat) => chat._id !== chatId),
                    currentChat: state.currentChat?._id === chatId ? null : state.currentChat
                }));
                toast.success('Chat deleted successfully');
            } else {
                set({ error: response.data.message || 'Failed to delete chat' });
                toast.error(response.data.message || 'Failed to delete chat');
            }
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Failed to delete chat' });
            toast.error(error.response?.data?.message || 'Failed to delete chat');
        }

    },

    shareChat: async (chatId, isShared) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post(`/chats/share/${chatId}`, { isShared });
            set({ isLoading: false });
            if (response.data.success) {
                const updatedChat = response.data.chat;
                set((state) => ({
                    currentChat: state.currentChat?._id === chatId ? updatedChat : state.currentChat,
                    chats: state.chats.map(c => c._id === chatId ? updatedChat : c)
                }));
                toast.success(isShared ? 'Chat link generated!' : 'Public access disabled');
                return updatedChat;
            }
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Failed to share chat' });
            toast.error(error.response?.data?.message || 'Failed to share chat');
        }
    },

    getSharedChat: async (shareId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/chats/shared/${shareId}`);
            set({ isLoading: false });
            if (response.data.success) {
                return response.data.chat;
            }
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Failed to fetch shared chat' });
            toast.error(error.response?.data?.message || 'Failed to fetch shared chat');
        }
    },

}), {
    name: 'chat-storage',
    getStorage: () => localStorage,
}
);

export default useChatStore;