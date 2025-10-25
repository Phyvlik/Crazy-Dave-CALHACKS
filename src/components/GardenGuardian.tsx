import React, { useState } from 'react';
import { Leaf, Shield, Volume2, VolumeX } from 'lucide-react';
import { playGardenSound, playSongFromText, GardenResponse } from '../services/fishAudio';
import { analyzeWithWordware } from '../services/wordware';
import { transcribeAudio } from '../services/speechRecognition';

const GardenGuardian: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'grow' | 'guard'>('grow');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDetectedSound, setLastDetectedSound] = useState<{ mode: 'grow' | 'guard' | null, confidence: number }>({ mode: null, confidence: 0 });

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setIsProcessing(true);

      // We'll capture microphone audio and also run SpeechRecognition to get a transcript
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      // SpeechRecognition for live transcription (if available)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      let recognition: any = null;
      let transcript = '';

      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              transcript += res[0].transcript + ' ';
            } else {
              interim += res[0].transcript;
            }
          }
          console.log('Interim transcript:', interim);
        };

        recognition.onerror = (e: any) => console.warn('SpeechRecognition error:', e);
        recognition.start();
      }

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        // Stop recognition if running
        try {
          if (recognition) {
            recognition.stop();
          }
        } catch (e) {
          // ignore
        }

        // Release microphone
        stream.getTracks().forEach(track => track.stop());

        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Recorded audio URL:', audioUrl);

        console.log('Audio recorded');

        // First, try to transcribe the sound
        const transcript = await transcribeAudio(audioBlob);
        console.log('Transcribed sound as:', transcript);

        // Then analyze with Wordware to get our scientific response
        const analysis = await analyzeWithWordware(transcript);
        console.log('Wordware analysis:', analysis);

        // Set the mode based on the frequency ranges in the analysis
        const detectedMode = analysis.growthFrequency < 5000 ? 'grow' : 'guard';
        setSelectedMode(detectedMode);

        // Update last detected sound
        setLastDetectedSound({ 
          mode: detectedMode,
          confidence: detectedMode === 'grow' ? 0.8 : 0.9 // High confidence in our scientific analysis!
        });

        // Create the garden response from the Wordware analysis
        const gardenResponse: GardenResponse = {
          explanation: analysis.report,
          frequency: detectedMode === 'grow' ? analysis.growthFrequency : analysis.deterrentFrequency,
          mode: detectedMode as 'grow' | 'guard'
        };
        
        console.log('Playing garden response:', gardenResponse);

        // Play the AI botanist's explanation followed by the frequency
        await playGardenSound(gardenResponse);

        // After the frequency, play a short song based on the transcribed sound
        await playSongFromText(transcript);

        setIsProcessing(false);
      };

      // Start recording
      mediaRecorder.start();

      // Record for 3 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 3000);

    } catch (error) {
      console.error('Error in garden guardian:', error);
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Bio-Acoustic Garden Guardian
        </h2>
        <p className="text-gray-600 mb-6">
          Make an animal sound to generate either growth-promoting or pest-deterring frequencies
        </p>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedMode('grow')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              selectedMode === 'grow'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Leaf className="w-5 h-5" />
            Grow Mode
          </button>
          <button
            onClick={() => setSelectedMode('guard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              selectedMode === 'guard'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Shield className="w-5 h-5" />
            Guard Mode
          </button>
        </div>

        {/* Record Button */}
        <button
          onClick={startRecording}
          disabled={isProcessing}
          className={`
            relative w-32 h-32 rounded-full 
            ${isRecording ? 'bg-red-500' : 'bg-blue-500'} 
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}
            text-white font-bold text-lg
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-blue-300
          `}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mx-auto" />
          ) : (
            isRecording ? 'Recording...' : 'Record'
          )}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          {selectedMode === 'grow'
            ? "Make a friendly sound (like a gentle 'moo')"
            : "Make a predator sound (like an angry 'moo-moo')"}
        </p>

        {/* Sound Type Indicator */}
        {lastDetectedSound.mode && (
          <div className={`mt-6 flex items-center justify-center gap-2 ${
            lastDetectedSound.mode === 'grow' ? 'text-green-600' : 'text-red-600'
          }`}>
            {lastDetectedSound.mode === 'grow' ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
            <span className="font-medium">
              {lastDetectedSound.mode === 'grow' ? 'Friendly' : 'Threatening'} Sound Detected
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ({Math.round(lastDetectedSound.confidence * 100)}% confidence)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenGuardian;