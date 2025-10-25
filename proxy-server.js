import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/api/tts', async (req, res) => {
  try {
    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
        'Content-Type': 'application/json',
        'model': 's1',
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Fish Audio API error: ${response.statusText}`);
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