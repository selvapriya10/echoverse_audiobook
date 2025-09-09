import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Mic, 
  Volume2, 
  SkipBack, 
  SkipForward,
  FileText,
  Headphones
} from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'default',
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8
  });

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') return;
      
      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (chapters[currentChapter]?.utterance) {
            isPlaying ? pauseAudio() : playAudio();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextChapter();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previousChapter();
          break;
        case 'Escape':
          event.preventDefault();
          stopAudio();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter, isPlaying, chapters]);

  // Text processing to detect chapters
  const processText = (inputText) => {
    const lines = inputText.split('\n').filter(line => line.trim());
    const chapterRegex = /^(chapter\s+\d+|chapter\s+[ivx]+|\d+\.|part\s+\d+)/i;
    const chapters = [];
    let currentChapter = { title: 'Introduction', content: '', status: 'pending' };
    
    lines.forEach(line => {
      if (chapterRegex.test(line.trim())) {
        if (currentChapter.content.trim()) {
          chapters.push({ ...currentChapter });
        }
        currentChapter = {
          title: line.trim(),
          content: '',
          status: 'pending'
        };
      } else {
        currentChapter.content += line + '\n';
      }
    });
    
    if (currentChapter.content.trim()) {
      chapters.push(currentChapter);
    }

    return chapters.length > 0 ? chapters : [{ 
      title: 'Full Text', 
      content: inputText, 
      status: 'pending' 
    }];
  };

  // Simulate text-to-speech conversion
  const generateAudio = async (chapterIndex) => {
    const chapter = chapters[chapterIndex];
    if (!chapter || chapter.status === 'processing') return;

    setIsGenerating(true);
    setChapters(prev => prev.map((ch, idx) => 
      idx === chapterIndex ? { ...ch, status: 'processing' } : ch
    ));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call a TTS API here
      // For demo purposes, we'll use Web Speech API synthesis
      const utterance = new SpeechSynthesisUtterance(chapter.content);
      
      // Apply voice settings
      utterance.rate = voiceSettings.speed;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;
      
      // Get available voices
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0 && voiceSettings.voice !== 'default') {
        const selectedVoice = voices.find(voice => voice.name === voiceSettings.voice);
        if (selectedVoice) utterance.voice = selectedVoice;
      }

      // Create audio blob URL (simulated)
      const audioUrl = URL.createObjectURL(new Blob([], { type: 'audio/mp3' }));
      
      setChapters(prev => prev.map((ch, idx) => 
        idx === chapterIndex ? { 
          ...ch, 
          status: 'completed', 
          audioUrl: audioUrl,
          utterance: utterance 
        } : ch
      ));
      
    } catch (error) {
      console.error('Error generating audio:', error);
      setChapters(prev => prev.map((ch, idx) => 
        idx === chapterIndex ? { ...ch, status: 'pending' } : ch
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate all chapters
  const generateAllAudio = async () => {
    for (let i = 0; i < chapters.length; i++) {
      await generateAudio(i);
    }
  };

  // Audio playback controls
  const playAudio = () => {
    const chapter = chapters[currentChapter];
    if (chapter && chapter.utterance) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        speechSynthesis.speak(chapter.utterance);
      }
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    speechSynthesis.pause();
    setIsPlaying(false);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      stopAudio();
      setCurrentChapter(currentChapter + 1);
    }
  };

  const previousChapter = () => {
    if (currentChapter > 0) {
      stopAudio();
      setCurrentChapter(currentChapter - 1);
    }
  };

  // File upload handling
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setText(content);
        const processedChapters = processText(content);
        setChapters(processedChapters);
        setCurrentChapter(0);
      };
      reader.readAsText(file);
    }
  };

  // Drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setText(content);
        const processedChapters = processText(content);
        setChapters(processedChapters);
        setCurrentChapter(0);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    // Only set to false if we're actually leaving the drop zone
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  // Process text when it changes
  useEffect(() => {
    if (text.trim()) {
      const processedChapters = processText(text);
      setChapters(processedChapters);
      setCurrentChapter(0);
    }
  }, [text]);

  // Get available voices
  const [availableVoices, setAvailableVoices] = useState([]);
  
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };
    
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Download audio (simulated)
  const downloadAudio = (chapterIndex, format = 'mp3') => {
    const chapter = chapters[chapterIndex];
    if (chapter && chapter.status === 'completed') {
      // In a real app, this would download the actual audio file
      const element = document.createElement('a');
      element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(chapter.content);
      element.download = `${chapter.title}.txt`;
      element.click();
    }
  };

  return (
    <div className="app-container" role="main" aria-label="AI Audiobook Creator">
      <header className="header">
        <h1 id="app-title">
          <Headphones 
            style={{ display: 'inline', marginRight: '0.5rem' }} 
            aria-hidden="true"
          />
          AI Audiobook Creator
        </h1>
        <p aria-describedby="app-title">
          Transform any text into a professional audiobook with AI-powered voice synthesis
        </p>
        
        {/* Keyboard shortcuts info */}
        <div style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)', 
          marginTop: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <span>⌨️ Shortcuts: </span>
          <span><kbd style={{ padding: '0.2rem 0.4rem', background: 'var(--surface)', borderRadius: '3px' }}>Space</kbd> Play/Pause</span>
          <span><kbd style={{ padding: '0.2rem 0.4rem', background: 'var(--surface)', borderRadius: '3px' }}>←→</kbd> Navigate</span>
          <span><kbd style={{ padding: '0.2rem 0.4rem', background: 'var(--surface)', borderRadius: '3px' }}>Esc</kbd> Stop</span>
        </div>
      </header>

      <div className="main-content">
        {/* Text Input Section */}
        <div className="card">
          <h3>
            <FileText style={{ display: 'inline', marginRight: '0.5rem' }} aria-hidden="true" />
            Text Input
          </h3>
          
          <div 
            className={`file-upload-area ${isDragOver ? 'dragover' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload text file"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <Upload 
              style={{ 
                margin: '0 auto 1rem', 
                display: 'block', 
                width: '2.5rem', 
                height: '2.5rem',
                color: isDragOver ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'all var(--transition-base)'
              }} 
            />
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
              {isDragOver ? 'Drop your text file here!' : 'Drag & drop a text file or click to browse'}
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Supports .txt files up to 10MB
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="file-input"
            aria-label="Choose text file to upload"
          />
          
          <textarea
            className="text-input"
            placeholder="Or paste your text here... The app will automatically detect chapters based on common patterns like 'Chapter 1', 'Part 1', etc. Try pasting a story or book content to see the magic happen!"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onFocus={() => {
              // Focus effect handled by CSS
            }}
            aria-label="Text content for audiobook"
            aria-describedby="text-input-help"
          />
          <div id="text-input-help" style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-muted)', 
            marginTop: '0.5rem' 
          }}>
            {text.length > 0 ? `${text.length} characters` : 'Paste your text or upload a file to get started'}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="card">
          <h3>
            <Mic style={{ display: 'inline', marginRight: '0.5rem' }} aria-hidden="true" />
            Voice Settings
          </h3>
          
          <div className="voice-controls" role="group" aria-label="Voice customization controls">
            <div className="control-group">
              <label htmlFor="voice-select">Voice:</label>
              <select 
                id="voice-select"
                className="select"
                value={voiceSettings.voice}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, voice: e.target.value }))}
                aria-describedby="voice-help"
              >
                <option value="default">Default Voice</option>
                {availableVoices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              <div id="voice-help" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {availableVoices.length} voices available
              </div>
            </div>
            
            <div className="control-group">
              <label htmlFor="speed-slider">Speed: {voiceSettings.speed.toFixed(1)}x</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>0.5x</span>
                <input
                  id="speed-slider"
                  type="range"
                  className="slider"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                  aria-label={`Playback speed: ${voiceSettings.speed.toFixed(1)} times normal speed`}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2.0x</span>
              </div>
            </div>
            
            <div className="control-group">
              <label htmlFor="pitch-slider">Pitch: {voiceSettings.pitch.toFixed(1)}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Low</span>
                <input
                  id="pitch-slider"
                  type="range"
                  className="slider"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                  aria-label={`Voice pitch: ${voiceSettings.pitch.toFixed(1)}`}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High</span>
              </div>
            </div>
            
            <div className="control-group">
              <label htmlFor="volume-slider">Volume: {Math.round(voiceSettings.volume * 100)}%</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🔇</span>
                <input
                  id="volume-slider"
                  type="range"
                  className="slider"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.volume}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  aria-label={`Volume: ${Math.round(voiceSettings.volume * 100)} percent`}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🔊</span>
              </div>
            </div>

            <button 
              className="button"
              onClick={generateAllAudio}
              disabled={!text.trim() || isGenerating}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              aria-describedby="generate-help"
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner" aria-hidden="true" />
                  <span>Generating Audio...</span>
                  <span className="sr-only">Audio generation in progress</span>
                </>
              ) : (
                <>
                  <Volume2 style={{ width: '20px', height: '20px' }} aria-hidden="true" />
                  Generate All Audio ({chapters.length} chapters)
                </>
              )}
            </button>
            <div id="generate-help" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              This will create audio for all detected chapters using your voice settings
            </div>
          </div>
        </div>
      </div>

      {/* Chapters and Audio Controls */}
      {chapters.length > 0 && (
        <div className="card">
          <h3>
            <Headphones style={{ display: 'inline', marginRight: '0.5rem' }} />
            Chapters & Audio Controls
            <span style={{ 
              fontSize: '0.8rem', 
              fontWeight: '500', 
              color: 'var(--text-muted)',
              marginLeft: 'auto'
            }}>
              {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} detected
            </span>
          </h3>
          
          {/* Audio Player */}
          <div className="audio-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                className="button secondary"
                onClick={previousChapter}
                disabled={currentChapter === 0}
                title="Previous Chapter"
                style={{ minWidth: 'auto', padding: '0.75rem' }}
              >
                <SkipBack style={{ width: '18px', height: '18px' }} />
              </button>
              
              <button 
                className={`button ${isPlaying ? 'secondary' : ''}`}
                onClick={isPlaying ? pauseAudio : playAudio}
                disabled={!chapters[currentChapter]?.utterance}
                title={isPlaying ? 'Pause' : 'Play'}
                style={{ 
                  minWidth: '4rem',
                  background: isPlaying ? 'var(--warning)' : 'var(--primary)',
                  transform: isPlaying ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {isPlaying ? 
                  <Pause style={{ width: '20px', height: '20px' }} /> : 
                  <Play style={{ width: '20px', height: '20px' }} />
                }
              </button>
              
              <button 
                className="button secondary"
                onClick={stopAudio}
                title="Stop"
                style={{ minWidth: 'auto', padding: '0.75rem' }}
              >
                <Square style={{ width: '18px', height: '18px' }} />
              </button>
              
              <button 
                className="button secondary"
                onClick={nextChapter}
                disabled={currentChapter === chapters.length - 1}
                title="Next Chapter"
                style={{ minWidth: 'auto', padding: '0.75rem' }}
              >
                <SkipForward style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1, 
              gap: '1rem',
              minWidth: 0
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap'
              }}>
                {Math.round(audioProgress)}%
              </span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap'
              }}>
                Chapter {currentChapter + 1} of {chapters.length}
              </span>
            </div>
          </div>

          {/* Chapter List */}
          <div className="chapter-list">
            {chapters.map((chapter, index) => (
              <div 
                key={index} 
                className={`chapter-item ${index === currentChapter ? 'active' : ''}`}
                onClick={() => {
                  stopAudio();
                  setCurrentChapter(index);
                }}
                style={{ 
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.75rem' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index === currentChapter ? 'var(--primary)' : 'var(--border)',
                    transition: 'all var(--transition-base)'
                  }} />
                  <span className="chapter-title">{chapter.title}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span className={`status-indicator status-${chapter.status}`}>
                    {chapter.status === 'pending' && '⏳ Pending'}
                    {chapter.status === 'processing' && '🔄 Processing...'}
                    {chapter.status === 'completed' && '✅ Ready'}
                  </span>
                  
                  {chapter.status === 'pending' && (
                    <button 
                      className="button" 
                      style={{ 
                        padding: '0.5rem 0.75rem', 
                        fontSize: '0.8rem',
                        minWidth: 'auto'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        generateAudio(index);
                      }}
                      disabled={isGenerating}
                    >
                      <Volume2 style={{ width: '16px', height: '16px' }} />
                      Generate
                    </button>
                  )}
                  
                  {chapter.status === 'completed' && (
                    <button 
                      className="button success" 
                      style={{ 
                        padding: '0.5rem 0.75rem', 
                        fontSize: '0.8rem',
                        minWidth: 'auto'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadAudio(index);
                      }}
                    >
                      <Download style={{ width: '16px', height: '16px' }} />
                      Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;