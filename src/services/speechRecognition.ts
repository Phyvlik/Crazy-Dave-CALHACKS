// Browser speech recognition for transcribing animal sounds
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not available');
      resolve('moo'); // Default fallback
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcribed sound as:', transcript);
      resolve(transcript.toLowerCase());
    };

    recognition.onerror = (event: any) => {
      console.warn('Transcription error:', event.error);
      resolve('moo'); // Fallback on error
    };

    recognition.onend = () => {
      // If no result was received, use fallback
      resolve('moo');
    };

    // Convert blob to audio element and play it for recognition
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.onended = () => recognition.stop();
    audio.onerror = () => resolve('moo');

    recognition.start();
    audio.play().catch(() => resolve('moo'));
  });
}

// Simple mapping from common transcription words to animal types and a short meaning
export function detectAnimal(transcript: string): { animalType: 'cow' | 'dog' | 'cat' | 'bird' | 'unknown'; confidence: number; meaning: string } {
  const t = (transcript || '').toLowerCase().trim();

  const map: Record<string, { type: 'cow' | 'dog' | 'cat' | 'bird' } > = {
    // cows
    moo: { type: 'cow' },
    move: { type: 'cow' },
    moon: { type: 'cow' },
    // dogs
    woof: { type: 'dog' },
    ruff: { type: 'dog' },
    bark: { type: 'dog' },
    arf: { type: 'dog' },
    // cats
    meow: { type: 'cat' },
    miao: { type: 'cat' },
    purr: { type: 'cat' },
    // birds
    tweet: { type: 'bird' },
    chirp: { type: 'bird' },
    peep: { type: 'bird' }
  };

  if (!t) return { animalType: 'unknown', confidence: 0, meaning: 'No sound detected' };

  // exact matches first
  if (map[t]) {
    const at = map[t].type;
    const meaning = at === 'cow' ? 'Likely a bovine vocalization' : at === 'dog' ? 'Likely a canine vocalization' : at === 'cat' ? 'Likely a feline vocalization' : 'Likely an avian vocalization';
    return { animalType: at, confidence: 0.9, meaning };
  }

  // fuzzy contains
  for (const key of Object.keys(map)) {
    if (t.includes(key)) {
      const at = map[key].type;
      const meaning = at === 'cow' ? 'Likely a bovine vocalization' : at === 'dog' ? 'Likely a canine vocalization' : at === 'cat' ? 'Likely a feline vocalization' : 'Likely an avian vocalization';
      return { animalType: at, confidence: 0.7, meaning };
    }
  }

  return { animalType: 'unknown', confidence: 0.5, meaning: 'Unknown or ambiguous sound' };
}