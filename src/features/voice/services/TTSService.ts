// Voice Conversation Modal - TTS Service
// Text-to-Speech service with AudioContext-based playback and interruption

import { TTSProvider, VoiceError } from '../types'
import { DEFAULT_VOICE_CONFIG } from '../constants'

// Web Speech API TTS implementation
export class WebSpeechTTSProvider implements TTSProvider {
  private speechSynthesis: SpeechSynthesis
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private isSupported = false

  constructor() {
    this.speechSynthesis = window.speechSynthesis
    this.isSupported = 'speechSynthesis' in window

    if (!this.isSupported) {
      throw new Error('Speech synthesis not supported in this browser')
    }
  }

  async speak(
    text: string,
    options?: {
      voice?: string
      rate?: number
      pitch?: number
    }
  ): Promise<{ stop: () => Promise<void> }> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Stop any current speech
      this.speechSynthesis.cancel()

      // Create utterance
      this.currentUtterance = new SpeechSynthesisUtterance(text)

      // Configure voice options
      if (options?.rate) {
        this.currentUtterance.rate = Math.max(0.1, Math.min(10, options.rate))
      }

      if (options?.pitch) {
        this.currentUtterance.pitch = Math.max(0, Math.min(2, options.pitch))
      }

      // Find and set voice
      if (options?.voice) {
        const voices = this.speechSynthesis.getVoices()
        const selectedVoice = voices.find(
          (v) =>
            v.name.toLowerCase().includes(options.voice!.toLowerCase()) ||
            v.lang.toLowerCase().includes(options.voice!.toLowerCase())
        )
        if (selectedVoice) {
          this.currentUtterance.voice = selectedVoice
        }
      }

      // Set up event handlers
      this.currentUtterance.onstart = () => {
        resolve({
          stop: async () => {
            this.speechSynthesis.cancel()
          },
        })
      }

      this.currentUtterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      this.currentUtterance.onend = () => {
        this.currentUtterance = null
      }

      // Start speaking
      this.speechSynthesis.speak(this.currentUtterance)
    })
  }

  stopSpeaking(): void {
    this.speechSynthesis.cancel()
    this.currentUtterance = null
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.speechSynthesis.getVoices()
  }

  get isSpeaking(): boolean {
    return this.speechSynthesis.speaking
  }
}

// Enhanced TTS Service with AudioContext integration
export class TTSService {
  private provider: TTSProvider
  private audioContext: AudioContext | null = null
  private isInitialized = false
  private currentPlayback: { stop: () => Promise<void> } | null = null

  // Metrics
  private speakStartTime = 0
  private speakEndTime = 0

  // Callbacks
  private onSpeakStart?: (metrics?: { ttsLatency?: number }) => void
  private onSpeakEnd?: (metrics?: { speakDuration?: number }) => void
  private onError?: (error: VoiceError) => void

  // Configuration
  private config = {
    voice: DEFAULT_VOICE_CONFIG.ttsVoice,
    rate: DEFAULT_VOICE_CONFIG.ttsRate,
    pitch: DEFAULT_VOICE_CONFIG.ttsPitch,
  }

  constructor(provider?: TTSProvider) {
    this.provider = provider || new WebSpeechTTSProvider()
  }

  async initialize(): Promise<void> {
    try {
      // Initialize AudioContext for enhanced audio control
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)()

      // Handle Safari's user gesture requirement
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      this.isInitialized = true
    } catch (error) {
      const voiceError: VoiceError = {
        code: 'tts_unavailable',
        message: `Failed to initialize TTS: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recoverable: false,
      }
      this.onError?.(voiceError)
      throw voiceError
    }
  }

  async speak(text: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      // Stop any current playback
      await this.stop()

      const requestTime = Date.now()

      // Start speaking
      this.currentPlayback = await this.provider.speak(text, {
        voice: this.config.voice,
        rate: this.config.rate,
        pitch: this.config.pitch,
      })

      this.speakStartTime = Date.now()

      const metrics = {
        ttsLatency: this.speakStartTime - requestTime,
      }

      this.onSpeakStart?.(metrics)

      // Wait for speech to complete
      return new Promise((resolve) => {
        const checkCompletion = () => {
          if (!this.isSpeaking()) {
            this.speakEndTime = Date.now()
            const speakMetrics = {
              speakDuration: this.speakEndTime - this.speakStartTime,
            }
            this.onSpeakEnd?.(speakMetrics)
            this.currentPlayback = null
            resolve()
          } else {
            setTimeout(checkCompletion, 100)
          }
        }
        checkCompletion()
      })
    } catch (error) {
      const voiceError: VoiceError = {
        code: 'tts_unavailable',
        message: `Failed to speak: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recoverable: true,
      }
      this.onError?.(voiceError)
      throw voiceError
    }
  }

  async stop(): Promise<void> {
    if (this.currentPlayback) {
      await this.currentPlayback.stop()
      this.currentPlayback = null
    }

    // Also stop provider directly for immediate effect
    if (this.provider instanceof WebSpeechTTSProvider) {
      this.provider.stopSpeaking()
    }
  }

  isSpeaking(): boolean {
    if (this.provider instanceof WebSpeechTTSProvider) {
      return this.provider.isSpeaking
    }
    return false
  }

  // Configuration methods
  setVoice(voice: string): void {
    this.config.voice = voice
  }

  setRate(rate: number): void {
    this.config.rate = Math.max(0.1, Math.min(10, rate))
  }

  setPitch(pitch: number): void {
    this.config.pitch = Math.max(0, Math.min(2, pitch))
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.provider instanceof WebSpeechTTSProvider) {
      return this.provider.getAvailableVoices()
    }
    return []
  }

  // Get the best available voice for natural speech
  getBestVoice(language: string = 'en-US'): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices()

    // Priority order: Premium voices, then local voices, then any match
    const priorities = [
      // Premium/Neural voices (common names)
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('neural'),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('premium'),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('enhanced'),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('natural'),

      // Gender-specific high quality voices
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('samantha'),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('alex'),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('siri'),

      // Local voices
      (v: SpeechSynthesisVoice) => v.localService,

      // Language match
      (v: SpeechSynthesisVoice) => v.lang.startsWith(language.split('-')[0]),
    ]

    for (const priority of priorities) {
      const matchingVoices = voices.filter(priority)
      if (matchingVoices.length > 0) {
        // Return the first match, preferring local service
        return matchingVoices.sort(
          (a, b) => (b.localService ? 1 : 0) - (a.localService ? 1 : 0)
        )[0]
      }
    }

    // Fallback to first available voice
    return voices.length > 0 ? voices[0] : null
  }

  // Auto-configure for best quality
  async configureForBestQuality(language: string = 'en-US'): Promise<void> {
    const bestVoice = this.getBestVoice(language)
    if (bestVoice) {
      this.setVoice(bestVoice.name)
    }

    // Set optimal rate and pitch for natural speech
    this.setRate(0.9) // Slightly slower for clarity
    this.setPitch(1.0) // Normal pitch
  }

  // Event handlers
  onSpeakingStart(callback: (metrics?: { ttsLatency?: number }) => void): void {
    this.onSpeakStart = callback
  }

  onSpeakingEnd(
    callback: (metrics?: { speakDuration?: number }) => void
  ): void {
    this.onSpeakEnd = callback
  }

  onErrorOccurred(callback: (error: VoiceError) => void): void {
    this.onError = callback
  }

  // Cleanup
  async dispose(): Promise<void> {
    await this.stop()

    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
    }

    this.isInitialized = false
  }

  // Static factory methods
  static createWebSpeechProvider(): TTSService {
    return new TTSService(new WebSpeechTTSProvider())
  }

  static isSupported(): boolean {
    return 'speechSynthesis' in window
  }
}
