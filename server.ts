import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Prompt Enhancement Endpoint using Gemini 3.7 Flash
  app.post("/api/enhance-prompt", async (req, res) => {
    try {
      const { userPrompt, style, theme, deviceType, colors } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback enhancement if no API key is set yet
        const enriched = `${userPrompt || style} in high definition wallpaper style, ${style} aesthetic, ${theme} lighting mood, color palette: ${(colors || []).join(", ")}, ultra clean composition for ${deviceType} wallpaper.`;
        return res.json({ enhancedPrompt: enriched, source: "algorithmic" });
      }

      const promptText = `You are an elite wallpaper art director and prompt engineer.
Craft an exquisite, high-detail image generation prompt for a ${deviceType} wallpaper.
User idea: "${userPrompt || 'A stunning masterpiece wallpaper'}"
Style: "${style}"
Theme/Lighting: "${theme}" (e.g., dark/light, moody, golden hour, etc.)
Colors to highlight: "${(colors || []).join(', ')}"
Device aspect ratio: ${deviceType === 'mobile' ? '9:16 vertical orientation' : '16:9 widescreen orientation'}

Return ONLY a single concise, ultra-descriptive, highly visual prompt string (max 60 words) describing the lighting, textures, focal point, and atmosphere without any conversational filler or markdown quotes.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: promptText,
      });

      const enhanced = response.text?.trim() || userPrompt;
      res.json({ enhancedPrompt: enhanced, source: "gemini-3.7-flash" });
    } catch (error: any) {
      console.error("Enhance prompt error:", error);
      res.status(500).json({
        error: error.message || "Failed to enhance prompt",
        fallbackPrompt: req.body.userPrompt || `${req.body.style} ${req.body.theme} wallpaper`,
      });
    }
  });

  // AI Wallpaper Image Generation Endpoint using gemini-3.1-flash-lite-image
  app.post("/api/generate-ai-wallpaper", async (req, res) => {
    try {
      const { prompt, aspectRatio, style, theme, colors } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(400).json({
          error: "Gemini API key is not configured in Settings > Secrets. You can still use the built-in High-Def Procedural Engine for instant 4K wallpaper generation!",
        });
      }

      const mappedAspect = aspectRatio === "9:16" ? "9:16" : aspectRatio === "1:1" ? "1:1" : aspectRatio === "3:4" ? "3:4" : aspectRatio === "4:3" ? "4:3" : "16:9";

      const finalPrompt = `${prompt || `${style} art`} in ${style} wallpaper style, ${theme} mood, featuring color accents: ${(colors || []).join(", ")}, high definition wallpaper, centered composition, pristine negative space, 8k wallpaper`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: finalPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: mappedAspect,
          },
        },
      });

      let imageUrl: string | null = null;
      let modelText = "";

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || "image/png";
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          } else if (part.text) {
            modelText += part.text;
          }
        }
      }

      if (!imageUrl) {
        return res.status(422).json({
          error: "Model returned text instead of an image: " + (modelText || "Please try a different prompt."),
        });
      }

      res.json({
        imageUrl,
        prompt: finalPrompt,
        aspectRatio: mappedAspect,
      });
    } catch (error: any) {
      console.error("AI Wallpaper generation error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate AI wallpaper. Try again or use the Instant Studio generator.",
      });
    }
  });

  // Color Palette Suggestion endpoint
  app.post("/api/suggest-palette", async (req, res) => {
    try {
      const { mood, style } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          palette: ["#0f172a", "#38bdf8", "#818cf8", "#c084fc", "#f472b6"],
          name: "Algorithmic Vibe",
        });
      }

      const prompt = `Suggest a harmonious 5-color wallpaper palette for the style "${style}" and mood "${mood}".
Respond strictly in JSON format with an object containing:
- name: (a creative 2-3 word name for the palette)
- colors: (an array of 5 hex color strings e.g. ["#112233", "#445566", "#778899", "#aabbcc", "#ddeeff"])`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      res.json({
        palette: parsed.colors || ["#0f172a", "#38bdf8", "#818cf8", "#c084fc", "#f472b6"],
        name: parsed.name || `${style} ${mood}`,
      });
    } catch (err: any) {
      console.error("Palette suggestion error:", err);
      res.json({
        palette: ["#090d16", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899"],
        name: "Neon Horizon",
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EHSAAN ULLAH Wallpaper Generator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
