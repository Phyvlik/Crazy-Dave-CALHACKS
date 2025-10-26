import React from 'react';
import { Heart } from 'lucide-react';
import CowIcon from './CowIcon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 rounded-xl bg-white/70 backdrop-blur border border-white/50 p-6 text-center">
      <div className="flex justify-center mb-3">
        <CowIcon size={56} className="opacity-90" />
      </div>
      <p className="text-lg font-bold text-black">
        © {currentYear} Crazy Dave - All Rights Reserved
      </p>
      <p className="mt-2 text-sm font-bold text-black">
        Powered by moo-to-music alchemy, Tone.js beeps & boops, and our highly peer-unreviewed bio-acoustics.
      </p>
      <p className="mt-3 text-sm font-bold text-black flex items-center justify-center gap-1">
        Made with <Heart className="w-4 h-4 fill-red-500 text-red-500" /> by Crazy Dave Team
      </p>
    </footer>
  );
};

export default Footer;
