import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const getApiResponse = async (message) => {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: message,
        });

        return response.text;

    } catch (err) {
        console.error("GEMINI ERROR:", err);
        throw err;
    }
};

export default getApiResponse;