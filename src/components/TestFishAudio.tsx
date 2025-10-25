import React, { useState } from 'react';
import { speakTextWithFishAudio } from '../services/fishAudio';

const TestFishAudio: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const testAudio = async () => {
    setIsLoading(true);
    try {
      await speakTextWithFishAudio("Hello! Welcome to Fish Audio. This is my first AI-generated voice.");
    } catch (error) {
      console.error('Error testing Fish Audio:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fish Audio Test</h2>
      <button
        onClick={testAudio}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? 'Generating Audio...' : 'Test Fish Audio'}
      </button>
    </div>
  );
};

export default TestFishAudio;