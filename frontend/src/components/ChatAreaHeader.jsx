import React from 'react';
import { SquareChevronRight } from 'lucide-react';
import logo from '/nexusai-logo.svg';
import useAuthStore from '../store/useAuthStore';
import Spinner from './Spinner';

const ChatAreaHeader = () => {
    const { isMobile, sidebarOpen, setSidebarOpen, user } = useAuthStore();

    return (
        <header
            className="h-14 shrink-0 w-full flex items-center justify-between px-3 sm:px-4 border-b sticky top-0 z-10 backdrop-blur-sm"
            style={{
                borderColor: 'var(--border-color)',
                backgroundColor:'var(--bg-surface)',
               color: 'var(--text-primary)',
            }}
        >
            <div className="flex items-center gap-3">
                {isMobile && !sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-0 sm:p-3 rounded-full transition-all cursor-ew-resize duration-300 active:scale-95"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <SquareChevronRight size={22} />
                    </button>
                )}
                <h1 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>NexusAI</h1>
            </div>
            {user && (() => {
                const initial = (() => {
                    if (!user.name) return '?';
                    const parts = user.name.trim().split(/\s+/);
                    if (parts.length === 1) return parts[0][0].toUpperCase();
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                })();

                return (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-contrast flex items-center justify-center font-semibold text-sm">
                            {initial}
                        </div>
                        <span className="hidden sm:flex font-normal text-base max-w-30 truncate" style={{ color: 'var(--text-secondary)' }}>{user.name || 'User'}</span>
                    </div>
                );
            })()}
        </header>
    );
};

export default ChatAreaHeader;
