import axiosInstance from '../configs/axiosInstance.js';
import { create } from 'zustand';
import { toast } from 'react-hot-toast';

const ACCENT_COLORS = {
    blue: '#2196F3',
    yellow: '#FFD600',
    green: '#4CAF50',
    purple: '#9C27B0',
    red: '#F44336',
    orange: '#FF9800',
    pink: '#E91E63',
    teal: '#009688',
};

function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
        html.classList.add('dark');
    else html.classList.remove('dark');
}

const ACCENT_TEXT_COLORS = {
    yellow: '#f1f1f1',
    blue: '#FFFFFF',
    green: '#FFFFFF',
    purple: '#FFFFFF',
    red: '#FFFFFF',
    orange: '#000000',
    pink: '#FFFFFF',
    teal: '#FFFFFF',
};

function applyAccentColor(accent) {
    const hex = ACCENT_COLORS[accent] || ACCENT_COLORS.yellow;
    const textColor = ACCENT_TEXT_COLORS[accent] || '#FFFFFF';
    document.documentElement.style.setProperty('--accent-color', hex);
    document.documentElement.style.setProperty('--accent-text-color', textColor);
}

function applyContrast(contrast) {
    const html = document.documentElement;
    if (contrast === 'high' || (contrast === 'system' && window.matchMedia('(prefers-contrast: more)').matches)) html.classList.add('high-contrast');
    else html.classList.remove('high-contrast');
}

function getActualTheme(theme) {
    if (theme === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return theme;
}

function getActualContrast(contrast) {
    if (contrast === 'system') return window.matchMedia('(prefers-contrast: more)').matches ? 'high' : 'standard';
    return contrast;
}

const initialTheme = localStorage.getItem('theme') || 'dark';
const initialAccent = localStorage.getItem('accentColor') || 'blue';
const initialContrast = localStorage.getItem('contrast') || 'system';

applyTheme(initialTheme);
applyAccentColor(initialAccent);
applyContrast(initialContrast);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'system') {
        applyTheme('system');
        useAuthStore.setState({ actualTheme: getActualTheme('system') });
    }
});

window.matchMedia('(prefers-contrast: more)').addEventListener('change', () => {
    const currentContrast = localStorage.getItem('contrast') || 'system';
    if (currentContrast === 'system') {
        applyContrast('system');
        useAuthStore.setState({ actualContrast: getActualContrast('system') });
    }
});

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,

    theme: initialTheme,
    actualTheme: getActualTheme(initialTheme),
    accentColor: initialAccent,
    contrast: initialContrast,
    actualContrast: getActualContrast(initialContrast),

    getInitials: () => {
        const user = get().user;
        if (!user || (!user.name && !user.username)) return '?';
        const nameToUse = user.name || user.username;
        const parts = nameToUse.trim().split(/\s+/);
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },

    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        applyTheme(theme);
        set({ theme, actualTheme: getActualTheme(theme) });
    },

    setAccentColor: (accent) => {
        localStorage.setItem('accentColor', accent);
        applyAccentColor(accent);
        set({ accentColor: accent });
    },

    setContrast: (contrast) => {
        localStorage.setItem('contrast', contrast);
        applyContrast(contrast);
        set({ contrast, actualContrast: getActualContrast(contrast) });
    },

    ACCENT_COLORS,

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
            const { user, token } = response.data;
            // console.log(response.data)
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
    },

    deleteAccount: async ({ password, navigate }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/users/delete', {
                password
            });
            if (response.data.success) {
                set({ user: null, token: null });
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/');
                toast.success('Account deleted successfully');
                set({ isLoading: false });
            } else {
                set({ isLoading: false, error: response.data.message || 'Account deletion failed' });
                toast.error(response.data.message || 'Account deletion failed');
            }
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || 'Account deletion failed' });
            toast.error(error.response?.data?.message || 'Account deletion failed');
        }
    }

}),
    {
        name: 'auth-storage',
        getStorage: () => localStorage,
    }
);

export default useAuthStore;