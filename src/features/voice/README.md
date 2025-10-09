# Voice Conversation Modal

A comprehensive voice conversation system for React applications with real-time speech-to-text, text-to-speech, and intelligent conversation flow management.

## Features

### Core Capabilities

- 🎤 **Real-time Speech Recognition** - Web Speech API with fallback support
- 🔊 **High-Quality Text-to-Speech** - Optimized voice selection for natural speech
- 🎯 **Voice Activity Detection** - Smart microphone control with silence detection
- 🔄 **Auto-Loop Conversation** - Seamless listen → process → speak → repeat cycle
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ♿ **Accessibility** - Full keyboard support and ARIA compliance

### Advanced Features

- 🎨 **Audio Visualizations** - Real-time waveform and state animations
- ⚡ **State Management** - Robust state machine with error handling
- 💾 **Session Persistence** - Remember user preferences across sessions
- 🎹 **Keyboard Shortcuts** - Space to listen, Escape to close, Cmd+S to stop
- 🌙 **Reduced Motion** - Respects user motion preferences
- 🔧 **Pluggable Providers** - Easy to extend with custom STT/TTS services

## Quick Start

### Installation

```bash
# The voice system is part of the main application
# No additional installation required
```

### Basic Usage

```tsx
import { VoiceChatModal } from '@/features/voice'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Start Voice Chat</button>

      <VoiceChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onContinueChat={(transcript) => {
          console.log('User said:', transcript)
        }}
        onTranscriptReady={async (transcript) => {
          // Send to your AI service and return response
          const response = await myAI.chat(transcript)
          return response
        }}
      />
    </>
  )
}
```

### Integration with Existing Chat

```tsx
import { VoiceIntegration } from '@/features/voice'

function ChatInterface() {
  const handleNewMessage = (message: string) => {
    // Add the voice message to your chat
    setChatMessages((prev) => [...prev, { text: message, from: 'user' }])
  }

  return (
    <div className="chat-container">
      {/* Your existing chat UI */}

      <VoiceIntegration onNewMessage={handleNewMessage} />
    </div>
  )
}
```

## Architecture

### System Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Modal   │    │ Conversation     │    │  Audio Engine   │
│   Components    │◄──►│   Controller     │◄──►│   (VAD + Mic)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                        ┌───────┴───────┐
                        │               │
                        ▼               ▼
                ┌─────────────┐  ┌─────────────┐
                │ STT Service │  │ TTS Service │
                │ (Web Speech)│  │ (Web Speech)│
                └─────────────┘  └─────────────┘
```

### Core Components

1. **VoiceChatModal** - Main React component with UI and controls
2. **ConversationController** - State machine managing the conversation flow
3. **AudioEngine** - Microphone capture and voice activity detection
4. **STTService** - Speech-to-text with partial/final results
5. **TTSService** - Text-to-speech with interruption support
6. **useVoiceConversation** - React hook for component integration

### State Flow

```
IDLE → LISTENING → PROCESSING → SPEAKING → IDLE (loop)
  ↑                                           │
  └─────────────── AUTO_LOOP ←────────────────┘
```

## API Reference

### VoiceChatModal Props

```tsx
interface VoiceChatModalProps {
  isOpen: boolean // Controls modal visibility
  onClose: () => void // Called when modal closes
  onContinueChat?: (transcript: string) => void // Pass transcript to chat
  onTranscriptReady?: (transcript: string) => Promise<string> // AI processing
  onPartialTranscript?: (transcript: string) => void // Real-time transcript
  initialMessage?: string // Auto-play message on open
  reducedMotion?: boolean // Disable animations
}
```

### Voice Configuration

```tsx
interface VoiceConfig {
  language: string // Speech recognition language ('en-US')
  vadThreshold: number // Voice activity detection sensitivity (0.01)
  minSpeechMs: number // Minimum speech duration (300ms)
  minSilenceMs: number // Silence before stopping (800ms)
  autoLoop: boolean // Auto-restart after AI response (true)
  ttsVoice?: string // Preferred TTS voice name
  ttsRate: number // Speech rate (1.0 = normal)
  ttsPitch: number // Speech pitch (1.0 = normal)
  maxProcessingTimeMs: number // Timeout for processing (10s)
  maxSpeakingTimeMs: number // Timeout for speaking (30s)
}
```

### Keyboard Shortcuts

| Key            | Action               |
| -------------- | -------------------- |
| `Space`        | Start/stop listening |
| `Escape`       | Close modal          |
| `Cmd/Ctrl + S` | Stop AI speaking     |
| `Cmd/Ctrl + R` | Retry conversation   |

## Customization

### Styling

The modal uses styled-components with theme support:

```tsx
// Custom theme colors
const theme = {
  colors: {
    primary: '#667eea',
    secondary: '#f3f4f6',
    background: '#ffffff',
    text: '#374151',
    // ... more colors
  }
}

// Use with ThemeProvider
<ThemeProvider theme={theme}>
  <VoiceChatModal {...props} />
</ThemeProvider>
```

### Voice Providers

Extend with custom STT/TTS providers:

```tsx
// Custom STT provider
class CustomSTTProvider implements STTProvider {
  async start(options: { language: string }) {
    // Your STT implementation
  }

  onPartial(callback: (text: string) => void) {
    // Handle partial results
  }

  // ... implement other methods
}

// Register provider
const controller = new ConversationController({
  sttProvider: new CustomSTTProvider(),
  // ... other config
})
```

## Browser Support

### Required APIs

- **Web Speech API** - Chrome/Edge (full), Firefox/Safari (partial)
- **Web Audio API** - All modern browsers
- **MediaDevices** - All modern browsers with HTTPS

### Graceful Degradation

- Falls back to text input when speech APIs unavailable
- Provides clear error messages for unsupported features
- Respects user motion preferences automatically

## Performance

### Optimizations

- Lazy loading of audio processing modules
- Efficient voice activity detection with minimal CPU usage
- Smart audio buffering for reduced latency
- Automatic cleanup and memory management

### Metrics Tracking

- STT/TTS latency measurement
- Conversation success rates
- Error frequency monitoring
- User engagement analytics

## Troubleshooting

### Common Issues

**Microphone not working**

- Ensure HTTPS (required for microphone access)
- Check browser permissions
- Verify microphone is not used by other apps

**Speech recognition not starting**

- Check browser support for Web Speech API
- Verify network connectivity (Chrome requires internet)
- Try different language settings

**TTS voice sounds robotic**

- The system automatically selects the best available voice
- Install additional system voices for better quality
- Check browser's speech synthesis settings

**High latency**

- Reduce VAD sensitivity for faster response
- Check network connection for cloud-based STT
- Use shorter maximum speaking durations

### Debug Mode

Enable debug logging:

```tsx
// Set in browser console
localStorage.setItem('voice-debug', 'true')

// Or programmatically
window.VOICE_DEBUG = true
```

## Contributing

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run voice system tests
npm run test:voice
```

### Code Structure

```
src/features/voice/
├── components/           # React components
│   ├── VoiceChatModal.tsx
│   ├── VoiceChatModalView.tsx
│   └── VoiceIntegration.tsx
├── hooks/               # React hooks
│   └── useVoiceConversation.ts
├── services/            # Core services
│   ├── AudioEngine.ts
│   ├── ConversationController.ts
│   ├── STTService.ts
│   └── TTSService.ts
├── styles/              # Styled components
│   └── VoiceChatModal.styles.ts
├── types/               # TypeScript definitions
│   └── index.ts
├── constants/           # Configuration
│   └── index.ts
└── demo/               # Demo components
    └── VoiceModalDemo.tsx
```

## License

Part of the main application license.
