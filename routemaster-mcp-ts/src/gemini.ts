import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not set in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export async function callGemini(prompt: string): Promise<GeminiResponse> {
  try {
    console.log('📨 Calling Gemini API...');
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('✅ Gemini response received');
    
    return {
      text: responseText,
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Gemini API Error:', error.message);
    
    return {
      text: '',
      success: false,
      error: error.message,
    };
  }
}

// Function to get Gemini's analysis of your data
export async function analyzeWithGemini(data: any, query: string): Promise<GeminiResponse> {
  const prompt = `
    You are an AI assistant for a logistics management system.
    
    User Query: ${query}
    
    Context Data:
    ${JSON.stringify(data, null, 2)}
    
    Please provide a helpful analysis and recommendations.
  `;
  
  return callGemini(prompt);
}