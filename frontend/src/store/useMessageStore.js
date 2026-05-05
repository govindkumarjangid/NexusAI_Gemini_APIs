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

  sendAndStreamMessage: async ({ chatId, content, imageUrl, onStream, onDone }) => {
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
        body: JSON.stringify({ content, imageUrl })
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      const wordQueue = [];
      let isStreamFinished = false;
      let pumpTimer = null;
      const wordsPerChunk = 2;

      const enqueueText = (text) => {
        if (!text) return;
        const words = text.match(/\s+|[^\s]+/g);
        if (words) {
          wordQueue.push(...words);
        }
      };

      const stopPump = () => {
        if (pumpTimer) {
          clearInterval(pumpTimer);
          pumpTimer = null;
        }
      };

      const startPump = () => {
        if (pumpTimer) return;

        pumpTimer = setInterval(() => {
          if (wordQueue.length > 0) {
            let nextChunk = '';
            let wordsEmitted = 0;

            while (wordQueue.length > 0 && wordsEmitted < wordsPerChunk) {
              const token = wordQueue.shift();
              nextChunk += token;
              if (token.trim()) {
                wordsEmitted += 1;
              }
            }

            if (onStream && nextChunk) onStream(nextChunk);
            return;
          }

          if (isStreamFinished) {
            stopPump();
            if (onDone) onDone();
            set({ isLoading: false, error: null });
          }
        }, 18);
      };

      startPump();

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
                enqueueText(data.text);
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

      startPump();

    } catch (error) {
      console.error("Fetch/Stream failed:", error);
      toast.error("Network error while trying to reach AI");
      if (onDone) onDone();
      set({ isLoading: false, error: null });
    }
  },

  generateImage: async ({ chatId, prompt }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/messages/generate-image/${chatId}`, { prompt });
      set({ isLoading: false });
      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        toast.error(response.data.message || 'Image generation failed');
        return null;
      }
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to generate image' });
      toast.error(error.response?.data?.message || 'Failed to generate image');
      return null;
    }
  },

}));

export default useMessageStore;