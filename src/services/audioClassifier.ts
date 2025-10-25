// Audio classifier to detect friendly vs threatening sounds
export interface AudioClassification {
  mode: 'grow' | 'guard';
  confidence: number; // 0..1
  features: {
    rms: number;      // Root Mean Square (volume)
    zcr: number;      // Zero Crossing Rate (roughness)
    highFreqRatio: number;  // High frequency content
  };
}

export async function classifyAudioFromBlob(blob: Blob): Promise<AudioClassification> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    // Get audio data (convert to mono if stereo)
    const channelData = audioBuffer.getChannelData(0);
    const samples = channelData.slice(0, Math.min(channelData.length, 44100)); // ~1 sec
    
    // Calculate features
    const { rms, zcr, highFreqRatio } = await calculateFeatures(samples, audioCtx.sampleRate);
    
    // Classify based on features
    // High ZCR + High Freq = threatening sound
    // Low ZCR + Low Freq = friendly sound
    const threatScore = (zcr * 0.5) + (highFreqRatio * 0.3) + (rms * 0.2);
    const mode = threatScore > 0.6 ? 'guard' : 'grow';
    const confidence = Math.abs(threatScore - 0.6) * 2;

    return {
      mode,
      confidence: Math.min(1, Math.max(0, confidence)),
      features: { rms, zcr, highFreqRatio }
    };
  } catch (error) {
    console.error('Audio classification failed:', error);
    return {
      mode: 'grow', // Default to friendly if analysis fails
      confidence: 0,
      features: { rms: 0, zcr: 0, highFreqRatio: 0 }
    };
  }
}

async function calculateFeatures(samples: Float32Array, sampleRate: number) {
  // Calculate RMS (volume)
  const rms = Math.sqrt(
    samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length
  );

  // Calculate Zero Crossing Rate (roughness)
  let zeroCount = 0;
  for (let i = 1; i < samples.length; i++) {
    if ((samples[i] >= 0 && samples[i - 1] < 0) || 
        (samples[i] < 0 && samples[i - 1] >= 0)) {
      zeroCount++;
    }
  }
  const zcr = zeroCount / samples.length;

  // Calculate high frequency content (using FFT)
  const fftSize = 2048;
  const analyser = new AnalyserNode(new AudioContext(), { fftSize });
  const freqData = new Float32Array(analyser.frequencyBinCount);
  
  // Create temporary buffer source
  const tempContext = new AudioContext();
  const tempBuffer = tempContext.createBuffer(1, samples.length, sampleRate);
  tempBuffer.copyToChannel(samples, 0);
  
  const source = tempContext.createBufferSource();
  source.buffer = tempBuffer;
  source.connect(analyser);
  
  analyser.getFloatFrequencyData(freqData);
  
  // Calculate ratio of high frequencies (>2000Hz) to total
  const binSize = sampleRate / fftSize;
  const highFreqBin = Math.floor(2000 / binSize);
  
  let totalEnergy = 0;
  let highFreqEnergy = 0;
  
  freqData.forEach((magnitude, i) => {
    const energy = Math.pow(10, magnitude / 20);
    totalEnergy += energy;
    if (i >= highFreqBin) {
      highFreqEnergy += energy;
    }
  });

  const highFreqRatio = totalEnergy > 0 ? highFreqEnergy / totalEnergy : 0;

  return { rms, zcr, highFreqRatio };
}