// app, datbase connection, and server setup
import express from 'express';
import connectDB from './configs/db.js';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Routes
app.use('/api/users', userRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();