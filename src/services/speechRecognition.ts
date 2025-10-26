// Browser speech recognition for transcribing animal sounds
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not available');
      resolve('moo'); // Default to moo if not available
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    let hasResult = false;
    let timeoutId: NodeJS.Timeout;

    recognition.onresult = (event: any) => {
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (transcript && transcript.trim().length > 0) {
          hasResult = true;
          clearTimeout(timeoutId);
          resolve(transcript.toLowerCase());
          return;
        }
      }
    };

    recognition.onerror = () => {
      clearTimeout(timeoutId);
      resolve('moo'); // Default to moo on error
    };

    recognition.onend = () => {
      clearTimeout(timeoutId);
      if (!hasResult) {
        resolve('moo'); // Default to moo if nothing detected
      }
    };

    // Start recognition immediately
    recognition.start();

    // Convert blob to audio element and play it for recognition
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.volume = 0; // Mute it since we're just using it for timing
    
    audio.onended = () => {
      recognition.stop();
    };

    audio.onerror = () => {
      clearTimeout(timeoutId);
      resolve('moo');
    };

    // Play audio with a small delay to ensure recognition is started
    setTimeout(() => {
      audio.play().catch(() => {
        clearTimeout(timeoutId);
        resolve('moo');
      });
    }, 100);

    // Set a timeout to stop recognition if nothing is detected after 5 seconds
    timeoutId = setTimeout(() => {
      recognition.stop();
    }, 5000);
  });
}

// Simple mapping from common transcription words to animal types and a short meaning
export function detectAnimal(transcript: string): { animalType: 'cow' | 'sheep' | 'cat' | 'goat' | 'unknown'; confidence: number; meaning: string } {
  const t = (transcript || '').toLowerCase().trim();

  // If no speech was detected, return unknown instead of defaulting to cow
  if (!t || t.length < 2) return { animalType: 'unknown', confidence: 0, meaning: 'No sound detected' };

  // Define animal keywords grouped by type
  const animalKeywords = {
    goat: {
      exact: ['sui', 'siu', 'ronaldo', 'cristiano ronaldo', 'swee', 'swweee', 'siuu', 'siuuu'],
      partial: ['ronaldo', 'cristiano', 'sui', 'siu', 'swee', 'goat', 'g.o.a.t']
    },
    sheep: {
      exact: ['baa', 'baaa', 'bleat', 'meh', 'bahhh'],
      partial: ['sheep', 'baa', 'bleat', 'meh']
    },
    cat: {
      exact: ['meow', 'miao', 'purr', 'meaow'],
      partial: ['cat', 'meow', 'purr']
    },
    cow: {
      exact: ['moo', 'move', 'moon', 'mu', 'muu', 'muuu', 'mooo'],
      partial: ['cow', 'moo', 'mu', 'move']
    }
  };

  const getMeaning = (animalType: string) => {
    switch (animalType) {
      case 'goat':
        return 'Cristiano Ronaldo - The G.O.A.T. (Greatest Of All Time)! ⚽🐐';
      case 'sheep':
        return 'Likely an ovine vocalization';
      case 'cat':
        return 'Likely a feline vocalization';
      case 'cow':
        return 'Likely a bovine vocalization';
      default:
        return 'Unknown or ambiguous sound';
    }
  };

  // Step 1: Check GOAT exact matches FIRST (highest priority)
  for (const keyword of animalKeywords.goat.exact) {
    if (t === keyword) {
      return { animalType: 'goat', confidence: 0.95, meaning: getMeaning('goat') };
    }
  }

  // Step 2: Check GOAT partial matches (BEFORE all other animals)
  for (const keyword of animalKeywords.goat.partial) {
    if (t.includes(keyword)) {
      return { animalType: 'goat', confidence: 0.85, meaning: getMeaning('goat') };
    }
  }

  // Step 3: Check other exact matches
  for (const [animal, keywords] of Object.entries(animalKeywords)) {
    if (animal === 'goat') continue; // Skip goat, already checked
    if (keywords.exact.includes(t)) {
      return { animalType: animal as 'cow' | 'sheep' | 'cat', confidence: 0.95, meaning: getMeaning(animal) };
    }
  }

  // Step 4: Check other partial matches, prioritizing by specificity
  // Check SHEEP
  for (const keyword of animalKeywords.sheep.partial) {
    if (t.includes(keyword)) {
      return { animalType: 'sheep', confidence: 0.85, meaning: getMeaning('sheep') };
    }
  }

  // Check CAT
  for (const keyword of animalKeywords.cat.partial) {
    if (t.includes(keyword)) {
      return { animalType: 'cat', confidence: 0.85, meaning: getMeaning('cat') };
    }
  }

  // Check COW last (to avoid false positives with other animals)
  for (const keyword of animalKeywords.cow.partial) {
    if (t.includes(keyword)) {
      return { animalType: 'cow', confidence: 0.85, meaning: getMeaning('cow') };
    }
  }

  return { animalType: 'unknown', confidence: 0.5, meaning: 'Unknown or ambiguous sound' };
}