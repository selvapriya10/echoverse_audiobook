# AI-Powered Audiobook Creator

A modern web application that transforms any text into professional audiobooks using AI-powered voice synthesis.

## Features

### 🎯 Core Functionality
- **Text Input**: Paste text directly or upload `.txt` files via drag & drop
- **Automatic Chapter Detection**: Intelligently identifies chapters based on common patterns
- **AI Voice Synthesis**: Converts text to speech using the Web Speech API
- **Real-time Preview**: Listen to generated audio immediately
- **Chapter Navigation**: Skip between chapters with audio controls

### 🎛️ Voice Customization
- **Multiple Voices**: Choose from available system voices
- **Speed Control**: Adjust playback speed (0.5x - 2.0x)
- **Pitch Adjustment**: Modify voice pitch for better listening experience
- **Volume Control**: Set perfect audio levels

### 🎵 Audio Controls
- **Play/Pause/Stop**: Full audio playback control
- **Chapter Navigation**: Previous/Next chapter buttons
- **Progress Tracking**: Visual progress indicator
- **Individual Chapter Generation**: Generate audio for specific chapters

### 📁 Export Options
- **Download Audio**: Export chapters as audio files (simulated)
- **Batch Processing**: Generate audio for all chapters at once
- **Chapter Management**: Track generation status for each chapter

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser with Web Speech API support

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`

### Quick Start Guide

1. **Add Your Text**
   - Paste text into the text area, or
   - Drag & drop a `.txt` file, or
   - Use the sample book provided in `public/sample-book.txt`

2. **Customize Voice Settings**
   - Select your preferred voice
   - Adjust speed, pitch, and volume to your liking

3. **Generate Audio**
   - Click "Generate All Audio" to process all chapters
   - Or generate individual chapters using the chapter controls

4. **Listen & Navigate**
   - Use playback controls to listen to your audiobook
   - Navigate between chapters seamlessly

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Modern CSS with gradients and animations
- **Icons**: Lucide React icon library
- **Voice Synthesis**: Web Speech API (SpeechSynthesis)
- **File Handling**: HTML5 File API with drag & drop

## Browser Compatibility

This application uses the Web Speech API, which is supported by:
- ✅ Chrome/Chromium browsers
- ✅ Safari (macOS/iOS)
- ✅ Edge
- ⚠️ Firefox (limited support)

For best results, use Chrome or Safari.

## Features in Detail

### Automatic Chapter Detection
The app recognizes common chapter patterns:
- "Chapter 1", "Chapter One"
- "Part 1", "Part I"
- "1.", "2.", etc. (numbered sections)
- Roman numerals: "I.", "II.", "III."

### Voice Options
- Access to all system-installed voices
- Language-specific voice selection
- Real-time voice parameter adjustment
- Preview changes instantly

### File Support
- Plain text files (.txt)
- Drag & drop interface
- Large file handling
- Automatic text encoding detection

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── App.jsx          # Main application component
├── main.jsx         # React entry point
├── index.css        # Global styles and animations
public/
├── sample-book.txt  # Sample content for testing
└── vite.svg         # Application icon
```

## Future Enhancements

### Planned Features
- **Advanced AI Integration**: OpenAI TTS, Google Cloud TTS, Amazon Polly
- **Multiple Export Formats**: MP3, WAV, M4A
- **Cloud Storage**: Save and sync audiobooks
- **Mobile App**: React Native companion app
- **Batch Processing**: Multiple file handling
- **Audio Editing**: Trim, merge, and enhance audio
- **Accessibility**: Screen reader compatibility
- **Multi-language**: International voice support

### Technical Improvements
- **Service Workers**: Offline functionality
- **WebRTC**: Real-time voice processing
- **Web Workers**: Background audio generation
- **IndexedDB**: Local storage for large files
- **PWA**: Progressive Web App features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Check browser console for errors
- Ensure microphone permissions are granted
- Verify Web Speech API support in your browser
- Try different voices if audio generation fails

---

**Built with ❤️ using React and modern web technologies**