# ChatGPT Clone using OpenAI APIs

This project is a full-stack clone of ChatGPT, built using React (Vite) for the frontend and Node.js/Express for the backend. It integrates the official OpenAI APIs to generate dynamic, conversational responses.

## 📁 Folder Structure (Fie & Folder Layout)

```text
ChatGPT_OpenAI-APIs/
├── backend/                  # Server-side code (Node.js + Express)
│   ├── src/
│   │   ├── configs/          # Database & environment configurations
│   │   ├── controllers/      # Route logic & OpenAI API calling logic
│   │   ├── models/           # MongoDB schemas (e.g., User, Chat)
│   │   ├── routes/           # API Endpoints (e.g., /api/chat)
│   │   └── utils/            # Helper functions (Validators, error handlers)
│   ├── index.js              # Server entry point
│   ├── .env                  # Backend environment variables
│   └── package.json          # Backend dependencies (express, mongoose, openai, etc.)
└── frontend/                 # Client-side code (React + Vite)
    ├── public/               # Static assets folder
    ├── src/
    │   ├── components/       # Reusable UI components (ChatWindow, Sidebar, etc.)
    │   ├── pages/            # Application views (Home, Chat, Login/Signup)
    │   ├── utils/            # API wrappers and frontend helpers
    │   ├── App.jsx           # Main React component
    │   ├── index.css         # Global styles
    │   └── main.jsx          # React DOM entry point
    ├── .env                  # Frontend environment variables
    ├── vite.config.js        # Vite build configuration
    └── package.json          # Frontend dependencies (react, axios, react-router-dom)
```

## ⚙️ Installation & Setup (Install Kaise Karein)

Follow these steps to get the project up and running locally.

### Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
You will also need an [OpenAI API Key](https://platform.openai.com/account/api-keys).

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ChatGPT_OpenAI-APIs
```

### 2. Backend Setup
Navigate to the `backend` directory, install dependencies, and setup environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and add the following configuration:
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORGANIZATION_ID=your_openai_org_id (optional)
JWT_SECRET=your_jwt_secret
```

Start the backend development server:
```bash
npm run dev
# or
npm start
```

### 3. Frontend Setup
Open a new terminal session, navigate to the `frontend` directory, and install dependencies.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (optional depending on your Vite setup):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the React dev server:
```bash
npm run dev
```

## 🚀 Key Libraries and Commands

To install dependencies manually, you can use these commands:

**For Backend:**
```bash
cd backend
npm install express mongoose openai dotenv cors jsonwebtoken bcrypt cookie-parser
npm install --save-dev nodemon
```

**For Frontend:**
```bash
cd frontend
npm install axios react-router-dom react-hot-toast @mui/material @emotion/react @emotion/styled
```

## 💡 How it works
1. **Frontend:** User types a prompt. React uses Axios to send a POST request to your backend proxy.
2. **Backend:** Express receives the authenticated request and safely passes the prompt along with your `OPENAI_API_KEY` to the OpenAI API servers.
3. **OpenAI API:** Processes the text and sends back a response.
4. **Database:** (Optional) Backend saves the Chat logs to MongoDB so users can view their chat history later.
5. **Result:** Backend responds to the React Frontend, updating the Chat UI dynamically.