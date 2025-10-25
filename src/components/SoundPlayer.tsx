import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sprout, Shield } from 'lucide-react';
import { AnalysisResult } from '../App';

interface SoundPlayerProps {
  result: AnalysisResult;
}

function SoundPlayer({ result }: SoundPlayerProps) {
  const [isPlayingGrowth, setIsPlayingGrowth] = useState(false);
  const [isPlayingDeterrent, setIsPlayingDeterrent] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const growthOscillatorRef = useRef<OscillatorNode | null>(null);
  const deterrentOscillatorRef = useRef<OscillatorNode | null>(null);
  const growthGainRef = useRef<GainNode | null>(null);
  const deterrentGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    return () => {
      stopGrowthSound();
      stopDeterrentSound();
      audioContextRef.current?.close();
    };
  }, []);

  const playGrowthSound = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(result.growthFrequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(isMuted ? 0 : volume * 0.3, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    growthOscillatorRef.current = oscillator;
    growthGainRef.current = gainNode;
    setIsPlayingGrowth(true);
  };

  const stopGrowthSound = () => {
    if (growthOscillatorRef.current) {
      growthOscillatorRef.current.stop();
      growthOscillatorRef.current.disconnect();
      growthOscillatorRef.current = null;
    }
    if (growthGainRef.current) {
      growthGainRef.current.disconnect();
      growthGainRef.current = null;
    }
    setIsPlayingGrowth(false);
  };

  const playDeterrentSound = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'square';
    const actualFreq = Math.min(result.deterrentFrequency, 8000);
    oscillator.frequency.setValueAtTime(actualFreq, audioContext.currentTime);

    gainNode.gain.setValueAtTime(isMuted ? 0 : volume * 0.2, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    deterrentOscillatorRef.current = oscillator;
    deterrentGainRef.current = gainNode;
    setIsPlayingDeterrent(true);
  };

  const stopDeterrentSound = () => {
    if (deterrentOscillatorRef.current) {
      deterrentOscillatorRef.current.stop();
      deterrentOscillatorRef.current.disconnect();
      deterrentOscillatorRef.current = null;
    }
    if (deterrentGainRef.current) {
      deterrentGainRef.current.disconnect();
      deterrentGainRef.current = null;
    }
    setIsPlayingDeterrent(false);
  };

  const toggleGrowthSound = () => {
    if (isPlayingGrowth) {
      stopGrowthSound();
    } else {
      playGrowthSound();
    }
  };

  const toggleDeterrentSound = () => {
    if (isPlayingDeterrent) {
      stopDeterrentSound();
    } else {
      playDeterrentSound();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);

    if (growthGainRef.current) {
      growthGainRef.current.gain.setValueAtTime(
        isMuted ? 0 : newVolume * 0.3,
        audioContextRef.current!.currentTime
      );
    }

    if (deterrentGainRef.current) {
      deterrentGainRef.current.gain.setValueAtTime(
        isMuted ? 0 : newVolume * 0.2,
        audioContextRef.current!.currentTime
      );
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (growthGainRef.current) {
      growthGainRef.current.gain.setValueAtTime(
        newMuted ? 0 : volume * 0.3,
        audioContextRef.current!.currentTime
      );
    }

    if (deterrentGainRef.current) {
      deterrentGainRef.current.gain.setValueAtTime(
        newMuted ? 0 : volume * 0.2,
        audioContextRef.current!.currentTime
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Bio-Acoustic Playback System
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Growth Frequency</h3>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              {result.growthSound} at {result.growthFrequency} Hz
            </p>
            <div className="bg-green-100 rounded p-2">
              <p className="text-xs text-green-700">
                Stimulates photosynthesis and root development
              </p>
            </div>
          </div>

          <button
            onClick={toggleGrowthSound}
            className={`
              w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2
              transition-all duration-200 transform hover:scale-105
              ${isPlayingGrowth
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
          >
            {isPlayingGrowth ? (
              <>
                <Pause className="w-5 h-5" />
                Stop Growth Sound
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Play Growth Sound
              </>
            )}
          </button>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Deterrent Frequency</h3>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              {result.deterrentSound} at {result.deterrentFrequency} Hz
            </p>
            <div className="bg-red-100 rounded p-2">
              <p className="text-xs text-red-700">
                Creates acoustic barrier against herbivores
              </p>
            </div>
          </div>

          <button
            onClick={toggleDeterrentSound}
            className={`
              w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2
              transition-all duration-200 transform hover:scale-105
              ${isPlayingDeterrent
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
              }
            `}
          >
            {isPlayingDeterrent ? (
              <>
                <Pause className="w-5 h-5" />
                Stop Deterrent Sound
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Play Deterrent Sound
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-gray-600" />
            ) : (
              <Volume2 className="w-6 h-6 text-gray-600" />
            )}
          </button>

          <div className="flex-1">
            <label className="text-sm text-gray-600 block mb-1">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          ⚠️ Warning: High frequencies may not be audible to human ears but are scientifically proven
          to affect plant cellular structures. Results may vary based on botanical species.
        </p>
      </div>
    </div>
  );
}

export default SoundPlayer;
