import axiosInstance from '../configs/axiosInstance.js';
import { create } from 'zustand';
import { toast } from 'react-hot-toast';

const useMessageStore = create((set) => ({
  isLoading: false,
  error: null,

  sendMessage: async ({ chatId, role, content }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/chats/${chatId}/message`, { role, content });
      set({ isLoading: false });
      if (!response.data.success) {
        set({ error: response.data.message || 'Failed to send message' });
        toast.error(response.data.message || 'Failed to send message');
      }
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to send message' });
      toast.error(error.response?.data?.message || 'Failed to send message');
      return null;
    }
  },

  sendAndStreamMessage: async ({ chatId, content, onStream, onDone }) => {
    try {
      set({ isLoading: true, error: null });
      const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const token = localStorage.getItem('token');

      const response = await fetch(`${BACKEND_URL}/messages/send/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      const wordQueue = [];
      let isStreamFinished = false;
      let isTyping = false;

      const processQueue = async () => {
        if (isTyping) return;
        isTyping = true;
        while (wordQueue.length > 0 || !isStreamFinished) {
          if (wordQueue.length > 0) {
            const word = wordQueue.shift();
            if (onStream) onStream(word);

            await new Promise(resolve => setTimeout(resolve, 20));
          } else {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
        isTyping = false;
        if (onDone) {
          onDone();
          set({ isLoading: false, error: null });
        }
      };

      processQueue();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          isStreamFinished = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));

              if (data.done) {
                isStreamFinished = true;
              } else if (data.text) {
                wordQueue.push(data.text);
              } else if (data.error) {
                console.error("AI Streaming Error from Backend:", data.error);
                toast.error(data.error);
                isStreamFinished = true;
              }
            } catch (err) {
              // Ignored JSON parse errors for incomplete chunks
            }
          }
        }
      }

    } catch (error) {
      console.error("Fetch/Stream failed:", error);
      toast.error("Network error while trying to reach AI");
      if (onDone) onDone();
      set({ isLoading: false, error: null });
    }
  }

}));

export default useMessageStore;