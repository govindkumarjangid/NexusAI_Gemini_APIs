
# NexusAI Backend

The NexusAI backend is a robust RESTful API built with **Node.js**, **Express**, and **MongoDB**. It serves as the bridge between the frontend and **Google Gemini AI**, handling authentication, data persistence, and complex AI processing.

## 🚀 Features

- **Advanced AI Integration:** Native support for **Gemini 2.5 Flash Lite** with streaming and multimodal capabilities.
- **Secure Authentication:** JWT-based user authentication with encrypted passwords using BcryptJS.
- **Cloud Storage:** Integrated with **Cloudinary** for high-performance image handling.
- **Scalable Architecture:** Modular controller-route-service pattern for easy maintenance.
- **Efficient Streaming:** Real-time message streaming using Server-Sent Events (SSE).

## 📁 Folder Structure

```text
src/
├── configs/
│   ├── db.js           # MongoDB connection logic
│   ├── genAI.js        # Google Gemini AI configuration
│   └── cloudinary.js   # Cloudinary & Multer storage setup
├── controllers/
│   ├── user.controller.js
│   ├── chat.controller.js
│   └── message.controller.js
├── middleware/
│   └── auth.middleware.js   # JWT verification middleware
├── models/
│   ├── user.model.js
│   ├── chat.model.js
│   └── message.model.js
├── routes/
│   ├── user.route.js
│   ├── chat.route.js
│   └── messge.route.js
└── utils/
    ├── generateToken.js
    └── wrapAsync.js         # Async error handling wrapper
index.js                # Main server entry point
```

## 🛠️ Key Components

- **Streaming Engine:** Uses SSE to stream AI responses word-by-word for a better user experience.
- **Vision Support:** Automatically converts Cloudinary URLs to base64 to feed into Gemini's multimodal vision model.
- **Auto-titling:** Dynamically updates chat session titles based on the user's first query.

## 📚 API Endpoints

### User & Authentication
- `POST /api/v1/users/register` — Create a new account.
- `POST /api/v1/users/login` — Authenticate and receive a JWT.
- `POST /api/v1/users/logout` — Clear session.

### Chat Management
- `POST /api/v1/chats/create` — Initialize a new chat session.
- `GET /api/v1/chats/user-chats/:userId` — Fetch all sessions for a specific user.
- `DELETE /api/v1/chats/:chatId` — Remove a chat session and its history.

### Messages & AI
- `POST /api/v1/messages/send/:chatId` — Send a message and initiate AI streaming.
- `POST /api/v1/messages/upload` — Upload an image (Returns Cloudinary URL).
- `GET /api/v1/messages/chat/:chatId` — Retrieve full message history for a chat.

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_google_ai_key
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🛠️ Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start in development mode (with nodemon):**
   ```bash
   npm run dev
   ```

3. **Start in production mode:**
   ```bash
   npm start
   ```

---
