import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // In-memory server-side cache for synthesized audio to minimize API calls
  const serverAudioCache = new Map<string, string>();

  // API endpoint for Gemini Studio High-Fidelity Arabic Text-to-Speech
  app.post('/api/tts', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Send only the clean Arabic text for synthesis; style instructions belong in speechMetadata
      const cleanArabicText = text.trim();

      // Check server cache first
      if (serverAudioCache.has(cleanArabicText)) {
        return res.json({ audio: serverAudioCache.get(cleanArabicText), mimeType: 'audio/wav', cached: true });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanArabicText,
                speechMetadata: {
                  style: 'Articulate, fluent, classical Arabic scholar reciting morphological conjugation forms and verbs with crystal-clear diacritics and vowels',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        serverAudioCache.set(cleanArabicText, base64Audio);
        return res.json({ audio: base64Audio, mimeType: 'audio/wav' });
      }

      return res.status(500).json({ error: 'No audio data returned from model' });
    } catch (err: any) {
      const errMsg = String(err?.message || err);
      console.warn('Gemini TTS warning / handled error:', errMsg);

      if (errMsg.includes('resource_exhausted') || errMsg.includes('quota') || errMsg.includes('429')) {
        return res.status(429).json({
          error: 'quota_exceeded',
          message: 'سقف سهمیه موقت هوش مصنوعی تکمیل است. تلفظ‌های کش‌شده بدون مشکل کار می‌کنند.',
        });
      }

      return res.status(500).json({ error: errMsg || 'Error generating Gemini TTS' });
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
