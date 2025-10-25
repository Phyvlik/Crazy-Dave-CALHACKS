interface AudioResponse {
  explanation: string;
  frequency: number;
}

const FISH_AUDIO_API_KEY = 'a1565933c2f54de88f6c5991c73939bd';

export async function generateBotanistSpeech(mode: 'grow' | 'guard', explanation: string): Promise<string | null> {
  if (!FISH_AUDIO_API_KEY) {
    console.log('Fish Audio API key not configured');
    return null;
  }

  const voicePersonality = mode === 'grow' ? 
    'In an excited, enthusiastic botanist voice: ' :
    'In a serious, concerned pest control expert voice: ';

  try {
    console.log('Generating botanist speech for:', explanation);
    const response = await fetch('http://localhost:3001/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: voicePersonality + explanation,
        reference_id: mode,
        format: 'mp3',
        latency: 'normal'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fish Audio API error:', errorText);
      throw new Error(`Fish Audio API failed: ${errorText}`);
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
  mode: 'grow' | 'guard';
}

export async function playGardenSound(response: GardenResponse): Promise<void> {
  try {
    console.log('Starting playGardenSound with response:', response);

    // Try to generate botanist speech via Fish Audio
    console.log('Generating botanist speech...');
    const speechUrl = await generateBotanistSpeech(response.mode, response.explanation);

    const playFrequency = async () => {
      try {
        console.log('Starting Tone.js, playing frequency:', response.frequency);
        await Tone.start();
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(response.frequency, '2n');
      } catch (toneError) {
        console.error('Error playing frequency (Tone.js):', toneError);
      }
    };

    if (speechUrl) {
      // If we got a usable speech URL, play it then the frequency
      console.log('Speech generated successfully, playing audio from Fish Audio...');
      const speech = new Audio(speechUrl);

      speech.onended = async () => {
        await playFrequency();
      };

      speech.onerror = (error) => {
        console.error('Error playing speech audio:', error);
        // Fall back to browser TTS then play frequency
        speakWithBrowser(response.explanation).then(playFrequency).catch(err => console.error(err));
      };

      // Some browsers require user gesture to start audio; ensure errors are caught
      await speech.play().catch(async (err) => {
        console.warn('Playback via returned URL failed, falling back to browser TTS:', err);
        await speakWithBrowser(response.explanation);
        await playFrequency();
      });
    } else {
      // No speech URL (API blocked / failed) — use browser TTS fallback then play frequency
      console.warn('No speech URL generated from Fish Audio; using browser SpeechSynthesis fallback');
      await speakWithBrowser(response.explanation);
      await playFrequency();
    }
  } catch (error) {
    console.error('Error in playGardenSound:', error);
    // Ensure we still attempt a fallback so UI doesn't just spin
    try {
      await speakWithBrowser(response.explanation);
      await Tone.start();
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease(response.frequency, '2n');
    } catch (fatal) {
      console.error('Fatal error in fallback playback:', fatal);
    }
  }
}

// Browser SpeechSynthesis fallback (used when Fish Audio is blocked or fails)
async function speakWithBrowser(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
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
      console.warn('No text provided for song generation');
      return;
    }

    console.log('Generating melody from text:', text);
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
      console.warn('No notes generated from text');
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
