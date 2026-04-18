import React from 'react';
import { SquareChevronRight } from 'lucide-react';
import logo from '/nexusai-logo.svg';
import useAuthStore from '../store/useAuthStore';

const ChatAreaHeader = () => {
    const { isMobile, sidebarOpen, setSidebarOpen, user } = useAuthStore();

    return (
        <header className={`h-14 shrink-0 w-full flex items-center justify-between px-3 sm:px-4 border-b border-gray-700/40 sticky top-0 z-20 ${sidebarOpen ? 'bg-transparent backdrop-blur-sm' : 'bg-[#1e1f20]'}`}>
            <div className="flex items-center gap-3">
                {isMobile && !sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-0 sm:p-3 hover:bg-gray-800 rounded-full transition-all cursor-ew-resize duration-300 active:scale-95 text-gray-400 hover:text-gray-200"
                    >
                        <SquareChevronRight size={22} />
                    </button>
                )}
                <h1 className="font-semibold text-lg text-gray-200">NexusAI</h1>
            </div>
            {user && (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg uppercase">
                        {user.name?.[0] || '?'}
                    </div>
                    <span className="text-gray-200 hidden sm:flex font-normal text-base max-w-30 truncate">{user.name || 'User'}</span>
                </div>
            )}
        </header>
    );
};

export default ChatAreaHeader;
