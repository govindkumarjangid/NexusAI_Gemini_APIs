
# NexusAI Frontend

The NexusAI frontend is a state-of-the-art Single Page Application (SPA) built with **React 19** and **Vite**. It features a high-performance chat interface designed for a premium user experience.

## 🚀 Features

- **Modern UI:** Built with **Tailwind CSS 4** for lightning-fast styling and smaller bundles.
- **Fluid Animations:** Powered by **Framer Motion** for a sleek, responsive feel.
- **Real-time Streaming:** Smooth AI response rendering using streaming logic.
- **Multimodal Input:** Support for image uploads and text queries.
- **Persistent State:** Global state management with **Zustand** (Auth, Chat, and Message stores).
- **Rich Formatting:** Full support for Markdown, Code syntax highlighting (PrismJS), and Math equations (KaTeX).

## 📁 Folder Structure

```text
src/
├── components/            # Atomic & layout components
│   ├── Sidebar/           # Navigation & Session management
│   ├── Chat/              # ChatArea, Messages, & Input
│   └── Shared/            # Buttons, Inputs, & Modals
├── configs/               # Axios instance & global constants
├── pages/                 # Auth (Login/Register) & Search
├── store/                 # Zustand global state slices
├── App.jsx                # Layout & Route definitions
└── main.jsx               # App entry & global styles (Tailwind 4)
```

## 🧠 State Management (Zustand)

The app uses a modular store architecture:
- **`useAuthStore`:** Manages user session, JWT persistence, and UI toggles (sidebar/search).
- **`useChatStore`:** Handles session history, active chat selection, and CRUD operations for chats.
- **`useMessageStore`:** Logic for sending messages, handling image attachments, and processing SSE streams.

## 🎨 UI & UX

- **Glassmorphism:** Subtle background blurs and gradients for a modern look.
- **Responsive Design:** Optimized for Mobile, Tablet, and Desktop viewports.
- **Instant Feedback:** Integrated with `react-hot-toast` for real-time notifications.

## ⚙️ Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 🛠️ Key Technologies

- **React 19** (Concurrent Rendering)
- **Tailwind CSS 4** (Zero-runtime CSS)
- **Vite 8** (Fast Bundling)
- **Zustand** (Lightweight State)
- **Framer Motion 12** (Advanced Animations)

---
