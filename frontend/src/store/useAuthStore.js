// add user login , register and logout functionality
import axiosInstance from '../configs/axiosInstance.js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {toast} from 'react-hot-toast';

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    loading: false,
    error: null,

    register: async (username, email, password) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/register', {
                username,
                email,
                password
            });
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || 'Registration failed' });
        }
    },


    }));