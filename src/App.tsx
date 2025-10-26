import { useState } from 'react';
import GardenGuardian from './components/GardenGuardian';
import CowIcon from './components/CowIcon';
import Footer from './components/Footer';

function App() {
  const [bootScreen, setBootScreen] = useState(true);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Simulate Windows XP boot sequence
  const handleBootComplete = () => {
    setTimeout(() => setBootScreen(false), 3000);
  };

  if (bootScreen) {
    return (
      <div className="xp-bg xp-pixel-grid fixed inset-0 flex items-center justify-center">
        <div className="xp-window p-16 text-center max-w-2xl" style={{ background: 'linear-gradient(to bottom, #7CB342, #558B2F)' }}>
          <div className="xp-title-bar mb-8 text-lg font-bold" style={{ fontSize: '24px' }}>🚀 Loading Crazy Dave v1.0...</div>
          <div className="space-y-8">
            <img 
              src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDNtZmFyN2xlZHVwdjluZ3hlMWF0eXZycTNsMHR2dGxrZWIxM256diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Vp3ftHKvKpASA/giphy.gif"
              alt="Loading animation"
              className="w-64 h-64 mx-auto"
            />
            <div className="text-9xl font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              🐄
            </div>
            <p className="text-white font-black" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: '3px 3px 0 #000', fontSize: '32px' }}>INITIALIZING MOO-SIC SYSTEM</p>
            <p className="text-white font-bold" style={{ fontSize: '28px' }}>Syncing with botanical frequencies...</p>
            <div className="xp-progress">
              <div className="xp-progress-bar w-3/4"></div>
            </div>
            <p className="text-white italic font-bold" style={{ fontSize: '24px' }}>⏳ Loading brain cells... Please wait</p>
            <button
              onClick={handleBootComplete}
              className="xp-button-large mt-8 w-full text-xl py-4 font-bold"
              style={{ fontSize: '28px' }}
            >
              [► CONTINUE ◄]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xp-bg xp-pixel-grid min-h-screen relative overflow-hidden pb-20">
      {/* Pixel Cloud in Blue Area */}
      <div className="pixel-cloud"></div>

      {/* Pixel Flowers in Green Area */}
      <div className="pixel-flower"></div>
      <div className="pixel-flower"></div>
      <div className="pixel-flower"></div>
      <div className="pixel-flower"></div>
      <div className="pixel-flower"></div>
      <div className="pixel-flower"></div>

      {/* Desktop Container */}
      <div className="container mx-auto px-4 py-4 max-w-5xl relative z-10">
        
        {/* Main Window Frame */}
        <div className="xp-window mb-6 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #7CB342, #558B2F)' }}>
          {/* Title Bar */}
          <div className="xp-title-bar flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-lg">🐄</span>
              Crazy Dave - Moo-sic Lab v1.0
            </span>
            <div className="flex gap-1">
              <button className="xp-button px-3 py-1 text-xs">_</button>
              <button className="xp-button px-3 py-1 text-xs">□</button>
              <button className="xp-button px-3 py-1 text-xs">✕</button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gradient-to-b from-gray-300 to-gray-200 p-6 space-y-6" style={{ background: 'linear-gradient(to bottom, #7CB342, #558B2F)' }}>
            
            {/* Header Section */}
            <div className="xp-panel p-6 space-y-4">
              <h1 className="xp-heading-lg text-center text-5xl">
                🐄 CRAZY DAVE 🐄
              </h1>
              <p className="text-center font-black text-white" style={{ letterSpacing: '3px', textShadow: '2px 2px 0 #000', fontSize: '56px' }}>
                ♫ MOO-SIC FOR YOUR PLANTS ♫
              </p>
              <p className="text-center font-bold text-white" style={{ textShadow: '1px 1px 0 #000', fontSize: '42px' }}>
                Friendly Animal Only!
              </p>
            </div>

            {/* HOW IT WORKS Section */}
            <div className="xp-window">
              <div className="xp-title-bar">💡 HOW IT WORKS</div>
              <div className="bg-gray-300 p-4 space-y-3" style={{ background: 'linear-gradient(to bottom, #7CB342, #558B2F)' }}>
                <p className="font-bold text-white" style={{ textShadow: '1px 1px 0 #000', lineHeight: '1.5', fontSize: '28px' }}>
                  Make ANY farm animal sound (cow, cat, goat) to unlock growth-promoting frequencies for your plants
                </p>
              </div>
            </div>

            {/* Main Application Area */}
            <div className="xp-panel p-4">
              <GardenGuardian />
            </div>

            {/* Abstract/Info Panel */}
            <div className="xp-window">
              <div className="xp-title-bar">ℹ️ INFORMATION SYSTEMS</div>
              <div className="bg-gray-300 p-4 space-y-4" style={{ background: 'linear-gradient(to bottom, #7CB342, #558B2F)' }}>
                
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 text-7xl">
                    <CowIcon size={96} />
                  </div>
                  <div className="flex-grow space-y-2">
                    <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '16px', letterSpacing: '1px', textShadow: '2px 2px 0 #000' }}>
                      ► ABSTRACT ◄
                    </h2>
                    <p className="text-white leading-relaxed font-bold" style={{ textShadow: '1px 1px 0 #000', fontSize: '24px' }}>
                      This groundbreaking research explores bio-acoustics & phytobiology through innovative AI-driven analysis. Our proprietary system decodes animal vocalizations into optimized growth-promoting frequencies! 🌱
                    </p>
                  </div>
                </div>

                {/* Disclaimer Dialog */}
                <div className="xp-window bg-yellow-100 border-4 border-red-600">
                  <div className="xp-title-bar bg-red-600 text-white">⚠️ ⚠️ CRITICAL DISCLAIMER ⚠️ ⚠️</div>
                  <div className="bg-gray-300 p-3">
                    <p className="font-black text-red-700" style={{ fontSize: '24px' }}>
                      🔴 DISCLAIMER: Zero cows took emotional damage in the making of this hack.
                    </p>
                  </div>
                </div>

                {/* Keywords */}
                <div className="xp-panel p-3 bg-emerald-100">
                  <p className="font-black text-green-900" style={{ fontSize: '22px' }}>
                    📋 KEYWORDS: Plant Growth | AI Analysis | Wordware | Fish Audio | Pseudo-Science 🚀
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Window */}
        <div className="xp-window" style={{ background: 'linear-gradient(to bottom, #7CB342, #558B2F)' }}>
          <div className="xp-title-bar" style={{ fontSize: '20px' }}>📋 STATUS BAR</div>
          <div className="bg-gray-300 p-3" style={{ background: 'linear-gradient(to bottom, #7CB342, #558B2F)' }}>
            <Footer />
          </div>
        </div>

      </div>

      {/* Floating Easter Egg Button */}
      <div className="fixed bottom-24 right-4 group">
        <button
          className="xp-button-large w-24 h-24 flex items-center justify-center text-5xl font-black hover:scale-110 transition"
          onMouseEnter={() => setHoveredButton('helper')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => alert('💡 TIP: Try saying "Sui" like Cristiano Ronaldo to unlock special goat mode! ⚽🐐')}
        >
          ?
        </button>
        {hoveredButton === 'helper' && (
          <div className="xp-tooltip bottom-28 right-0 w-48">
            Click for pro tips! 🎮
          </div>
        )}
      </div>

      {/* Desktop Icons */}
      <div className="fixed top-4 left-4 space-y-2">
        <div className="xp-text-retro text-center cursor-pointer hover:bg-green-400/30 p-3 rounded">
          <div className="text-6xl font-black">💾</div>
          <p className="text-xs font-bold">My Documents</p>
        </div>
        <div className="xp-text-retro text-center cursor-pointer hover:bg-green-400/30 p-3 rounded">
          <div className="text-6xl font-black">🎮</div>
          <p className="text-xs font-bold">Games</p>
        </div>
      </div>

    </div>
  );
}

export default App;
