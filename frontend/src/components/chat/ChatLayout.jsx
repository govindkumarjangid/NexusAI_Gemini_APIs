import { lazy } from 'react';

// Lazy load components for performance
const Sidebar = lazy(() => import('../sidebar/Sidebar'));
const ChatArea = lazy(() => import('./ChatArea'));
const SearchPage = lazy(() => import('../../pages/SearchPage'));

const ChatLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden relative bg-base text-primary">
      <Sidebar />
      <ChatArea />
      <SearchPage />
    </div>
  );
};

export default ChatLayout;
