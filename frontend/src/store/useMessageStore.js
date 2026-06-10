import axiosInstance from '../configs/axiosInstance.js';
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import useAuthStore from './useAuthStore.js';

const STREAM_API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/+$/, '');
const DEFAULT_ASSISTANT_ERROR_MESSAGE = "Sorry, I couldn't generate a response right now. Please try again in a moment.";

const useMessageStore = create((set) => ({
  isLoading: false,
  error: null,

  sendMessage: async ({ chatId, content, imageUrl }) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const language = useAuthStore.getState().language || 'auto';

      const response = await fetch(`${STREAM_API_BASE_URL}/messages/send/${chatId}`, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ content, imageUrl, language })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message = `HTTP error! status: ${response.status}`;
        try {
          message = JSON.parse(errorText).message || message;
        } catch {
          if (errorText) message = errorText;
        }
        throw new Error(message);
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let assistantContent = '';
      let streamError = null;

      const processLine = (line) => {
        if (!line.startsWith('data:')) return;
        const payload = line.slice(5).trimStart();
        if (!payload) return;

        const data = JSON.parse(payload);
        if (data.error) {
          streamError = data.error;
        } else if (data.text) {
          assistantContent += data.text;
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';

        for (const line of lines) processLine(line);
      }

      if (buffer.trim()) processLine(buffer);
      if (streamError) throw new Error(streamError);

      set({ isLoading: false });
      return { success: true, content: assistantContent };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send message';
      set({ isLoading: false, error: message });
      toast.error(message);
      return null;
    }
  },

  sendAndStreamMessage: async ({ chatId, content, imageUrl, onStream, onDone, onError }) => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('token');
      const language = useAuthStore.getState().language || 'auto';

      const response = await fetch(`${STREAM_API_BASE_URL}/messages/send/${chatId}`, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ content, imageUrl, language })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message = `HTTP error! status: ${response.status}`;
        try {
          message = JSON.parse(errorText).message || message;
        } catch {
          if (errorText) message = errorText;
        }
        throw new Error(message);
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      const wordQueue = [];
      let isStreamFinished = false;
      let streamError = null;
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
            if (streamError && onError) {
              onError(DEFAULT_ASSISTANT_ERROR_MESSAGE);
            } else if (onDone) {
              onDone();
            }
            set({ isLoading: false, error: streamError });
          }
        }, 18);
      };

      const processLine = (line) => {
        if (!line.startsWith('data:')) return;
        const payload = line.slice(5).trimStart();
        if (!payload) return;

        try {
          const data = JSON.parse(payload);

          if (data.done) {
            isStreamFinished = true;
          } else if (data.text) {
            enqueueText(data.text);
          } else if (data.error) {
            console.error("AI Streaming Error from Backend:", data.error);
            streamError = data.error;
            isStreamFinished = true;
          }
        } catch {
          // Ignore malformed/incomplete SSE payloads until the next chunk arrives.
        }
      };

      startPump();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          isStreamFinished = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';

        for (const line of lines) processLine(line);
      }

      if (buffer.trim()) processLine(buffer);
      startPump();

    } catch (error) {
      console.error("Fetch/Stream failed:", error);
      toast.error(error.message || "Network error while trying to reach AI");
      if (onError) onError(DEFAULT_ASSISTANT_ERROR_MESSAGE);
      else if (onDone) onDone();
      set({ isLoading: false, error: error.message || null });
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

  getMessagesByChat: async (chatId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/messages/chat/${chatId}`);
      set({ isLoading: false });
      if (response.data.messages) {
        return response.data.messages;
      }
      return [];
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to fetch messages' });
      toast.error(error.response?.data?.message || 'Failed to fetch messages');
      return [];
    }
  },

}));

export default useMessageStore;
