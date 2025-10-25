import { Sprout, Volume2 } from 'lucide-react';
import GardenGuardian from './components/GardenGuardian';

function App() {




  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sprout className="w-12 h-12 text-green-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Bio-Acoustic Garden Guardian
            </h1>
            <Volume2 className="w-12 h-12 text-green-600" />
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Advanced Animal-to-Plant Audio Translation System
          </p>
          <p className="text-sm text-gray-500 italic">
            "Animals talk. Plants listen. We're the translator."
          </p>
        </header>

        <GardenGuardian />

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>© 2025 Bio-Acoustic Garden Guardian Research Institute</p>
          <p className="mt-1">
            Powered by cutting-edge pseudo-science and questionable methodology
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
