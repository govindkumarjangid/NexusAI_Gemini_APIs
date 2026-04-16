// add chat create, fetch user chats, add message to chat and delete chat functionality
import axiosInstance from '../configs/axiosInstance.js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const useChatStore = create((set) => ({
    chats: [],
    currentChat: null,
    isLoading: false,
    error: null,

    createChat: async ({ userId, navigate }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/chats/create', { userId });
            set({ isLoading: false });
            if (response.data.success) {
                navigate(`/chat/${response.data.chat._id}`);
                toast.success('Chat created successfully');
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
            const response = await axiosInstance.get(`/chats/user/${userId}`);
            const { chats } = response.data;
            set({ chats, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Failed to fetch chats' });
            toast.error(error.response?.data?.message || 'Failed to fetch chats');
        }
    },

    addMessageToChat: async ({ chatId, message }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post(`/chats/${chatId}/message`, { message });
            set({ isLoading: false });
            if (!response.data.success) {
                set({ error: response.data.message || 'Failed to add message' });
                toast.error(response.data.message || 'Failed to add message');
            }
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Failed to add message' });
            toast.error(error.response?.data?.message || 'Failed to add message');
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

}), {
    name: 'chat-storage',
    getStorage: () => localStorage,
}
);

export default useChatStore;