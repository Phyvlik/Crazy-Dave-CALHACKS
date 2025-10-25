import { useState, useRef } from 'react';
import { Mic, StopCircle } from 'lucide-react';

interface AudioRecorderProps {
  isRecording: boolean;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

function AudioRecorder({
  isRecording,
  onRecordingStart,
  onRecordingStop,
  onRecordingComplete,
  disabled
}: AudioRecorderProps) {
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      onRecordingStart();
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to record your moo!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      onRecordingStop();

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`
            relative w-32 h-32 rounded-full flex items-center justify-center
            transition-all duration-300 transform hover:scale-105
            ${isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-green-500 hover:bg-green-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            shadow-2xl
          `}
        >
          {isRecording ? (
            <StopCircle className="w-16 h-16 text-white" />
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </button>

        {isRecording && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full animate-ping" />
        )}
      </div>

      <div className="mt-6 text-center">
        {isRecording ? (
          <div>
            <p className="text-2xl font-bold text-red-600">
              Recording: {recordingTime}s
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Click to stop recording
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xl font-semibold text-gray-700">
              Click to Record
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Say "Moo!" or any animal sound
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioRecorder;
