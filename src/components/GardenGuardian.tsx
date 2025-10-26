import React, { useState } from 'react';
import { playGardenSound, playSongFromText, GardenResponse } from '../services/fishAudio';
import { analyzeWithWordware } from '../services/wordware';
import type { WordwareAnalysis } from '../services/wordware';
import { transcribeAudio, detectAnimal } from '../services/speechRecognition';

const GardenGuardian: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionDisplay, setTranscriptionDisplay] = useState<{ transcript: string; animalType: string; meaning: string; confidence: number; isFriend: boolean } | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<WordwareAnalysis | null>(null);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setIsProcessing(true);

      // We'll capture microphone audio and also run SpeechRecognition to get a transcript
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      // We'll use the blob-based transcription (transcribeAudio) after recording finishes.

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        // Release microphone
        stream.getTracks().forEach(track => track.stop());

        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Recorded audio URL:', audioUrl);

  console.log('Audio recorded');

  // First, try to transcribe the sound from the recorded blob
  const transcriptText = await transcribeAudio(audioBlob);
  console.log('Transcribed sound as:', transcriptText);

  // Detect probable animal type from the transcript
  const detected = detectAnimal(transcriptText);
  console.log('Detected animal from transcript:', detected);
  setTranscriptionDisplay({ transcript: transcriptText, animalType: detected.animalType, meaning: detected.meaning, confidence: detected.confidence, isFriend: detected.isFriend });

  // Then analyze with Wordware to get our scientific response
  const analysis = await analyzeWithWordware(transcriptText, detected.isFriend);
  console.log('Wordware analysis:', analysis);
  setLatestAnalysis(analysis);

        // Set the mode to grow (only mode now)
        // const detectedMode = 'grow';

        // Create the garden response from the Wordware analysis
        const gardenResponse: GardenResponse = {
          explanation: analysis.report,
          frequency: analysis.growthFrequency
        };
        
        console.log('Playing garden response:', gardenResponse);

        // Play the AI botanist's explanation followed by the frequency
        await playGardenSound(gardenResponse);

  // After the frequency, play a short song based on the transcribed sound
  await playSongFromText(transcriptText);

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
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="font-bold text-black mb-4" style={{ fontSize: '28px' }}>
          Make ANY farm animal sound (cow, cat, goat) to unlock growth-promoting frequencies for your plants
        </p>

        {/* Info Box */}
        <div className="xp-panel p-4 mb-4 text-left text-black">
          <p className="font-bold mb-2" style={{ fontSize: '28px' }}>💡 HOW IT WORKS:</p>
          <p style={{ fontSize: '26px' }}>Record your farm animal sound. Crazy Dave analyzes it and generates a custom growth frequency for your plants!</p>
        </div>

        {/* Record Button */}
        <button
          onClick={startRecording}
          disabled={isProcessing}
          className="xp-button-large text-lg font-bold mb-4"
          style={{ width: '100%', padding: '12px 24px', fontSize: '24px' }}
        >
          {isProcessing ? (
            <span className="xp-loading inline-block">► PROCESSING...</span>
          ) : (
            isRecording ? '◼ RECORDING...' : '► RECORD'
          )}
        </button>

        <p className="text-gray-700 italic font-bold" style={{ fontSize: '24px' }}>
          🎤 Speak into your microphone now!
        </p>
      </div>

      {/* Transcription & Analysis Display */}
      {transcriptionDisplay && (
        <div className="xp-window">
          <div className="xp-title-bar" style={{ fontSize: '20px' }}>🔍 SOUND ANALYSIS RESULTS</div>
          <div className="bg-gray-300 p-4 space-y-3 text-left">
            <p style={{ fontSize: '22px' }}><span className="font-bold">📢 HEARD:</span> "{transcriptionDisplay.transcript}"</p>
            <p style={{ fontSize: '22px' }}><span className="font-bold">🦁 DETECTED:</span> {transcriptionDisplay.animalType.toUpperCase()} ({Math.round(transcriptionDisplay.confidence * 100)}%)</p>
            <p style={{ fontSize: '22px' }}><span className="font-bold">📝 MEANING:</span> {transcriptionDisplay.meaning}</p>
            <p style={{ fontSize: '22px' }}><span className="font-bold">{transcriptionDisplay.isFriend ? '👍 FRIEND' : '⚠️ NOT FRIEND'}</span>: {transcriptionDisplay.isFriend ? 'Welcome to the garden! 🌿' : 'Stay away from the plants! 🚫'}</p>
            {latestAnalysis && (
              <div className="xp-panel p-3 bg-blue-100 text-black space-y-2">
                {/* Analysis Display */}
                <div className="xp-window mb-4">
                  <p className="font-bold" style={{ fontSize: '24px' }}>🧪 CRAZY DAVE'S REPORT:</p>
                  <p className="whitespace-pre-wrap leading-tight" style={{ fontSize: '20px' }}>{latestAnalysis.report}</p>
                  <p className="font-bold" style={{ fontSize: '24px' }}>📊 GROWTH FREQUENCY: {latestAnalysis.growthFrequency} Hz</p>
                  <p className="text-gray-700" style={{ fontSize: '20px' }}>🔊 Sound: {latestAnalysis.growthSound}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenGuardian;