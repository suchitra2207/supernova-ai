import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// Gemini Client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Health Check
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Generate Career Report
app.post("/generate", async (req, res) => {

    try {

        const {
            name,
            education,
            field,
            interests,
            skills,
            goal
        } = req.body;

        const prompt = `
You are an expert AI Career Advisor.

Return ONLY valid JSON.

{
  "careerMatchScore":"95%",
  "topCareer":"AI Product Manager",
  "why":"Explain why this career fits.",
  "skillsToDevelop":["Skill 1","Skill 2","Skill 3"],
  "roadmap":["Step 1","Step 2","Step 3","Step 4"],
  "certifications":["Certification 1","Certification 2"]
}

Student:

Name: ${name}
Education: ${education}
Field of Study: ${field}
Interests: ${interests}
Skills: ${skills}
Dream Career: ${goal}

Return JSON only.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const text =
            typeof response.text === "function"
                ? await response.text()
                : response.text;

        console.log("\nGemini Response:\n");
        console.log(text);

        const cleaned = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const report = JSON.parse(cleaned);

        res.json({
            success: true,
            result: report
        });

    } catch (error) {

        console.error("\n========== ERROR ==========");
        console.error(error);
        console.error("===========================\n");

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
