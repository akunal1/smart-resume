// Voice Conversation Modal - TTS Service
// Text-to-Speech service with AudioContext-based playback and interruption

import { TTSProvider, VoiceError } from "../types";
import { DEFAULT_VOICE_CONFIG } from "../constants";

// Web Speech API TTS implementation
export class WebSpeechTTSProvider implements TTSProvider {
  private speechSynthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported = false;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.isSupported = "speechSynthesis" in window;

    if (!this.isSupported) {
      throw new Error("Speech synthesis not supported in this browser");
    }

    // Ensure voices are loaded (Chrome workaround)
    this.ensureVoicesLoaded();
  }

  // Ensure voices are loaded before use (Chrome/Safari workaround)
  private ensureVoicesLoaded(): Promise<void> {
    return new Promise((resolve) => {
      const voices = this.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }

      // Wait for voices to be loaded
      let retryCount = 0;
      const maxRetries = 10;

      const checkVoices = () => {
        const voices = this.speechSynthesis.getVoices();
        if (voices.length > 0 || retryCount >= maxRetries) {
          resolve();
        } else {
          retryCount++;
          setTimeout(checkVoices, 100);
        }
      };

      // Listen for voiceschanged event (if supported)
      if ("onvoiceschanged" in this.speechSynthesis) {
        this.speechSynthesis.onvoiceschanged = () => {
          resolve();
        };
      }

      // Also try polling as fallback
      setTimeout(checkVoices, 100);
    });
  }

  async speak(
    text: string,
    options?: {
      voice?: string;
      rate?: number;
      pitch?: number;
    }
  ): Promise<{ stop: () => Promise<void> }> {
    // Ensure voices are loaded before speaking
    await this.ensureVoicesLoaded();

    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      // Stop any current speech
      this.speechSynthesis.cancel();

      // Create utterance
      this.currentUtterance = new SpeechSynthesisUtterance(text);

      // Configure voice options
      this.currentUtterance.rate = options?.rate || 1;
      this.currentUtterance.pitch = options?.pitch || 1;
      this.currentUtterance.volume = 1;

      // Clamp values to safe ranges
      this.currentUtterance.rate = Math.max(
        0.1,
        Math.min(10, this.currentUtterance.rate)
      );
      this.currentUtterance.pitch = Math.max(
        0,
        Math.min(2, this.currentUtterance.pitch)
      );

      // Find and set voice
      if (options?.voice) {
        const voices = this.speechSynthesis.getVoices();
        const selectedVoice = voices.find(
          (v) =>
            v.name.toLowerCase().includes(options.voice!.toLowerCase()) ||
            v.lang.toLowerCase().includes(options.voice!.toLowerCase())
        );
        if (selectedVoice) {
          this.currentUtterance.voice = selectedVoice;
        }
      }

      // Set up timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        this.speechSynthesis.cancel();
        reject(new Error("Speech synthesis timeout"));
      }, 30000); // 30 second timeout

      // Set up event handlers
      this.currentUtterance.onstart = () => {
        clearTimeout(timeoutId);
        resolve({
          stop: async () => {
            clearTimeout(timeoutId);
            this.speechSynthesis.cancel();
          },
        });
      };

      this.currentUtterance.onerror = (event) => {
        clearTimeout(timeoutId);
        console.error("Speech synthesis error:", event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.currentUtterance.onend = () => {
        clearTimeout(timeoutId);
        this.currentUtterance = null;
      };

      this.currentUtterance.onpause = () => {
        console.log("Speech synthesis paused");
      };

      this.currentUtterance.onresume = () => {
        console.log("Speech synthesis resumed");
      };

      // Workaround for Chrome bug where synthesis stops working
      // Resume speech synthesis if it's in a paused state
      if (this.speechSynthesis.paused) {
        this.speechSynthesis.resume();
      }

      // Start speaking
      this.speechSynthesis.speak(this.currentUtterance);

      // Workaround for Chrome: Check if synthesis started within reasonable time
      setTimeout(() => {
        if (this.currentUtterance && !this.speechSynthesis.speaking) {
          console.warn(
            "Speech synthesis may have failed to start, attempting restart..."
          );
          this.speechSynthesis.cancel();
          this.speechSynthesis.speak(this.currentUtterance);
        }
      }, 100);
    });
  }

  stopSpeaking(): void {
    this.speechSynthesis.cancel();
    this.currentUtterance = null;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.speechSynthesis.getVoices();
  }

  get isSpeaking(): boolean {
    return this.speechSynthesis.speaking;
  }
}

// Enhanced TTS Service with AudioContext integration
export class TTSService {
  private provider: TTSProvider;
  private audioContext: AudioContext | null = null;
  private isInitialized = false;
  private currentPlayback: { stop: () => Promise<void> } | null = null;

  // Metrics
  private speakStartTime = 0;
  private speakEndTime = 0;

  // Callbacks
  private onSpeakStart?: (metrics?: { ttsLatency?: number }) => void;
  private onSpeakEnd?: (metrics?: { speakDuration?: number }) => void;
  private onError?: (error: VoiceError) => void;

  // Configuration
  private config = {
    voice: DEFAULT_VOICE_CONFIG.ttsVoice,
    rate: DEFAULT_VOICE_CONFIG.ttsRate,
    pitch: DEFAULT_VOICE_CONFIG.ttsPitch,
  };

  constructor(provider?: TTSProvider) {
    this.provider = provider || new WebSpeechTTSProvider();
  }

  async initialize(): Promise<void> {
    try {
      // Initialize AudioContext for enhanced audio control
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Handle Safari's user gesture requirement
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
    } catch (error) {
      const voiceError: VoiceError = {
        code: "tts_unavailable",
        message: `Failed to initialize TTS: ${error instanceof Error ? error.message : "Unknown error"}`,
        recoverable: false,
      };
      this.onError?.(voiceError);
      throw voiceError;
    }
  }

  async speak(text: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Stop any current playback
      await this.stop();

      const requestTime = Date.now();

      // Split long text into chunks to prevent cutoff
      const chunks = this.splitTextIntoChunks(text);

      this.speakStartTime = Date.now();
      const metrics = {
        ttsLatency: this.speakStartTime - requestTime,
      };
      this.onSpeakStart?.(metrics);

      // Speak each chunk sequentially
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        // Check if we should stop (user might have interrupted)
        if (!this.currentPlayback && i > 0) {
          break;
        }

        // Start speaking this chunk
        this.currentPlayback = await this.provider.speak(chunk, {
          voice: this.config.voice,
          rate: this.config.rate,
          pitch: this.config.pitch,
        });

        // Wait for this chunk to complete before moving to next
        await new Promise<void>((resolve) => {
          const checkCompletion = () => {
            if (!this.isSpeaking()) {
              resolve();
            } else {
              setTimeout(checkCompletion, 100);
            }
          };
          checkCompletion();
        });

        // Small pause between chunks for natural flow
        if (i < chunks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      this.speakEndTime = Date.now();
      const speakMetrics = {
        speakDuration: this.speakEndTime - this.speakStartTime,
      };
      this.onSpeakEnd?.(speakMetrics);
      this.currentPlayback = null;
    } catch (error) {
      const voiceError: VoiceError = {
        code: "tts_unavailable",
        message: `Failed to speak: ${error instanceof Error ? error.message : "Unknown error"}`,
        recoverable: true,
      };
      this.onError?.(voiceError);
      throw voiceError;
    }
  }

  // Split text into manageable chunks for TTS
  private splitTextIntoChunks(
    text: string,
    maxChunkLength: number = 200
  ): string[] {
    if (text.length <= maxChunkLength) {
      return [text];
    }

    const chunks: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/); // Split by sentence endings

    let currentChunk = "";

    for (const sentence of sentences) {
      // If adding this sentence would exceed the limit
      if (
        currentChunk.length + sentence.length > maxChunkLength &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    }

    // Add the last chunk if it has content
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    // If we still have chunks that are too long, split them further
    const finalChunks: string[] = [];
    for (const chunk of chunks) {
      if (chunk.length <= maxChunkLength) {
        finalChunks.push(chunk);
      } else {
        // Split long chunk by phrases or clauses
        const phrases = chunk.split(/(?<=[,;:])\s+/);
        let currentPhrase = "";

        for (const phrase of phrases) {
          if (
            currentPhrase.length + phrase.length > maxChunkLength &&
            currentPhrase.length > 0
          ) {
            finalChunks.push(currentPhrase.trim());
            currentPhrase = phrase;
          } else {
            currentPhrase += (currentPhrase ? " " : "") + phrase;
          }
        }

        if (currentPhrase.trim()) {
          finalChunks.push(currentPhrase.trim());
        }
      }
    }

    return finalChunks.filter((chunk) => chunk.trim().length > 0);
  }

  async stop(): Promise<void> {
    if (this.currentPlayback) {
      await this.currentPlayback.stop();
      this.currentPlayback = null;
    }

    // Also stop provider directly for immediate effect
    if (this.provider instanceof WebSpeechTTSProvider) {
      this.provider.stopSpeaking();
    }
  }

  isSpeaking(): boolean {
    if (this.provider instanceof WebSpeechTTSProvider) {
      return this.provider.isSpeaking;
    }
    return false;
  }

  // Configuration methods
  setVoice(voice: string): void {
    this.config.voice = voice;
  }

  setRate(rate: number): void {
    this.config.rate = Math.max(0.1, Math.min(10, rate));
  }

  setPitch(pitch: number): void {
    this.config.pitch = Math.max(0, Math.min(2, pitch));
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.provider instanceof WebSpeechTTSProvider) {
      return this.provider.getAvailableVoices();
    }
    return [];
  }

  // Get the best available voice for natural speech
  getBestVoice(language: string = "en-US"): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();

    // Priority order: Premium voices, then local voices, then any match
    const priorities = [
      // Premium/Neural voices (common names)
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes("neural"),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes("premium"),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes("enhanced"),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes("natural"),

      // Gender-specific high quality voices
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes("samantha"),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes("alex"),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes("siri"),

      // Local voices
      (v: SpeechSynthesisVoice) => v.localService,

      // Language match
      (v: SpeechSynthesisVoice) => v.lang.startsWith(language.split("-")[0]),
    ];

    for (const priority of priorities) {
      const matchingVoices = voices.filter(priority);
      if (matchingVoices.length > 0) {
        // Return the first match, preferring local service
        return matchingVoices.sort(
          (a, b) => (b.localService ? 1 : 0) - (a.localService ? 1 : 0)
        )[0];
      }
    }

    // Fallback to first available voice
    return voices.length > 0 ? voices[0] : null;
  }

  // Auto-configure for best quality
  async configureForBestQuality(language: string = "en-US"): Promise<void> {
    const bestVoice = this.getBestVoice(language);
    if (bestVoice) {
      this.setVoice(bestVoice.name);
    }

    // Set optimal rate and pitch for natural speech
    this.setRate(0.9); // Slightly slower for clarity
    this.setPitch(1.0); // Normal pitch
  }

  // Event handlers
  onSpeakingStart(callback: (metrics?: { ttsLatency?: number }) => void): void {
    this.onSpeakStart = callback;
  }

  onSpeakingEnd(
    callback: (metrics?: { speakDuration?: number }) => void
  ): void {
    this.onSpeakEnd = callback;
  }

  onErrorOccurred(callback: (error: VoiceError) => void): void {
    this.onError = callback;
  }

  // Cleanup
  async dispose(): Promise<void> {
    await this.stop();

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
  }

  // Static factory methods
  static createWebSpeechProvider(): TTSService {
    return new TTSService(new WebSpeechTTSProvider());
  }

  static isSupported(): boolean {
    return "speechSynthesis" in window;
  }
}
