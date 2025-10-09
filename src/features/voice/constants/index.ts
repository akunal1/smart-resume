// Voice Conversation Modal - Configuration Constants

import { VoiceConfig, AudioConstraints, VADConfig } from "../types";

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  language: "en-US",
  vadThreshold: 0.01, // Voice activity threshold (0-1)
  minSpeechMs: 500, // Minimum speech duration before processing
  minSilenceMs: 800, // Minimum silence to trigger end-of-speech
  autoLoop: true, // Auto-restart listening after TTS
  ttsRate: 1.0, // Speech rate (0.1-10)
  ttsPitch: 1.0, // Speech pitch (0-2)
  maxProcessingTimeMs: 10000, // Max time for STT processing
  maxSpeakingTimeMs: 30000, // Max time for TTS playback
};

export const AUDIO_CONSTRAINTS: AudioConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 16000, // Optimal for most STT providers
};

export const VAD_CONFIG: VADConfig = {
  threshold: 0.01,
  minSilenceMs: 800,
  minSpeechMs: 500,
  preRollMs: 300, // Pre-roll buffer for speech start
};

export const AUDIO_SETTINGS = {
  BUFFER_SIZE: 4096,
  FFT_SIZE: 2048,
  SMOOTHING_TIME_CONSTANT: 0.85,
  MIN_DECIBELS: -100,
  MAX_DECIBELS: -30,
} as const;

export const TIMING = {
  AUTO_LISTEN_DELAY_MS: 150, // Delay before auto-restarting listen
  STATE_TRANSITION_DELAY_MS: 50, // Delay between state transitions
  RETRY_BASE_DELAY_MS: 1000, // Base delay for exponential backoff
  MAX_RETRIES: 3, // Maximum retry attempts
} as const;

export const SESSION_STORAGE_KEYS = {
  VOICE_MODAL_DISABLED: "voiceModalDisabled",
  VOICE_CONFIG: "voiceConfig",
  VOICE_METRICS: "voiceMetrics",
} as const;

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_LISTEN: " ", // Spacebar
  LISTEN_AGAIN: "l",
  CLOSE_MODAL: "Escape",
} as const;

export const ANIMATION_DURATIONS = {
  MODAL_ENTER: 300,
  MODAL_EXIT: 200,
  WAVE_PULSE: 1000,
  STATE_TRANSITION: 150,
} as const;

export const COLORS = {
  LISTENING: "#3b82f6", // Blue-500 (matching Key Achievements theme)
  PROCESSING: "#f59e0b", // Amber
  SPEAKING: "#10b981", // Green-500 (matching assistant message border)
  ERROR: "#ef4444", // Red
  IDLE: "#64748b", // Slate-500 (matching secondary text)
} as const;
