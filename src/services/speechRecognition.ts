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
export function detectAnimal(transcript: string): { animalType: 'cow' | 'sheep' | 'cat' | 'goat' | 'chicken' | 'unknown'; confidence: number; meaning: string; isFriend: boolean } {
  const t = (transcript || '').toLowerCase().trim();

  // If no speech was detected, return unknown instead of defaulting to cow
  if (!t || t.length < 2) return { animalType: 'unknown', confidence: 0, meaning: 'No sound detected', isFriend: false };

  // Define animal keywords grouped by type
  const animalKeywords = {
    goat: {
      exact: ['sui', 'siu', 'ronaldo', 'cristiano ronaldo', 'swee', 'swweee', 'siuu', 'siuuu', 'shui', 'shu', 'ee', 'eeee', 'eeeee'],
      partial: ['ronaldo', 'cristiano', 'sui', 'siu', 'swee', 'goat', 'g.o.a.t', 'bleat', 'naa', 'naaa', 'aaa', 'eee']
    },
    sheep: {
      exact: ['baa', 'baaa', 'bleat', 'meh', 'bahhh', 'baaaa', 'baaaaa', 'baah', 'beh', 'behhh', 'bahh', 'buhh'],
      partial: ['sheep', 'baa', 'bleat', 'meh', 'wool', 'flock', 'ewe', 'ram', 'buh', 'baa', 'naa', 'lamb', 'fleece']
    },
    chicken: {
      exact: ['cluck', 'clucking', 'bawk', 'bawking', 'bock', 'bocking', 'bok', 'bokking', 'cock', 'cocking'],
      partial: ['chicken', 'cluck', 'bawk', 'bock', 'bok', 'cock', 'hen', 'rooster', 'clucking', 'bawking', 'coop']
    },
    cat: {
      exact: ['meow', 'miao', 'purr', 'meaow', 'meeyaw', 'meeyow', 'meeeya', 'myaw', 'meeyav', 'myav', 'mew', 'meew'],
      partial: ['cat', 'meow', 'purr', 'mew', 'feline', 'meowing', 'purrr']
    },
    cow: {
      exact: ['moo', 'move', 'moon', 'mu', 'muu', 'muuu', 'mooo', 'mooooo', 'moooo', 'muuuu'],
      partial: ['cow', 'moo', 'mu', 'move', 'bovine', 'cattle', 'moooo']
    }
  };

  const getMeaning = (animalType: string): { meaning: string; isFriend: boolean } => {
    switch (animalType) {
      case 'goat':
        return { meaning: 'Cristiano Ronaldo - The G.O.A.T. (Greatest Of All Time)! ⚽🐐', isFriend: true };
      case 'sheep':
        return { meaning: 'Likely an ovine vocalization', isFriend: false };
      case 'chicken':
        return { meaning: 'Feathered clucking friend! 🐔', isFriend: true };
      case 'cat':
        return { meaning: 'Likely a feline vocalization', isFriend: true };
      case 'cow':
        return { meaning: 'Likely a bovine vocalization', isFriend: false };
      default:
        return { meaning: 'Unknown or ambiguous sound', isFriend: false };
    }
  };

  // Step 1: Check GOAT exact matches FIRST (highest priority)
  for (const keyword of animalKeywords.goat.exact) {
    if (t === keyword) {
      const { meaning, isFriend } = getMeaning('goat');
      return { animalType: 'goat', confidence: 0.95, meaning, isFriend };
    }
  }

  // Step 2: Check GOAT partial matches (BEFORE all other animals)
  for (const keyword of animalKeywords.goat.partial) {
    if (t.includes(keyword)) {
      const { meaning, isFriend } = getMeaning('goat');
      return { animalType: 'goat', confidence: 0.85, meaning, isFriend };
    }
  }

  // Step 3: Check CHICKEN exact matches
  for (const keyword of animalKeywords.chicken.exact) {
    if (t === keyword) {
      const { meaning, isFriend } = getMeaning('chicken');
      return { animalType: 'chicken', confidence: 0.95, meaning, isFriend };
    }
  }

  // Step 4: Check CHICKEN partial matches
  for (const keyword of animalKeywords.chicken.partial) {
    if (t.includes(keyword)) {
      const { meaning, isFriend } = getMeaning('chicken');
      return { animalType: 'chicken', confidence: 0.85, meaning, isFriend };
    }
  }

  // Step 5: Check other exact matches
  for (const [animal, keywords] of Object.entries(animalKeywords)) {
    if (animal === 'goat' || animal === 'chicken') continue; // Skip goat and chicken, already checked
    if (keywords.exact.includes(t)) {
      const { meaning, isFriend } = getMeaning(animal);
      return { animalType: animal as 'cow' | 'sheep' | 'cat', confidence: 0.95, meaning, isFriend };
    }
  }

  // Step 6: Check other partial matches, prioritizing by specificity
  // Check SHEEP
  for (const keyword of animalKeywords.sheep.partial) {
    if (t.includes(keyword)) {
      const { meaning, isFriend } = getMeaning('sheep');
      return { animalType: 'sheep', confidence: 0.85, meaning, isFriend };
    }
  }

  // Check CAT
  for (const keyword of animalKeywords.cat.partial) {
    if (t.includes(keyword)) {
      const { meaning, isFriend } = getMeaning('cat');
      return { animalType: 'cat', confidence: 0.85, meaning, isFriend };
    }
  }

  // Check COW last (to avoid false positives with other animals)
  for (const keyword of animalKeywords.cow.partial) {
    if (t.includes(keyword)) {
      const { meaning, isFriend } = getMeaning('cow');
      return { animalType: 'cow', confidence: 0.85, meaning, isFriend };
    }
  }

  const { meaning, isFriend } = getMeaning('unknown');
  return { animalType: 'unknown', confidence: 0.5, meaning, isFriend };
}