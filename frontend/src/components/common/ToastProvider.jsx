import { Toaster } from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const ToastProvider = () => {
    const actualTheme = useAuthStore(state => state.actualTheme);
    const isDark = actualTheme === 'dark';

    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                style: isDark ? {
                    background: '#1E1E21',
                    color: '#e5e7eb',
                    border: '1px solid #333338',
                } : {
                    background: '#ffffff',
                    color: '#1a1a1a',
                    border: '1px solid #e5e7eb',
                },
                success: {
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#ffffff',
                    },
                    style: isDark ? {
                        background: '#1E1E21',
                        color: '#e5e7eb',
                        border: '1px solid #22c55e40',
                    } : {
                        background: '#ffffff',
                        color: '#1a1a1a',
                        border: '1px solid #22c55e40',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                    },
                    style: isDark ? {
                        background: '#1E1E21',
                        color: '#e5e7eb',
                        border: '1px solid #ef444440',
                    } : {
                        background: '#ffffff',
                        color: '#1a1a1a',
                        border: '1px solid #ef444440',
                    },
                },
            }}
        />
    );
};

export default ToastProvider;
