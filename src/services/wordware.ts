export interface WordwareAnalysis {
  report: string;
  growthFrequency: number;
  growthSound: string;
}

export async function analyzeWithWordware(transcription: string): Promise<WordwareAnalysis> {
  const apiKey = import.meta.env.VITE_WORDWARE_API_KEY;
  const promptId = import.meta.env.VITE_WORDWARE_PROMPT_ID;

  if (!apiKey || !promptId || apiKey === 'your_wordware_api_key_here') {
    return fallbackAnalysis(transcription);
  }

  try {
    const response = await fetch(`https://api.wordware.ai/v1alpha/prompts/${promptId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          transcription: transcription
        }
      })
    });

    if (!response.ok) {
      throw new Error('Wordware API failed');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk' && data.value?.content) {
                fullResponse += data.value.content;
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    }

    return parseWordwareResponse(fullResponse, transcription);
  } catch (error) {
    console.error('Wordware analysis error:', error);
    return fallbackAnalysis(transcription);
  }
}

function parseWordwareResponse(response: string, transcription: string): WordwareAnalysis {
  const frequencyMatch = response.match(/(\d+)\s*Hz/g);
  const soundMatch = response.match(/(Soothing|Gentle|Deep|Warm|Mystical|Lush|Harmonic|Resonant|Melodic|Pulsing)\s+\w+/g);

  const frequencies = frequencyMatch ? frequencyMatch.map(f => parseInt(f)) : [1000];
  const sounds = soundMatch || ['Soothing Cello'];

  return {
    report: response || fallbackAnalysis(transcription).report,
    growthFrequency: frequencies[0] || 1000,
    growthSound: sounds[0] || 'Soothing Cello'
  };
}

function fallbackAnalysis(transcription: string): WordwareAnalysis {
  const sounds = ['Soothing Cello', 'Gentle Harp', 'Deep Tuba', 'Warm Bassoon', 'Mystical Flute'];

  const growthSound = sounds[Math.floor(Math.random() * sounds.length)];
  const growthFreq = Math.floor(Math.random() * 4000) + 1000;

  const report = `🌱 Dr. Mooolittle's Bio-Acoustic Analysis 🌱

Analyzing the '${transcription}' vocalization... Fascinating! This sound exhibits optimal growth-promoting characteristics.

For maximum botanical benefit, your plants require a '${growthSound}' resonance at ${growthFreq} Hz. This frequency stimulates cellular moo-vement, enhances photosynthetic efficiency, and promotes vigorous root development. 

Your garden is about to experience unprecedented growth! 🌿✨`;

  return {
    report,
    growthFrequency: growthFreq,
    growthSound
  };
}
