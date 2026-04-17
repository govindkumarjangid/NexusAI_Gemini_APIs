// add user login , register and logout functionality
import axiosInstance from '../configs/axiosInstance.js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const useAuthStore = create((set) => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,

    // UI State
    isMobile: window.innerWidth < 768,
    setIsMobile: (val) => set({ isMobile: val }),
    sidebarOpen: !(window.innerWidth < 768),
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