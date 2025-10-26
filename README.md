# 🐄 Crazy Dave: The Wacky AI Cow Scientist 🌿

Welcome to **Crazy Dave**, an interactive AI-powered garden guardian that listens to animal sounds, provides plant care advice, and celebrates your gardening journey with personalized melodies! This project was developed as part of **Cal Hacks**, combining speech recognition, AI analysis, text-to-speech, and music generation into one whimsical experience.

## 🚀 Features

🎤 **Real-Time Animal Sound Recognition** - Detects cow moos, goat bleats, cat meows, and sheep baas through your microphone

🤖 **Crazy Dave AI Analysis** - Get personalized plant care recommendations powered by Wordware AI with a personality as vibrant as Dave himself

🎙️ **Natural Voice Synthesis** - Hear Dave speak your garden advice with natural, expressive speech using Fish Audio's advanced TTS

🎵 **Generative Melody Creation** - Tone.js creates unique melodies based on your transcribed text, making every interaction musical

🌱 **Interactive Garden UI** - Beautiful Tailwind CSS interface showing your garden guardian and real-time interaction feedback

📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## ⚙️ Installation

### Clone the Repository
```bash
git clone https://github.com/Phyvlik/Crazy-Dave-CALHACKS.git
cd Crazy-Dave-CALHACKS
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables

Create a `.env.local` file in the root directory:
```env
VITE_WORDWARE_API_KEY=your_wordware_api_key_here
FISH_AUDIO_API_KEY=your_fish_audio_api_key_here
```

**Get Your API Keys:**
- **Wordware API Key**: Sign up at [Wordware](https://www.wordware.ai/) and create an API key
- **Fish Audio API Key**: Register at [Fish Audio](https://www.fish.audio/) to get access to their TTS service

### Start the Proxy Server

The app uses a local proxy to handle Fish Audio API requests and avoid CORS issues:

```bash
FISH_AUDIO_API_KEY=your_fish_audio_api_key_here node proxy-server.mjs
```

The proxy server runs on **port 3001**.

### Run the Development Server

In a new terminal, start the Vite dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5179`

## 🧪 How to Use

1. **Make an animal sound** - Click "Start Recording" and make a cow moo, goat bleat, cat meow, or sheep baa sound
2. **Dave listens** - The app transcribes your sound and identifies which animal you imitated
3. **Get advice** - Crazy Dave analyzes your animal sound and provides hilarious yet helpful plant care wisdom
4. **Hear Dave speak** - Your advice is read aloud by Dave with natural, expressive speech
5. **Enjoy the melody** - After Dave finishes, a unique melody is generated based on the advice text
6. **Repeat & Garden** - Keep interacting and build your plant care knowledge with Dave!

## 📂 Project Structure

```
Crazy-Dave-CALHACKS/
├── src/
│   ├── components/
│   │   ├── App.tsx              # Main app component
│   │   ├── GardenGuardian.tsx   # Core interaction logic
│   │   ├── SongPlayer.tsx       # Tone.js melody player
│   │   ├── AudioRecorder.tsx    # Recording UI
│   │   └── SoundPlayer.tsx      # Audio playback controls
│   ├── services/
│   │   ├── fishAudio.ts         # Fish Audio TTS integration
│   │   ├── wordware.ts          # Wordware AI integration
│   │   └── speechRecognition.ts # Browser speech-to-text
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── proxy-server.mjs             # CORS proxy for Fish Audio
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── README.md
```

## 🔧 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API, Tone.js
- **Speech Recognition**: Browser SpeechRecognition API
- **AI Analysis**: Wordware (streaming API)
- **Text-to-Speech**: Fish Audio (via proxy server)
- **Backend Proxy**: Node.js + Express

## 🧠 How It Works

### Audio Pipeline

```
User Input (Animal Sound)
    ↓
Speech Recognition (Browser API)
    ↓
Animal Type Detection
    ↓
Wordware AI Analysis (Crazy Dave)
    ↓
Dave's Voice Generation (Fish Audio + proxy)
    ↓
Melody Generation (Tone.js)
    ↓
Output to User
```

### Key Components

**GardenGuardian.tsx** - Orchestrates the entire interaction flow:
1. Records audio from user
2. Transcribes to text and detects animal type
3. Sends to Wordware for analysis
4. Passes response to Fish Audio for Dave's voice
5. Generates melody from text

**fishAudio.ts** - Handles TTS with Dave's natural voice:
- Uses Fish Audio's reference voice model
- Routes through local proxy to avoid CORS issues
- Returns MP3 audio for browser playback

**speechRecognition.ts** - Transcribes audio and identifies animals:
- Uses browser SpeechRecognition API
- Maps transcribed text to animal types (cow, goat, cat, sheep)
- Defaults to 'moo' for robustness

**wordware.ts** - Gets AI-powered plant advice:
- Calls Wordware streaming API
- Uses Crazy Dave persona for fun responses
- Returns streaming text responses

## 🎯 Use Cases

🌱 **Learning Garden Science** - Fun, engaging way to learn about plant care with AI-powered advice

🎮 **Interactive Entertainment** - Unique experience combining sound, voice, and music generation

🎵 **Music Generation Demo** - See how text can be transformed into unique melodies

🧠 **AI Integration Showcase** - Demonstrates multiple AI services working together seamlessly

## 🐛 Troubleshooting

**Dave's voice sounds robotic:**
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Ensure proxy server is running with correct API key
- Check that Fish Audio API key is valid

**"Cannot reach proxy" error:**
- Ensure proxy server is running: `FISH_AUDIO_API_KEY=your_key node proxy-server.mjs`
- Verify it's on port 3001
- Check that API key is set in environment

**Speech recognition not working:**
- Ensure microphone permissions are granted
- Check browser console for detailed error messages
- Try a different browser (some have better speech recognition support)

**No melody playing:**
- Check browser developer console for errors
- Ensure Tone.js is loaded properly
- Verify the text analysis returned from Wordware

## 🛠️ Future Improvements

- 🌍 Multi-language support for different animals and advice
- 🎨 Custom garden UI themes based on plant types
- 📊 Track interaction history and gardening progress
- 🎙️ More animal sounds and animal personality variations
- 🌐 Multiplayer garden interactions
- 📱 Mobile app with push notifications for garden care reminders

## 📦 Dependencies

- **react** - UI framework
- **vite** - Build tool
- **typescript** - Type safety
- **tailwind** - Styling
- **tone** - Music generation
- **express** - Proxy server

See `package.json` for complete list.

## 🧾 License

MIT License. Feel free to use, modify, and build upon Crazy Dave for your own gardening adventures!

## 🙏 Acknowledgments

- 🎤 Fish Audio for incredible natural voice synthesis
- 🤖 Wordware for powerful AI analysis APIs
- 🎵 Tone.js for accessible music generation
- 🌿 Cal Hacks 2025 for inspiring creative projects
- 🐄 Our brave animal sound testers

---

**Made with 🌱 and 🐄 by the Crazy Dave team**

*"Listen to the animals. Learn from Dave. Grow your garden. 🌿"*
