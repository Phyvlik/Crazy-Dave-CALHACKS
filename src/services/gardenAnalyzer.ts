import { GardenResponse } from './fishAudio';

const WORDWARE_API_KEY = 'ww-9BceEazOCdcW2X2cwPFC1AJUiXdSrr2cg5nBRDmAlSEkbWF2kKNYpq';

interface WordwareResponse {
  content: string;
}

export async function analyzeGardenSound(mode: 'grow' | 'guard'): Promise<GardenResponse> {
  console.log('Starting garden sound analysis for mode:', mode);
  
  if (!WORDWARE_API_KEY) {
    console.log('No Wordware API key, using fallback response');
    return getFallbackResponse(mode);
  }

  const prompt = mode === 'grow'
    ? "You are a wacky AI botanist. A user made a friendly animal sound. Invent a funny, fake-scientific reason why this sound is good for plants and recommend a growth frequency (between 1000Hz and 5000Hz)."
    : "You are a wacky AI pest-control-expert. A user made a predator animal sound. Invent a funny, fake-scientific reason why this sound scares pests and recommend a deterrent frequency (between 20,000Hz and 25,000Hz).";

  try {
    const response = await fetch('https://api.wordware.ai/v1alpha/prompts/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WORDWARE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Wordware API failed');
    }

    console.log('Wordware API response received');
    const data = await response.json() as WordwareResponse;
    console.log('Wordware response data:', data);
    const result = parseWordwareResponse(data.content, mode);
    console.log('Parsed response:', result);
    return result;
  } catch (error) {
    console.error('Wordware analysis error:', error);
    console.log('Using fallback response');
    return getFallbackResponse(mode);
  }
}

function parseWordwareResponse(response: string, mode: 'grow' | 'guard'): GardenResponse {
  // Extract frequency from response using regex
  const frequencyMatch = response.match(/(\d+)\s*Hz/);
  const frequency = frequencyMatch 
    ? parseInt(frequencyMatch[1])
    : mode === 'grow' ? 1432 : 22000;

  return {
    explanation: response,
    frequency,
    mode
  };
}

function getFallbackResponse(mode: 'grow' | 'guard'): GardenResponse {
  if (mode === 'grow') {
    return {
      explanation: "Fascinating! Your gentle vocalization produces alpha waves that match the natural resonance of growing leaves. I'll generate a 1432 Hz tone - the exact frequency of a happy plant's photosynthesis dance!",
      frequency: 1432,
      mode: 'grow'
    };
  } else {
    return {
      explanation: "Aha! That fierce sound perfectly mimics the ultrasonic signature of the dreaded Garden Velociraptor - a pest's worst nightmare! I'll generate a 22,000 Hz deterrent frequency that will make those nibbling rabbits think twice!",
      frequency: 22000,
      mode: 'guard'
    };
  }
}