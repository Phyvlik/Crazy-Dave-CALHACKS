import { GardenResponse } from './fishAudio';

const WORDWARE_API_KEY = 'ww-9BceEazOCdcW2X2cwPFC1AJUiXdSrr2cg5nBRDmAlSEkbWF2kKNYpq';

const GROW_MODE_PROMPT = `You are a wacky AI botanist. A user made a friendly animal sound. 
Invent a funny, fake-scientific reason why this sound is good for plants and recommend a growth 
frequency (between 1000Hz and 5000Hz). Response should be in format:
{
  "explanation": "[Your funny explanation]",
  "frequency": [Your recommended frequency]
}`;

const GUARD_MODE_PROMPT = `You are a wacky AI pest-control-expert. A user made a predator animal sound. 
Invent a funny, fake-scientific reason why this sound scares pests and recommend a deterrent 
frequency (between 20000Hz and 25000Hz). Response should be in format:
{
  "explanation": "[Your funny explanation]",
  "frequency": [Your recommended frequency]
}`;

export async function analyzeGardenSound(mode: 'grow' | 'guard'): Promise<GardenResponse> {
  const prompt = mode === 'grow' ? GROW_MODE_PROMPT : GUARD_MODE_PROMPT;
  
  try {
    console.log('Calling Wordware API for', mode, 'mode analysis');
    const response = await fetch('https://api.wordware.ai/v1alpha/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WORDWARE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ]
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

    try {
      const jsonResponse = JSON.parse(fullResponse);
      return {
        explanation: jsonResponse.explanation,
        frequency: jsonResponse.frequency,
        mode
      };
    } catch (e) {
      console.error('Error parsing Wordware response:', e);
      return getFallbackResponse(mode);
    }

  } catch (error) {
    console.error('Wordware analysis error:', error);
    return getFallbackResponse(mode);
  }
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