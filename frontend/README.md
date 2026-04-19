
# NexusAI Frontend

This is the frontend for NexusAI, built with **React** and **Vite**. It provides a modern chat interface with authentication, chat management, and AI-powered messaging.

## Features

- **Authentication:** Login and registration with persistent user sessions.
- **Chat System:** Create, view, search, and delete chats.
- **Real-time Messaging:** Send and receive AI-powered messages with streaming responses.
- **Responsive UI:** Mobile-friendly sidebar, chat area, and search.
- **State Management:** Uses Zustand for global state (auth, chat, message).
- **UI Libraries:** TailwindCSS for styling, Framer Motion for animation, Lucide for icons, PrismJS for code highlighting, and React Hot Toast for notifications.

## Folder Structure

```
src/
  App.jsx                # Main app and routing
  index.css, main.jsx    # Entry point and global styles
  components/            # UI components (Sidebar, ChatArea, ChatList, etc.)
  configs/               # Axios instance, message rendering helpers
  pages/                 # Auth (login/register), SearchPage
  store/                 # Zustand stores for auth, chat, message
```

## Main Components

- **App.jsx:** Handles routing, authentication state, and layout.
- **Sidebar:** Navigation, new chat, search, recent chats, and logout.
- **ChatArea:** Displays messages, input area, and chat header.
- **ChatMessages:** Renders chat history with markdown/code formatting.
- **ChatInputArea:** Text input, file/image/voice upload (UI only).
- **SearchPage:** Search chats by message content.
- **RecentChatsSidebar:** Quick access to recent chats.

## State Management

- **useAuthStore:** Handles user authentication, UI state (sidebar, search), and session.
- **useChatStore:** Manages chat list, current chat, create/delete chat.
- **useMessageStore:** Handles sending and streaming messages.

## API Integration

- **axiosInstance.js:** Configured with base URL and token from localStorage.
- **All API calls** are made to the backend for authentication, chat, and message operations.

## UI/UX

- **TailwindCSS** for utility-first styling.
- **Framer Motion** for smooth animations.
- **PrismJS** for code block syntax highlighting in messages.
- **React Hot Toast** for notifications.

## How to Run

1. Install dependencies:
	```
	npm install
	```
2. Start the development server:
	```
	npm run dev
	```
3. The app runs at `http://localhost:5173` by default.

---
