# NexusAI Backend

This is the backend for NexusAI, built with **Node.js**, **Express**, **MongoDB**, and **Google Gemini AI**. It handles user authentication, chat/message management, and AI-powered responses.

## Features

- **User Authentication:** Register, login, logout with JWT-based authentication.
- **Chat System:** Create, fetch, and delete chats per user.
- **Messaging:** Send, stream, edit, and delete messages in chats.
- **AI Integration:** Uses Google Gemini API for generating chat responses.
- **Secure:** Protected routes with JWT middleware.
- **RESTful API:** Clean, modular endpoints for users, chats, and messages.

## Folder Structure

```
src/
	configs/
		db.js           # MongoDB connection
		genAI.js        # Gemini AI setup
	controllers/
		user.controller.js
		chat.controller.js
		message.controller.js
	middleware/
		auth.middleware.js   # JWT authentication
	models/
		user.model.js
		chat.model.js
		message.model.js
	routes/
		user.route.js
		chat.route.js
		messge.route.js
	utils/
		generateToken.js
		wrapAsync.js
index.js                # Main server entry
.env                    # Environment variables
```

## Main Components

- **index.js:** Sets up Express app, connects MongoDB, applies middleware, and mounts routes.
- **db.js:** Connects to MongoDB using Mongoose.
- **genAI.js:** Configures Gemini AI with API key.
- **Controllers:** Handle business logic for users, chats, and messages.
- **Models:** Mongoose schemas for User, Chat, and Message.
- **Routes:** RESTful endpoints for all features.
- **auth.middleware.js:** Secures routes using JWT.
- **wrapAsync.js:** Utility for async error handling.

## API Endpoints

### User

- `POST /api/v1/users/register` — Register new user
- `POST /api/v1/users/login` — Login user
- `POST /api/v1/users/logout` — Logout user

### Chat

- `POST /api/v1/chats/create` — Create new chat (auth required)
- `GET /api/v1/chats/user-chats/:userId` — Get all chats for user (auth required)
- `DELETE /api/v1/chats/:chatId` — Delete chat (auth required)

### Message

- `POST /api/v1/messages/send/:chatId` — Send message and stream Gemini AI response
- `GET /api/v1/messages/chat/:chatId` — Get all messages in a chat
- `GET /api/v1/messages/:messageId` — Get message by ID
- `DELETE /api/v1/messages/:messageId` — Delete message
- `PUT /api/v1/messages/:messageId` — Edit message
- `GET /api/v1/messages/user/:userId` — Get all messages by user

## How to Run

1. Install dependencies:
	 ```
	 npm install
	 ```
2. Set up your `.env` file with:
	 ```
     PORT=3000
     NODE_ENV=node_env
	 JWT_SECRET=your_jwt_secret
	 GEMINI_API_KEY=your_gemini_api_key
	 MONGODB_URI=your_mongodb_connection_string
	 ```
3. Start the development server:
	 ```
	 npm run dev
	 ```
	 The app runs at `http://localhost:5000` by default.

---
