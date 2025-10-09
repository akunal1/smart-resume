// Voice Conversation Modal - STT Service
// Speech-to-Text service with pluggable provider interface

import { STTProvider, VoiceError } from "../types";
import { DEFAULT_VOICE_CONFIG } from "../constants";

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare var webkitSpeechRecognition: {
  new (): SpeechRecognition;
};

declare var SpeechRecognition: {
  new (): SpeechRecognition;
};

// Web Speech API implementation
export class WebSpeechSTTProvider implements STTProvider {
  private recognition: SpeechRecognition | null = null;
  private isActive = false;

  private onPartialCallback?: (text: string) => void;
  private onFinalCallback?: (text: string) => void;

  constructor() {
    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error("Speech recognition not supported in this browser");
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    // Event handlers
    this.recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        this.onPartialCallback?.(interimTranscript);
      }

      if (finalTranscript) {
        this.onFinalCallback?.(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      // Don't retry on 'aborted' errors - these usually mean another system is using the mic
      if (event.error === "aborted") {
        console.warn(
          "Speech recognition aborted - likely due to another speech system being active"
        );
        this.isActive = false;
        return;
      }

      // Continue listening on recoverable errors
      if (this.isActive && this.isRecoverableError(event.error)) {
        setTimeout(() => {
          if (this.isActive && this.recognition) {
            try {
              this.recognition.start();
            } catch (error) {
              console.error("Failed to restart speech recognition:", error);
              this.isActive = false;
            }
          }
        }, 500); // Increased delay to prevent rapid retries
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if still active
      if (this.isActive) {
        setTimeout(() => {
          if (this.isActive && this.recognition) {
            this.recognition.start();
          }
        }, 50);
      }
    };
  }

  private isRecoverableError(error: string): boolean {
    // Define which errors are recoverable
    // Note: 'aborted' is handled separately and is not recoverable
    const recoverableErrors = ["network", "audio-capture"];
    return recoverableErrors.includes(error);
  }

  async start(options: { language: string }): Promise<void> {
    if (!this.recognition) {
      throw new Error("Speech recognition not available");
    }

    if (this.isActive) {
      this.stop();
    }

    this.recognition.lang = options.language;
    this.isActive = true;

    try {
      this.recognition.start();
    } catch (error) {
      this.isActive = false;
      throw error;
    }
  }

  onPartial(callback: (text: string) => void): void {
    this.onPartialCallback = callback;
  }

  onFinal(callback: (text: string) => void): void {
    this.onFinalCallback = callback;
  }

  feedAudio(): void {
    // Web Speech API doesn't support manual audio feeding
    // This is a no-op for this provider
  }

  async stop(): Promise<void> {
    this.isActive = false;

    if (this.recognition) {
      this.recognition.stop();
    }
  }

  abort(): void {
    this.isActive = false;

    if (this.recognition) {
      // Use stop() as abort() may not be available in all browsers
      this.recognition.stop();
    }
  }
}

// STT Service wrapper
export class STTService {
  private provider: STTProvider;
  private isInitialized = false;
  private currentLanguage = DEFAULT_VOICE_CONFIG.language;

  // Metrics
  private startTime = 0;
  private firstPartialTime = 0;
  private finalTime = 0;

  // Callbacks
  private onPartialTranscript?: (
    text: string,
    metrics?: { timeToFirst?: number }
  ) => void;
  private onFinalTranscript?: (
    text: string,
    metrics?: { timeToFinal?: number }
  ) => void;
  private onError?: (error: VoiceError) => void;

  constructor(provider?: STTProvider) {
    this.provider = provider || new WebSpeechSTTProvider();
    this.setupProvider();
  }

  private setupProvider(): void {
    this.provider.onPartial((text) => {
      if (this.firstPartialTime === 0) {
        this.firstPartialTime = Date.now();
      }

      const metrics = {
        timeToFirst: this.firstPartialTime - this.startTime,
      };

      this.onPartialTranscript?.(text, metrics);
    });

    this.provider.onFinal((text) => {
      this.finalTime = Date.now();

      const metrics = {
        timeToFinal: this.finalTime - this.startTime,
      };

      this.onFinalTranscript?.(text, metrics);
    });
  }

  async initialize(
    language: string = DEFAULT_VOICE_CONFIG.language
  ): Promise<void> {
    try {
      this.currentLanguage = language;
      this.isInitialized = true;
    } catch (error) {
      const voiceError: VoiceError = {
        code: "stt_unavailable",
        message: `Failed to initialize STT: ${error instanceof Error ? error.message : "Unknown error"}`,
        recoverable: false,
      };
      this.onError?.(voiceError);
      throw voiceError;
    }
  }

  async startListening(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      this.startTime = Date.now();
      this.firstPartialTime = 0;
      this.finalTime = 0;

      await this.provider.start({ language: this.currentLanguage });
    } catch (error) {
      const voiceError: VoiceError = {
        code: "stt_unavailable",
        message: `Failed to start STT: ${error instanceof Error ? error.message : "Unknown error"}`,
        recoverable: true,
      };
      this.onError?.(voiceError);
      throw voiceError;
    }
  }

  async stopListening(): Promise<void> {
    await this.provider.stop();
  }

  abortListening(): void {
    this.provider.abort();
  }

  feedAudioData(audioData: Float32Array): void {
    this.provider.feedAudio(audioData);
  }

  setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  // Event handlers
  onPartialResult(
    callback: (text: string, metrics?: { timeToFirst?: number }) => void
  ): void {
    this.onPartialTranscript = callback;
  }

  onFinalResult(
    callback: (text: string, metrics?: { timeToFinal?: number }) => void
  ): void {
    this.onFinalTranscript = callback;
  }

  onErrorOccurred(callback: (error: VoiceError) => void): void {
    this.onError = callback;
  }

  // Static factory methods
  static createWebSpeechProvider(): STTService {
    return new STTService(new WebSpeechSTTProvider());
  }

  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }
}
