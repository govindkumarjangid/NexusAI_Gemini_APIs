import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    title: { type: String, default: 'New Chat' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [
        {
            messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
            role: { type: String, enum: ['user', 'assistant'], required: true },
            content: { type: String },
            imageUrl: { type: String, default: '' },
        }
    ],
    isShared: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
    isPinned: { type: Boolean, default: false },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;