// Voice Conversation Modal - Core Types

export enum VoiceState {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  SPEAKING = 'speaking',
  ERROR = 'error',
}

export enum VoiceEvent {
  // Listening events
  LISTEN_START = 'voice_listen_start',
  PARTIAL = 'voice_partial',
  FINAL = 'voice_final',

  // Processing events
  PROCESSING_START = 'voice_processing_start',
  PROCESSING_ERROR = 'voice_processing_error',

  // Speaking events
  SPEAKING_START = 'voice_speaking_start',
  SPEAKING_INTERRUPT = 'voice_speaking_interrupt',
  SPEAKING_END = 'voice_speaking_end',

  // Loop control
  LOOP_RESTART = 'voice_loop_restart',
  SESSION_END = 'voice_session_end',
  MODAL_DISABLED_SESSION = 'voice_modal_disabled_session',
}

export interface STTProvider {
  start(options: { language: string }): Promise<void>
  onPartial(callback: (text: string) => void): void
  onFinal(callback: (text: string) => void): void
  feedAudio(chunk: Float32Array): void
  stop(): Promise<void>
  abort(): void
}

export interface TTSProvider {
  speak(
    text: string,
    options?: {
      voice?: string
      rate?: number
      pitch?: number
    }
  ): Promise<{ stop: () => Promise<void> }>
}

export interface VoiceConfig {
  language: string
  vadThreshold: number
  minSpeechMs: number
  minSilenceMs: number
  autoLoop: boolean
  ttsVoice?: string
  ttsRate: number
  ttsPitch: number
  maxProcessingTimeMs: number
  maxSpeakingTimeMs: number
}

export interface AudioConstraints {
  echoCancellation: boolean
  noiseSuppression: boolean
  autoGainControl: boolean
  sampleRate?: number
}

export interface VoiceSessionState {
  state: VoiceState
  isModalOpen: boolean
  isSessionDisabled: boolean
  currentTranscript: string
  partialTranscript: string
  lastError?: string
  audioLevel?: number
}

export interface VoiceEventPayload {
  type: VoiceEvent
  data?: any
  timestamp: number
}

export interface VADConfig {
  threshold: number
  minSilenceMs: number
  minSpeechMs: number
  preRollMs: number
}

export interface AudioMetrics {
  timeToFirstPartial?: number
  timeToFinal?: number
  ttsLatency?: number
  loopCycleDuration?: number
}

export interface VoiceMetrics {
  sttLatency?: number
  ttsLatency?: number
  totalConversations: number
  avgResponseTime?: number
  errorCount: number
  lastError?: string
}

export interface VoiceError {
  code:
    | 'mic_denied'
    | 'stt_unavailable'
    | 'tts_unavailable'
    | 'network_offline'
    | 'vad_timeout'
    | 'processing_timeout'
  message: string
  recoverable: boolean
}
