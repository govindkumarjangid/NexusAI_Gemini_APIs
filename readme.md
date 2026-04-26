
# NexusAI – Google Gemini APIs Fullstack Application

NexusAI is a premium, high-performance full-stack AI chat application built with the latest technologies. It leverages **Google Gemini 2.5 Flash Lite** for lightning-fast, intelligent conversations with support for multimodal inputs (text and images).

![NexusAI Banner](https://img.shields.io/badge/NexusAI-Gemini%202.5%20Flash-blue?style=for-the-badge&logo=google-gemini)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)

---

## 🚀 Features

- **Multimodal Conversations:** Chat with Gemini using both text and images.
- **Streaming Responses:** Experience real-time AI typing effects for a seamless UX.
- **Dynamic UI/UX:** Built with **Tailwind CSS 4** and **Framer Motion** for smooth, premium animations.
- **Smart History:** Persistence of chat sessions and messages with automatic title generation.
- **Global Search:** Find any message across all your conversations instantly.
- **Secure Authentication:** Robust user login and registration powered by **JWT**.
- **Cloud Integration:** Image uploads handled via **Cloudinary**.
- **Modern State Management:** Fast and lightweight state handling using **Zustand**.

---

## 📁 Project Structure

```text
NexusAI_Gemini_APIs/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── configs/          # MongoDB, Gemini, & Cloudinary Configs
│   │   ├── controllers/      # Route logic & AI processing
│   │   ├── middleware/       # JWT Authentication
│   │   ├── models/           # Mongoose schemas (User, Chat, Message)
│   │   ├── routes/           # API Endpoints
│   │   └── utils/            # Async wrappers & Token helpers
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies
├── frontend/                 # React + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── configs/          # API & Helper configurations
│   │   ├── pages/            # View-level components
│   │   ├── store/            # Zustand global stores
│   │   ├── App.jsx           # Routing & Layout
│   │   └── main.jsx          # App entry point
│   └── package.json          # Frontend dependencies
└── README.md                 # Project documentation
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4 (Native Vite Plugin)
- **Animations:** Framer Motion
- **State:** Zustand
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Formatting:** PrismJS (Code) & KaTeX (Math)

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **AI Integration:** @google/generative-ai (Gemini 2.5 Flash Lite)
- **File Uploads:** Multer + Cloudinary
- **Auth:** JWT + BcryptJS

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or Local Instance
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- [Cloudinary Account](https://cloudinary.com/)

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

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Run Locally

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📚 API Endpoints

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/v1/users/register` | POST | Register a new user |
| **Auth** | `/api/v1/users/login` | POST | User login |
| **Chat** | `/api/v1/chats/create` | POST | Create a new session |
| **Message**| `/api/v1/messages/send/:chatId` | POST | Send message (Streams AI response) |
| **Storage**| `/api/v1/messages/upload` | POST | Upload image to Cloudinary |

---

## 📝 License

This project is licensed under the ISC License. Built for educational and demonstration purposes.
