import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

if (process.env.GEMINI_API_KEY === undefined)
    throw new Error('GEMINI_API_KEY is not defined in the environment variables.')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default genAI;