
# NexusAI – Google Gemini APIs Fullstack Application

NexusAI is a modern full-stack AI chat application powered by **Google Gemini APIs**. It features a robust backend (Node.js, Express, MongoDB) and a sleek, responsive frontend (React, Vite, Zustand, TailwindCSS). The app supports user authentication, chat history, and real-time AI-powered conversations.

---

## 📁 Project Structure

```
NexusAI_Gemini_APIs/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── configs/          # DB & Gemini API config
│   │   ├── controllers/      # Route logic & Gemini API calls
│   │   ├── middleware/       # JWT authentication
│   │   ├── models/           # Mongoose schemas (User, Chat, Message)
│   │   ├── routes/           # API endpoints
│   │   └── utils/            # Helpers (token, error handling)
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/       # UI components (Sidebar, ChatArea, etc.)
│   │   ├── configs/          # Axios instance, render helpers
│   │   ├── pages/            # Views (Auth, SearchPage)
│   │   ├── store/            # Zustand stores
│   │   ├── App.jsx           # Main app
│   │   └── main.jsx          # Entry point
│   └── package.json          # Frontend dependencies
└── README.md                 # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) database
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd NexusAI_Gemini_APIs
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
# or
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (optional):

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the React dev server:

```bash
npm run dev
```

---

## 🛠️ Key Libraries

- **Backend:** express, mongoose, @google/generative-ai, dotenv, cors, jsonwebtoken, bcryptjs, nodemon
- **Frontend:** react, vite, axios, zustand, tailwindcss, framer-motion, lucide-react, react-hot-toast, react-router-dom, prismjs

---

## 💡 How It Works

1. **Frontend:** User interacts with the chat UI. Requests are sent to the backend via Axios.
2. **Backend:** Express authenticates the user, processes chat/message requests, and interacts with Gemini AI.
3. **Gemini API:** Generates advanced AI responses.
4. **Database:** MongoDB stores users, chats, and messages.
5. **Result:** The frontend updates in real-time with AI responses and chat history.

---

## 📚 API Overview

### User

- `POST /api/v1/users/register` — Register
- `POST /api/v1/users/login` — Login
- `POST /api/v1/users/logout` — Logout

### Chat

- `POST /api/v1/chats/create` — Create chat (auth required)
- `GET /api/v1/chats/user-chats/:userId` — Get user chats (auth required)
- `DELETE /api/v1/chats/:chatId` — Delete chat (auth required)

### Message

- `POST /api/v1/messages/send/:chatId` — Send message, stream Gemini AI response
- `GET /api/v1/messages/chat/:chatId` — Get chat messages
- `GET /api/v1/messages/:messageId` — Get message by ID
- `DELETE /api/v1/messages/:messageId` — Delete message
- `PUT /api/v1/messages/:messageId` — Edit message
- `GET /api/v1/messages/user/:userId` — Get all messages by user

---

## ✨ Features

- Modern, responsive UI (React + TailwindCSS)
- Secure JWT authentication
- Real-time AI chat with Gemini API
- Chat history and search
- Modular, scalable codebase

---

## 📝 License

This project is for educational and demonstration purposes.

---
