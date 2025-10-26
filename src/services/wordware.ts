export interface WordwareAnalysis {
  report: string;
  growthFrequency: number;
  growthSound: string;
  isFriend?: boolean;
}

export async function analyzeWithWordware(transcription: string, isFriend?: boolean): Promise<WordwareAnalysis> {
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

    return parseWordwareResponse(fullResponse, transcription, isFriend);
  } catch (error) {
    console.error('Wordware analysis error:', error);
    return fallbackAnalysis(transcription, isFriend);
  }
}

function parseWordwareResponse(response: string, transcription: string, isFriend?: boolean): WordwareAnalysis {
  const frequencyMatch = response.match(/(\d+)\s*Hz/g);
  const soundMatch = response.match(/(Soothing|Gentle|Deep|Warm|Mystical|Lush|Harmonic|Resonant|Melodic|Pulsing)\s+\w+/g);

  const frequencies = frequencyMatch ? frequencyMatch.map(f => parseInt(f)) : [1000];
  const sounds = soundMatch || ['Soothing Cello'];

  return {
    report: response || fallbackAnalysis(transcription, isFriend).report,
    growthFrequency: frequencies[0] || 1000,
    growthSound: sounds[0] || 'Soothing Cello',
    isFriend
  };
}

function fallbackAnalysis(transcription: string, isFriend?: boolean): WordwareAnalysis {
  const friendSounds = ['Gentle Harp', 'Soothing Cello', 'Harmonic Flute', 'Warm Bassoon', 'Melodic Violin'];
  const enemySounds = ['Death Metal', 'Heavy Electric Guitar', 'Distorted Bass', 'Pounding Drums', 'Chaotic Synth'];

  const sounds = isFriend ? friendSounds : enemySounds;
  const growthSound = sounds[Math.floor(Math.random() * sounds.length)];
  const growthFreq = isFriend ? Math.floor(Math.random() * 2000) + 1000 : Math.floor(Math.random() * 3000) + 2000;

  const friendReport = `Crazy Dave Analysis 

  Analyzing the '${transcription}' vocalization... Fascinating! This sound like friend!

  Dave feel happy and play his lovely music! ${growthSound} with ${growthFreq} Hz!`;

  const enemyReport = `Crazy Dave Analysis 

  Analyzing the '${transcription}' vocalization... OH NO! This sound like ENEMY!

  Dave feel scared and play AGGRESSIVE music to protect garden! ${growthSound} with ${growthFreq} Hz!`;

  return {
    report: isFriend ? friendReport : enemyReport,
    growthFrequency: growthFreq,
    growthSound,
    isFriend
  };
}
