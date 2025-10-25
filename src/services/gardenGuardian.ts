import { GardenResponse } from './fishAudio';

export async function analyzeGardenSound(mode: 'grow' | 'guard'): Promise<GardenResponse> {
  // In the future, this would call the Wordware API
  // For now, we'll use fun pre-written responses
  const growthResponses = [
    {
      explanation: "Fascinating! Your gentle vocalization produces alpha waves that match the natural resonance of growing leaves. I'll generate a 1432 Hz tone - the exact frequency of a happy plant's photosynthesis dance!",
      frequency: 1432
    },
    {
      explanation: "Incredible! That peaceful sound perfectly mimics the harmonious frequency of a garden in full bloom. Let me generate a 2314 Hz tone that will make your plants absolutely jubilant!",
      frequency: 2314
    },
    {
      explanation: "Eureka! Your soothing vocalization matches the precise frequency of moonlight on dewdrops. I'll create a 3219 Hz growth-stimulating tone that your plants will absolutely adore!",
      frequency: 3219
    }
  ];

  const guardResponses = [
    {
      explanation: "Alert! That fierce sound perfectly mimics the ultrasonic signature of the dreaded Garden Velociraptor - a pest's worst nightmare! I'll generate a 22,000 Hz deterrent frequency that will make those nibbling rabbits think twice!",
      frequency: 22000
    },
    {
      explanation: "Brilliant defense! Your sound matches the bio-acoustic pattern of the Mythical Garden Dragon! Time to generate a 23,500 Hz pest-repelling frequency that will send those munching critters running!",
      frequency: 23500
    },
    {
      explanation: "Outstanding! You've replicated the sonic signature of the legendary Thunder-Tailed Toad - nature's ultimate garden protector! Let's blast those pests with a 21,000 Hz defensive frequency!",
      frequency: 21000
    }
  ];

  const responses = mode === 'grow' ? growthResponses : guardResponses;
  const response = responses[Math.floor(Math.random() * responses.length)];

  return {
    ...response,
    mode
  };
}