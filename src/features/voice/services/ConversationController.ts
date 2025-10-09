// Voice Conversation Modal - ConversationController
// State machine for orchestrating listen → process → speak → loop cycle

import {
  VoiceState,
  VoiceEvent,
  VoiceSessionState,
  VoiceEventPayload,
  VoiceError,
  VoiceConfig,
  AudioMetrics,
} from '../types'
import {
  DEFAULT_VOICE_CONFIG,
  TIMING,
  SESSION_STORAGE_KEYS,
} from '../constants'
import { AudioEngine } from './AudioEngine'
import { STTService } from './STTService'
import { TTSService } from './TTSService'

// Event emitter for state changes
class EventEmitter {
  protected listeners: Map<string, Function[]> = new Map()

  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(listener)
  }

  off(event: string, listener: Function): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(listener)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(...args))
    }
  }

  protected clearAllListeners(): void {
    this.listeners.clear()
  }
}

export class ConversationController extends EventEmitter {
  private state: VoiceState = VoiceState.IDLE
  private sessionState: VoiceSessionState
  private config: VoiceConfig

  // Services
  private audioEngine: AudioEngine
  private sttService: STTService
  private ttsService: TTSService

  // State management
  private isModalOpen = false
  private isSessionDisabled = false
  private currentTranscript = ''
  private partialTranscript = ''
  private lastError?: string
  private audioLevel = 0

  // Timers and timeouts
  private processingTimeout?: NodeJS.Timeout
  private speakingTimeout?: NodeJS.Timeout
  private autoListenTimeout?: NodeJS.Timeout

  // Metrics
  private metrics: AudioMetrics = {}
  private cycleStartTime = 0

  // Callbacks for AI integration
  private onTranscriptReady?: (transcript: string) => Promise<string>
  private onPartialTranscript?: (transcript: string) => void
  private onStateChange?: (state: VoiceSessionState) => void

  constructor(config: VoiceConfig = DEFAULT_VOICE_CONFIG) {
    super()

    this.config = { ...config }
    this.audioEngine = new AudioEngine()
    this.sttService = new STTService()
    this.ttsService = new TTSService()

    this.sessionState = {
      state: this.state,
      isModalOpen: this.isModalOpen,
      isSessionDisabled: this.isSessionDisabled,
      currentTranscript: this.currentTranscript,
      partialTranscript: this.partialTranscript,
      lastError: this.lastError,
      audioLevel: this.audioLevel,
    }

    this.setupServices()
    this.loadSessionPreferences()
  }

  private setupServices(): void {
    // Audio Engine events
    this.audioEngine.onSpeechStartDetected(() => {
      this.emitEvent(VoiceEvent.LISTEN_START)
    })

    this.audioEngine.onSpeechEndDetected(() => {
      if (this.state === VoiceState.LISTENING) {
        this.transitionTo(VoiceState.PROCESSING)
      }
    })

    this.audioEngine.onAudioLevelChange((level) => {
      this.audioLevel = level
      this.updateSessionState()
    })

    this.audioEngine.onErrorOccurred((error) => {
      this.handleError(error)
    })

    // STT Service events
    this.sttService.onPartialResult((text, metrics) => {
      this.partialTranscript = text
      this.onPartialTranscript?.(text)
      this.emitEvent(VoiceEvent.PARTIAL, { text, metrics })
      this.updateSessionState()
    })

    this.sttService.onFinalResult((text, metrics) => {
      this.currentTranscript = text
      this.partialTranscript = ''
      this.metrics = { ...this.metrics, ...metrics }
      this.emitEvent(VoiceEvent.FINAL, { text, metrics })
      this.updateSessionState()

      // Process the transcript
      this.processTranscript(text)
    })

    this.sttService.onErrorOccurred((error) => {
      this.handleError(error)
    })

    // TTS Service events
    this.ttsService.onSpeakingStart((metrics) => {
      this.metrics = { ...this.metrics, ...metrics }
      this.emitEvent(VoiceEvent.SPEAKING_START, { metrics })
    })

    this.ttsService.onSpeakingEnd((metrics) => {
      this.metrics = { ...this.metrics, ...metrics }
      this.emitEvent(VoiceEvent.SPEAKING_END, { metrics })

      // Auto-restart listening if enabled and modal is open
      if (this.config.autoLoop && this.isModalOpen && !this.isSessionDisabled) {
        this.scheduleAutoListen()
      } else {
        this.transitionTo(VoiceState.IDLE)
      }
    })

    this.ttsService.onErrorOccurred((error) => {
      this.handleError(error)
    })
  }

  private loadSessionPreferences(): void {
    const disabled = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.VOICE_MODAL_DISABLED
    )
    this.isSessionDisabled = disabled === 'true'

    const savedConfig = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.VOICE_CONFIG
    )
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        this.config = { ...this.config, ...parsedConfig }
      } catch (error) {
        console.warn('Failed to parse saved voice config:', error)
      }
    }
  }

  private saveSessionPreferences(): void {
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.VOICE_MODAL_DISABLED,
      this.isSessionDisabled.toString()
    )
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.VOICE_CONFIG,
      JSON.stringify(this.config)
    )
  }

  private transitionTo(newState: VoiceState): void {
    const previousState = this.state
    this.state = newState

    // Clear any existing timeouts
    this.clearTimeouts()

    // Handle state transitions
    switch (newState) {
      case VoiceState.LISTENING:
        this.startListening()
        break

      case VoiceState.PROCESSING:
        this.startProcessing()
        break

      case VoiceState.SPEAKING:
        // Speaking is handled by processTranscript
        break

      case VoiceState.IDLE:
        this.stopAllServices()
        break

      case VoiceState.ERROR:
        this.stopAllServices()
        break
    }

    this.updateSessionState()

    console.log(`Voice state transition: ${previousState} → ${newState}`)
  }

  private async startListening(): Promise<void> {
    try {
      // Initialize services if needed
      if (!this.audioEngine.isReady) {
        await this.audioEngine.initialize()
      }

      // Configure TTS for best quality
      await this.ttsService.configureForBestQuality(this.config.language)

      // Start audio capture
      this.audioEngine.startRecording()

      // Start STT
      await this.sttService.startListening()

      // Set processing timeout
      this.processingTimeout = setTimeout(() => {
        if (this.state === VoiceState.LISTENING) {
          this.handleError({
            code: 'vad_timeout',
            message: 'Voice activity detection timeout',
            recoverable: true,
          })
        }
      }, this.config.maxProcessingTimeMs)
    } catch (error) {
      this.handleError({
        code: 'stt_unavailable',
        message: `Failed to start listening: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recoverable: true,
      })
    }
  }

  private startProcessing(): void {
    // Stop audio capture
    this.audioEngine.stopRecording()

    // Stop STT
    this.sttService.stopListening()

    this.emitEvent(VoiceEvent.PROCESSING_START)
  }

  private async processTranscript(transcript: string): Promise<void> {
    if (!this.onTranscriptReady) {
      console.warn('No transcript handler configured')
      this.transitionTo(VoiceState.IDLE)
      return
    }

    try {
      // Get AI response
      const response = await this.onTranscriptReady(transcript)

      if (response && response.trim()) {
        // Transition to speaking
        this.transitionTo(VoiceState.SPEAKING)

        // Start TTS
        await this.ttsService.speak(response)
      } else {
        // No response, return to listening or idle
        if (this.config.autoLoop && this.isModalOpen) {
          this.scheduleAutoListen()
        } else {
          this.transitionTo(VoiceState.IDLE)
        }
      }
    } catch (error) {
      this.handleError({
        code: 'processing_timeout',
        message: `Failed to process transcript: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recoverable: true,
      })
    }
  }

  private scheduleAutoListen(): void {
    this.autoListenTimeout = setTimeout(() => {
      if (this.isModalOpen && !this.isSessionDisabled) {
        this.transitionTo(VoiceState.LISTENING)
      }
    }, TIMING.AUTO_LISTEN_DELAY_MS)
  }

  private async stopAllServices(): Promise<void> {
    try {
      await Promise.all([
        this.audioEngine.dispose(),
        this.sttService.stopListening(),
        this.ttsService.stop(),
      ])
    } catch (error) {
      console.error('Error stopping services:', error)
    }
  }

  private clearTimeouts(): void {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout)
      this.processingTimeout = undefined
    }

    if (this.speakingTimeout) {
      clearTimeout(this.speakingTimeout)
      this.speakingTimeout = undefined
    }

    if (this.autoListenTimeout) {
      clearTimeout(this.autoListenTimeout)
      this.autoListenTimeout = undefined
    }
  }

  private handleError(error: VoiceError): void {
    console.error('Voice conversation error:', error)

    this.lastError = error.message
    this.transitionTo(VoiceState.ERROR)

    // Emit error event
    this.emitEvent(VoiceEvent.PROCESSING_ERROR, { error })

    // Auto-recovery for recoverable errors
    if (error.recoverable && this.isModalOpen) {
      setTimeout(() => {
        if (this.state === VoiceState.ERROR) {
          this.transitionTo(VoiceState.LISTENING)
        }
      }, TIMING.RETRY_BASE_DELAY_MS)
    }
  }

  private emitEvent(type: VoiceEvent, data?: any): void {
    const payload: VoiceEventPayload = {
      type,
      data,
      timestamp: Date.now(),
    }

    this.emit(type, payload)
  }

  private updateSessionState(): void {
    this.sessionState = {
      state: this.state,
      isModalOpen: this.isModalOpen,
      isSessionDisabled: this.isSessionDisabled,
      currentTranscript: this.currentTranscript,
      partialTranscript: this.partialTranscript,
      lastError: this.lastError,
      audioLevel: this.audioLevel,
    }

    this.onStateChange?.(this.sessionState)
  }

  // Public API
  async openModal(): Promise<void> {
    if (this.isSessionDisabled) {
      console.log('Voice modal is disabled for this session')
      return
    }

    this.isModalOpen = true
    this.cycleStartTime = Date.now()

    // Start listening immediately
    this.transitionTo(VoiceState.LISTENING)

    this.updateSessionState()
  }

  async closeModal(): Promise<void> {
    this.isModalOpen = false

    // Calculate cycle metrics if we had a complete cycle
    if (this.cycleStartTime > 0) {
      this.metrics.loopCycleDuration = Date.now() - this.cycleStartTime
    }

    this.transitionTo(VoiceState.IDLE)
    this.updateSessionState()

    this.emitEvent(VoiceEvent.SESSION_END, { metrics: this.metrics })
  }

  async toggleListening(): Promise<void> {
    if (this.state === VoiceState.LISTENING) {
      this.transitionTo(VoiceState.PROCESSING)
    } else if (
      this.state === VoiceState.IDLE ||
      this.state === VoiceState.ERROR
    ) {
      this.transitionTo(VoiceState.LISTENING)
    }
  }

  async interruptAndListen(): Promise<void> {
    if (this.state === VoiceState.SPEAKING) {
      await this.ttsService.stop()
      this.emitEvent(VoiceEvent.SPEAKING_INTERRUPT)
      this.transitionTo(VoiceState.LISTENING)
    }
  }

  disableForSession(): void {
    this.isSessionDisabled = true
    this.saveSessionPreferences()
    this.closeModal()

    this.emitEvent(VoiceEvent.MODAL_DISABLED_SESSION)
  }

  enableForSession(): void {
    this.isSessionDisabled = false
    this.saveSessionPreferences()
    this.updateSessionState()
  }

  // Configuration
  updateConfig(newConfig: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.saveSessionPreferences()
  }

  // Event handler registration
  onTranscriptComplete(handler: (transcript: string) => Promise<string>): void {
    this.onTranscriptReady = handler
  }

  onPartialTranscriptChange(handler: (transcript: string) => void): void {
    this.onPartialTranscript = handler
  }

  onStateChanged(handler: (state: VoiceSessionState) => void): void {
    this.onStateChange = handler
  }

  // Getters
  get currentState(): VoiceSessionState {
    return this.sessionState
  }

  get isActive(): boolean {
    return this.isModalOpen && this.state !== VoiceState.IDLE
  }

  get canOpenModal(): boolean {
    return (
      !this.isSessionDisabled &&
      STTService.isSupported() &&
      TTSService.isSupported()
    )
  }

  // Cleanup
  async dispose(): Promise<void> {
    this.clearTimeouts()
    await this.stopAllServices()
    this.removeAllListeners()
  }

  private removeAllListeners(): void {
    this.clearAllListeners()
  }
}
