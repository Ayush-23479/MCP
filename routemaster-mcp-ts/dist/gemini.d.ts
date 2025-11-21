interface GeminiResponse {
    text: string;
    success: boolean;
    error?: string;
}
export declare function callGemini(prompt: string): Promise<GeminiResponse>;
export declare function analyzeWithGemini(data: any, query: string): Promise<GeminiResponse>;
export {};
//# sourceMappingURL=gemini.d.ts.map