import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const FISH_AUDIO_API_KEY = process.env.FISH_AUDIO_API_KEY;

if (!FISH_AUDIO_API_KEY) {
  console.error('Error: FISH_AUDIO_API_KEY not found in environment variables');
  process.exit(1);
}

app.post('/api/tts', async (req, res) => {
  try {
    console.log('Received TTS request:', req.body);

    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FISH_AUDIO_API_KEY}`,
        'Content-Type': 'application/json',
        'model': 's1',
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fish Audio API error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const audioBuffer = await response.buffer();
    res.set('Content-Type', 'audio/mp3');
    res.send(audioBuffer);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});