import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export default genAI;