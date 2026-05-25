# 🌌 NexusAI – Google Gemini Fullstack Application

NexusAI is a premium, high-performance, and feature-rich full-stack AI chat application built with modern web technologies. It integrates the power of **Google Gemini 2.5 Flash** to provide lightning-fast, highly intelligent multimodal conversations (supporting both text prompts and high-fidelity image uploads) wrapped inside a gorgeous, fully customizable user interface.

![NexusAI Banner](https://img.shields.io/badge/NexusAI-Gemini%203.5%20Flash-blue?style=for-the-badge&logo=google-gemini)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge&logo=react)
![Tailwind 4](https://img.shields.io/badge/Tailwind-CSS%204.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![State Management](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)

---

## 🚀 Key Features

* **Multimodal AI Interface:** Chat seamlessly with Google Gemini using combination inputs of rich text and image attachments (processed, optimized, and delivered securely).
* **Real-time Stream Response:** Experience low-latency token streaming with premium live typewriter effects and dynamic, glowing typing status indicators.
* **ChatGPT & Gemini Hybrid branding:** Features an ultra-premium, dynamic logo component that blends ChatGPT's iconic swirling loop vortex with Gemini's four-pointed generative AI spark, responsive in real-time to active UI themes.
* **Slick Collapsible Responsive Sidebar:**
  - Standard multi-panel sidebar layout for wide screens.
  - Collapses smoothly into a clean floating row of icons on smaller views to prioritize chat real estate.
  - When collapsed, buttons dynamically clear their default background/border styles and elegantly fade them in only on mouse-hover to maintain a minimalist look.
* **Dynamic Theme Customization:** Extensive user settings including:
  - **Accent Colors:** Instantly switch accent states across 8 premium tailored hues (Blue, Yellow, Green, Purple, Red, Orange, Pink, Teal).
  - **Active Themes:** Fully integrated System, Light, and dark mode controls.
  - **High Contrast Support:** High-accessibility styling controls that automatically swap color tokens.
* **Smart Session Management:** Multi-session conversation logs, shareable chat links (public sharing), custom title renaming, pinned chats, and a global search system that queries message logs instantly.
* **Rich Message Formatting:** Integrated rendering of markdown lists, tables, dynamic blockquotes, PrismJS-based syntax highlighted code blocks, and KaTeX-based mathematical formatting.
* **Secure Session Auth:** Standard user registration and credentials validation backed by JWT browser persistence, secure cookie storage, and BcryptJS hashing on database entries.
* **Cloud File Processing:** Cloudinary API pipeline integrations coupled with Multer to stream, store, and serve image uploads cleanly.

---

## 📁 Project Structure

A comprehensive view of the MERN fullstack codebase:

```text
NexusAI_Gemini_APIs/
├── backend/                        # Node.js + Express REST API Server
│   ├── src/
│   │   ├── configs/                # System config pipelines
│   │   │   ├── cloudinary.js       # Cloudinary file upload storage helper
│   │   │   ├── db.js               # MongoDB Mongoose database connector
│   │   │   └── gemini.js           # Google Generative AI pipeline config
│   │   ├── controllers/            # Route controllers (API controller layers)
│   │   │   ├── chat.controller.js  # Chat session actions (create, pin, search)
│   │   │   ├── message.controller.js # AI prompt streams, history, image uploads
│   │   │   └── user.controller.js  # Auth (register, login, credentials verification)
│   │   ├── middleware/             # Express server interceptors
│   │   │   └── auth.js             # JWT user session validation middleware
│   │   ├── models/                 # Database Mongoose Schemas
│   │   │   ├── chat.model.js       # Chat sessions metadata model
│   │   │   ├── message.model.js    # Message arrays model (user vs assistant)
│   │   │   └── user.model.js       # Encrypted credentials & profile schemas
│   │   ├── routes/                 # API endpoint routers
│   │   │   ├── chat.route.js       # Chat session endpoints
│   │   │   ├── messge.route.js     # Message interaction endpoints
│   │   │   └── user.route.js       # Account & Auth endpoints
│   │   └── utils/                  # Helper tools & async wrappers
│   ├── index.js                    # Backend Server Entrypoint
│   └── package.json                # Server-side scripts & packages
│
├── frontend/                       # React client app
│   ├── src/
│   │   ├── components/             # Modular reusable components
│   │   │   ├── chat/               # Chat area interface components
│   │   │   │   ├── ChatArea.jsx    # Core messaging dashboard container
│   │   │   │   ├── ChatInputArea.jsx # Rich input panel supporting attachments
│   │   │   │   ├── ChatMessages.jsx # Message lists & scroll anchors
│   │   │   │   ├── ShareModal.jsx  # Link generator for public sharing
│   │   │   │   └── [Modals...]     # Delete, renaming, & preview modals
│   │   │   ├── common/             # Reusable global elements
│   │   │   │   ├── Logo.jsx        # Premium ChatGPT-Gemini responsive SVG
│   │   │   │   └── Tooltip.jsx     # Positioned overlay helper
│   │   │   ├── sidebar/            # Dashboard collapsible sidebars
│   │   │   │   ├── Sidebar.jsx     # Navigation panel
│   │   │   │   └── SidebarBottom.jsx # Profile & preference popup triggers
│   │   │   ├── landing/            # Landing page UI modules
│   │   │   └── model/              # User settings modals & triggers
│   │   ├── configs/                # API connector client configs
│   │   │   └── axiosInstance.js    # Pre-configured axios client
│   │   ├── pages/                  # Route views
│   │   │   ├── LandingPage.jsx     # Interactive showcase landing
│   │   │   ├── LoginPage.jsx       # User login page
│   │   │   └── SharedChatPage.jsx  # Shareable conversation view
│   │   ├── store/                  # Lightweight Zustand state stores
│   │   │   ├── useAuthStore.js     # User states, dynamic themes & settings
│   │   │   ├── useChatStore.js     # Active chat metadata states
│   │   │   └── useMessageStore.js  # Message logs & AI streaming queues
│   │   ├── App.jsx                 # Routing configuration & Dynamic Favicon
│   │   ├── index.css               # Core styling tokens & animations database
│   │   └── main.jsx                # Client application entry point
│   ├── package.json                # Client dependencies
│   └── vite.config.js              # Vite server compiler config
└── README.md                       # Comprehensive system documentation
```

---

## 🛠️ Technology Stack

### Client-Side (Frontend)
* **Library:** React 19 (Functional Hooks)
* **Build tool:** Vite 8 (Ultra-fast Hot Module Replacement)
* **Styling Engine:** Tailwind CSS 4 (Vite native compiler engine)
* **Animations:** Framer Motion (Smooth page transitions & elastic layouts)
* **Global State:** Zustand (Optimized, lightweight, non-boilerplate stores)
* **Render Formatters:** Markdown Parser, PrismJS (Syntax highlighting), KaTeX (Mathematical formulae)
* **Status Feedback:** React Hot Toast

### Server-Side (Backend)
* **Runtime:** Node.js (v18+) with ES Modules
* **Framework:** Express 5 (High-performance API routing)
* **Database:** MongoDB Atlas (Cloud storage)
* **Database Driver:** Mongoose ODM (Schemas & validation)
* **API Integration:** `@google/generative-ai` (Gemini 2.5 Flash API connector)
* **File Upload Pipeline:** Multer (multipart storage) + Cloudinary SDK (cloud media delivery)
* **Security:** JSON Web Token (JWT) + BcryptJS (salt hashing verification)

---

## ⚙️ Installation & Setup

### Prerequisites

* Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).
* A running [MongoDB](https://www.mongodb.com/cloud/atlas) Database Instance.
* A [Google Gemini API Key](https://aistudio.google.com/app/apikey).
* A [Cloudinary Account](https://cloudinary.com/) (for prompt media storage).

---

### 1. Clone the codebase

```bash
git clone <your-repo-link>
cd NexusAI_Gemini_APIs
```

### 2. Configure Backend Server

1. Navigate to the server folder:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the root of the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexusai
   GEMINI_API_KEY=your_google_gemini_api_key
   JWT_SECRET=your_jwt_signing_token_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. Fire up the backend development server:
   ```bash
   npm run dev
   ```
   The backend will launch on `http://localhost:5000`.

---

### 3. Configure Frontend Client

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd ../frontend
   npm install
   ```

2. Create a `.env` file in the root of the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. Launch the Vite development compiler server:
   ```bash
   npm run dev
   ```
   The client will compile, mount, and run on `http://localhost:5173`. Open this URL in your browser to experience NexusAI!

---

## 📚 API Endpoints Reference

| Category | Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Auth** | `/api/v1/users/register` | POST | 🔓 No | Creates a new user profile |
| **Auth** | `/api/v1/users/login` | POST | 🔓 No | Validates user & issues JWT token |
| **Auth** | `/api/v1/users/delete` | POST | 🔒 Yes | Deletes the active user account |
| **Chat** | `/api/v1/chats/create` | POST | 🔒 Yes | Initiates a new chat log session |
| **Chat** | `/api/v1/chats/user/:userId` | GET | 🔒 Yes | Fetches all chat sessions for a user |
| **Chat** | `/api/v1/chats/delete/:chatId`| DELETE | 🔒 Yes | Removes a specific chat session |
| **Message**| `/api/v1/messages/send/:chatId` | POST | 🔒 Yes | Streams prompt to Gemini & logs response |
| **Message**| `/api/v1/messages/history/:chatId`| GET | 🔒 Yes | Restores chat session dialogue history |
| **Storage**| `/api/v1/messages/upload` | POST | 🔒 Yes | Uploads attachments to Cloudinary |

---

## 📝 License

This project is licensed under the ISC License. Built for educational and demonstration purposes.
