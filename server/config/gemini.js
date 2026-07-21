import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let genAI = null;

export function getGeminiModel(modelName = 'gemini-2.0-flash', options = {}) {
  const currentKey = process.env.GEMINI_API_KEY;

  if (!currentKey || currentKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is missing or set to placeholder in .env file. Please add your Gemini API key to the .env file to enable AI generation.');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(currentKey);
  }

  return genAI.getGenerativeModel({
    model: modelName,
    ...options,
  });
}

export default genAI;
