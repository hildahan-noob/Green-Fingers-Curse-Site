import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini AI endpoint for Plant Expert advice
  app.post("/api/plant-expert", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback response if GEMINI_API_KEY is not configured yet
        return res.json({
          reply: `Expert Advice on "${prompt}": For healthy foliage, place your plant in bright indirect light and maintain 50-70% humidity. Water thoroughly when the top 2 inches of soil feel dry!`
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert botanical consultant and master gardener at Noi Gardens. Respond concisely (max 3 short sentences) with practical, accurate plant care advice regarding: ${prompt}`,
      });

      const reply = response.text || "Ensure adequate drainage, bright indirect light, and avoid overwatering!";
      return res.json({ reply });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.json({
        reply: "For healthy indoor plants, maintain proper soil drainage, avoid harsh direct afternoon sun, and mist leaves regularly in dry environments."
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Noi Gardens" });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
