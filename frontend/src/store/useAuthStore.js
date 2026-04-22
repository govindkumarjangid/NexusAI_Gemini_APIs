import axiosInstance from '../configs/axiosInstance.js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,

    // Theme and accent color state
    theme: localStorage.getItem('theme') || 'dark',
    accentColor: localStorage.getItem('accentColor') || 'yellow',
    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
        const html = document.documentElement;
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    },
    setAccentColor: (accent) => {
        localStorage.setItem('accentColor', accent);
        set({ accentColor: accent });
        const ACCENT_COLORS = {
            yellow: '#FFD600',
            blue: '#2196F3',
            green: '#4CAF50',
        };
        document.documentElement.style.setProperty('--accent-color', ACCENT_COLORS[accent] || '#FFD600');
    },

    isMobile: window.innerWidth < 768,
    setIsMobile: (val) => set({ isMobile: val }),
    sidebarOpen: !(window.innerWidth < 768) && false,
    setSidebarOpen: (val) => set({ sidebarOpen: val }),
    isSearchOpen: false,
    setIsSearchOpen: (val) => set({ isSearchOpen: val }),

    register: async ({ name, email, password, navigate }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/users/register', {
                name,
                email,
                password
            });
            set({ isLoading: false });
            if (response.data.success) {
                set({ user, token, isLoading: false });
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                navigate('/chat');
                toast.success('Registration successful');
            } else {
                set({ error: response.data.message || 'Registration failed' });
                toast.error(response.data.message || 'Registration failed');
            }
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Registration failed' });
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    },

    login: async ({ email, password, navigate }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/users/login', {
                email,
                password
            });
            const { user, token } = response.data;
            if (response.data.success) {
                set({ user, token, isLoading: false });
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                navigate('/chat');
                toast.success('Login successful');
            } else {
                set({ isLoading: false, error: response.data.message || 'Login failed' });
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Login failed' });
            toast.error(error.response?.data?.message || 'Login failed');
        }
    },

    logout: async () => {
        set({ user: null, token: null });
        try {
            const response = await axiosInstance.post('/users/logout');
            if (response.data.success) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                toast.success('Logout successful');
            }
        } catch (error) {
            set({ error: error.response?.data?.message || 'Logout failed' });
            console.error('Logout error:', error);
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    }

}),
    {
        name: 'auth-storage',
        getStorage: () => localStorage,
    }
);

export default useAuthStore;