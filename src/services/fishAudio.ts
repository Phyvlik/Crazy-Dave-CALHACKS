const FISH_AUDIO_API_KEY = 'a1565933c2f54de88f6c5991c73939bd';
// Reference voice ID - Using Dave voice from Fish Audio
// This is the voice model to use for Dr. Mooolittle's analysis
const REFERENCE_VOICE_ID = import.meta.env.VITE_FISH_REFERENCE_ID || '30c1f3e90f0f4a948baa2262531dc1c0';

export async function generateBotanistSpeech(explanation: string): Promise<string | null> {
  if (!FISH_AUDIO_API_KEY) {
    console.log('Fish Audio API key not configured');
    return null;
  }

  try {
    console.log('Generating botanist speech...');
    
    // Build request body - follow Fish Audio docs exactly
    const requestBody: any = {
      text: explanation,
      format: 'mp3',
      reference_id: REFERENCE_VOICE_ID  // Use Dave's voice model
    };
    
    // Use proxy server to avoid CORS issues
    const response = await fetch('http://localhost:3001/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fish Audio API error:', response.status, errorText);
      throw new Error(`Fish Audio API failed: ${response.status} ${errorText}`);
    }

    console.log('Fish Audio API call successful');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Fish Audio generation error:', error);
    return null;
  }
}

import * as Tone from 'tone';

export interface GardenResponse {
  explanation: string;
  frequency: number;
}

export async function playGardenSound(response: GardenResponse): Promise<void> {
  try {
    // Try to generate botanist speech via Fish Audio
    const speechUrl = await generateBotanistSpeech(response.explanation);

    if (speechUrl) {
      // If we got a usable speech URL, play it
      return new Promise((resolve) => {
        const speech = new Audio(speechUrl);

        speech.onended = () => {
          resolve();
        };

        speech.onerror = async (error) => {
          console.error('Error playing speech audio:', error);
          // Fall back to browser TTS
          await speakWithBrowser(response.explanation);
          resolve();
        };

        // Start playing Dave's voice
        speech.play().catch(async (err) => {
          console.warn('Playback failed, using browser TTS:', err);
          await speakWithBrowser(response.explanation);
          resolve();
        });
      });
    } else {
      // No speech URL (API blocked / failed) — use browser TTS fallback
      await speakWithBrowser(response.explanation);
    }
  } catch (error) {
    console.error('Error in playGardenSound:', error);
    // Ensure we still attempt a fallback so UI doesn't just spin
    try {
      await speakWithBrowser(response.explanation);
    } catch (fatal) {
      console.error('Fatal error in fallback playback:', fatal);
    }
  }
}

// Browser SpeechSynthesis fallback (used when Fish Audio is blocked or fails)
async function speakWithBrowser(text: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('Browser SpeechSynthesis not available');
        return resolve();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e);
        resolve(); // resolve so we still proceed to play frequency
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('speakWithBrowser failed:', e);
      resolve();
    }
  });
}

// Generate and play a short melody derived from the provided text
export async function playSongFromText(text: string): Promise<void> {
  try {
    if (!text || text.trim().length === 0) {
      return;
    }

    await Tone.start();

    // Simple mapping: derive numbers from character codes, map into a pentatonic scale
    const scale = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'];
    const chars = Array.from(text);
    const notes = chars
      .map((c) => c.charCodeAt(0))
      .filter(n => !isNaN(n))
      .slice(0, 12)
      .map(n => scale[n % scale.length]);

    if (notes.length === 0) {
      return;
    }

    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.5 }
    }).toDestination();

    // Play each note sequentially
    for (const note of notes) {
      try {
        synth.triggerAttackRelease(note, '8n');
        // Wait a bit between notes
        await new Promise((res) => setTimeout(res, 250));
      } catch (e) {
        console.error('Error playing note', note, e);
      }
    }

    // short finish: play a chord based on first and last note
    try {
      const first = notes[0];
      const last = notes[notes.length - 1];
      const chordSynth = new Tone.PolySynth().toDestination();
      chordSynth.triggerAttackRelease([first, last], '1n');
    } catch (e) {
      // swallow
    }
  } catch (error) {
    console.error('playSongFromText error:', error);
  }
}
