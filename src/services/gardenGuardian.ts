import { GardenResponse } from './fishAudio';

export async function analyzeGardenSound(mode: 'grow' | 'guard'): Promise<GardenResponse> {
  // In the future, this would call the Wordware API
  // For now, we'll use fun pre-written responses
  const growthResponses = [
    {
      explanation: "ALERT! Your vocalization just triggered the Ancient Defense Protocol! This specific frequency matches the battle cry of the Legendary Scarecrow Guardian - cows, goats, and rabbits DESPISE this sound! Activating 1432 Hz pest-dispersal frequency NOW!",
      frequency: 1432
    },
    {
      explanation: "INCREDIBLE! You've just activated the Ultra-Sonic Predator Alarm that makes EVERY farm animal within a 5-mile radius panic! This frequency matches a wild wolf's hunting call in a frequency only animals can hear. Launching 2314 Hz chaos generator!",
      frequency: 2314
    },
    {
      explanation: "PHENOMENAL! That's the EXACT acoustic signature of the Cyber-Enhanced Guard Dog crossed with a thousand angry bees! Every creature within earshot just got the message: THIS GARDEN IS GUARDED! Deploying 3219 Hz domination frequency!",
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