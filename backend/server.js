import express from "express";
import "dotenv/config";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
const app = express();
const PORT = 8080;
import chatRoutes from "./routes/chat.js";

app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);





// app.post("/test", async (req, res) => {
//     const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     });
//     try {
//         const response = await ai.models.generateContent({
//             model: "gemini-3.6-flash",
//             contents: req.body.message,
//         });

//         res.send(response.text);

//     } catch (err) {
//         console.error("GEMINI ERROR",err);
//         res.status(500).json({
//             error: err.message
//         });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    connectDB();
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected with Database");
    } catch (error) {
        console.log(error);
    }
}

