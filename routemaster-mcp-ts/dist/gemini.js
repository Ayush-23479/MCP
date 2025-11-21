"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callGemini = callGemini;
exports.analyzeWithGemini = analyzeWithGemini;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not set in .env');
    process.exit(1);
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
async function callGemini(prompt) {
    try {
        console.log('📨 Calling Gemini API...');
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log('✅ Gemini response received');
        return {
            text: responseText,
            success: true,
        };
    }
    catch (error) {
        console.error('❌ Gemini API Error:', error.message);
        return {
            text: '',
            success: false,
            error: error.message,
        };
    }
}
// Function to get Gemini's analysis of your data
async function analyzeWithGemini(data, query) {
    const prompt = `
    You are an AI assistant for a logistics management system.
    
    User Query: ${query}
    
    Context Data:
    ${JSON.stringify(data, null, 2)}
    
    Please provide a helpful analysis and recommendations.
  `;
    return callGemini(prompt);
}
//# sourceMappingURL=gemini.js.map