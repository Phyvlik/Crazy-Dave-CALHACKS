// Browser speech recognition for transcribing animal sounds
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
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