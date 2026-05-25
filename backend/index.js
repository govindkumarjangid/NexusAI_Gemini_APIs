import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/configs/db.js';
import userRoutes from './src/routes/user.route.js';
import chatRoutes from './src/routes/chat.route.js';
import messageRoutes from './src/routes/messge.route.js';


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['https://nexus-ai-gemini-ap-is.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to NexusAI API');
});
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/messages', messageRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

await startServer();



const API_KEY = process.env.GEMINI_API_KEY;

async function getModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        console.log("=== Available Models ===");
        data.models.forEach(model => {
            console.log(`\nModel Name: ${model.name}`);
            console.log(`Description: ${model.description}`);
            console.log(`Input Tokens Limit: ${model.inputTokenLimit}`);
        });
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

getModels();