export interface WordwareAnalysis {
  report: string;
  growthFrequency: number;
  growthSound: string;
  deterrentFrequency: number;
  deterrentSound: string;
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
  const soundMatch = response.match(/(Soothing|Gentle|Deep|Warm|Mystical|Grumbling|Angry|Hissing|Growling|Buzzing)\s+\w+/g);

  const frequencies = frequencyMatch ? frequencyMatch.map(f => parseInt(f)) : [1000, 22000];
  const sounds = soundMatch || ['Soothing Cello', 'Grumbling Badger'];

  return {
    report: response || fallbackAnalysis(transcription).report,
    growthFrequency: frequencies[0] || 1000,
    growthSound: sounds[0] || 'Soothing Cello',
    deterrentFrequency: frequencies[1] || 22000,
    deterrentSound: sounds[1] || 'Grumbling Badger'
  };
}

function fallbackAnalysis(transcription: string): WordwareAnalysis {
  const sounds = ['Soothing Cello', 'Gentle Harp', 'Deep Tuba', 'Warm Bassoon', 'Mystical Flute'];
  const deterrents = ['Grumbling Badger', 'Angry Hawk', 'Hissing Snake', 'Growling Wolf', 'Buzzing Hornet'];

  const growthSound = sounds[Math.floor(Math.random() * sounds.length)];
  const deterrentSound = deterrents[Math.floor(Math.random() * deterrents.length)];
  const growthFreq = Math.floor(Math.random() * 4000) + 1000;
  const deterrentFreq = Math.floor(Math.random() * 8000) + 18000;

  const report = `Fascinating! The '${transcription}' vocalization shows a clear Lactonic-Frequency-Modulation pattern.

For optimal growth, this plant requires a '${growthSound}' resonance at ${growthFreq} Hz to stimulate cellular 'moo-vement' and enhance photosynthetic efficiency.

To deter herbivorous pests, we must mimic its natural predator: a '${deterrentSound}' at ${deterrentFreq} Hz. This ultrasonic frequency will create an invisible acoustic barrier around your botanical specimens.`;

  return {
    report,
    growthFrequency: growthFreq,
    growthSound,
    deterrentFrequency: deterrentFreq,
    deterrentSound
  };
}
