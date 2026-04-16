import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
        {
            messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
            role: { type: String, enum: ['user', 'assistant'], required: true },
            content: { type: String, required: true },
        }
    ],
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;