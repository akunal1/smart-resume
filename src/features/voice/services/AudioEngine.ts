// Voice Conversation Modal - AudioEngine Service
// Handles microphone capture, VAD, and audio processing

import { AUDIO_CONSTRAINTS, AUDIO_SETTINGS, VAD_CONFIG } from '../constants'
import { AudioConstraints, VADConfig, VoiceError } from '../types'

export class AudioEngine {
  private audioContext: AudioContext | null = null
  private mediaStream: MediaStream | null = null
  private sourceNode: MediaStreamAudioSourceNode | null = null
  private analyserNode: AnalyserNode | null = null
  private scriptProcessor: ScriptProcessorNode | null = null

  private isInitialized = false
  private isRecording = false
  private audioLevel = 0

  // VAD state
  private speechStartTime = 0
  private silenceStartTime = 0
  private isSpeechDetected = false
  private vadConfig: VADConfig

  // Callbacks
  private onAudioData?: (audioData: Float32Array) => void
  private onSpeechStart?: () => void
  private onSpeechEnd?: () => void
  private onAudioLevel?: (level: number) => void
  private onError?: (error: VoiceError) => void

  // Audio buffers
  private audioBuffer: Float32Array[] = []
  private preRollBuffer: Float32Array[] = []

  constructor(vadConfig: VADConfig = VAD_CONFIG) {
    this.vadConfig = vadConfig
  }

  async initialize(
    constraints: AudioConstraints = AUDIO_CONSTRAINTS
  ): Promise<void> {
    try {
      // Initialize AudioContext
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)()

      // Handle Safari's user gesture requirement
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: constraints.echoCancellation,
          noiseSuppression: constraints.noiseSuppression,
          autoGainControl: constraints.autoGainControl,
          sampleRate: constraints.sampleRate,
        },
      })

      // Set up audio nodes
      this.setupAudioNodes()

      this.isInitialized = true
    } catch (error) {
      const voiceError: VoiceError = {
        code: 'mic_denied',
        message: `Failed to initialize audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recoverable: false,
      }
      this.onError?.(voiceError)
      throw voiceError
    }
  }

  private setupAudioNodes(): void {
    if (!this.audioContext || !this.mediaStream) return

    // Create source node
    this.sourceNode = this.audioContext.createMediaStreamSource(
      this.mediaStream
    )

    // Create analyser for audio level monitoring
    this.analyserNode = this.audioContext.createAnalyser()
    this.analyserNode.fftSize = AUDIO_SETTINGS.FFT_SIZE
    this.analyserNode.smoothingTimeConstant =
      AUDIO_SETTINGS.SMOOTHING_TIME_CONSTANT
    this.analyserNode.minDecibels = AUDIO_SETTINGS.MIN_DECIBELS
    this.analyserNode.maxDecibels = AUDIO_SETTINGS.MAX_DECIBELS

    // Create script processor for audio data
    // TODO: Replace with AudioWorkletNode for better performance
    // Using ScriptProcessorNode for now due to broader browser support
    this.scriptProcessor = this.audioContext.createScriptProcessor(
      AUDIO_SETTINGS.BUFFER_SIZE,
      1, // Input channels
      1 // Output channels
    )

    this.scriptProcessor.onaudioprocess = (event) => {
      if (!this.isRecording) return

      const inputBuffer = event.inputBuffer
      const audioData = inputBuffer.getChannelData(0)

      // Calculate audio level
      this.updateAudioLevel(audioData)

      // Process VAD
      this.processVAD(audioData)

      // Store audio data
      const audioCopy = new Float32Array(audioData)
      this.audioBuffer.push(audioCopy)

      // Send audio data to callback
      this.onAudioData?.(audioCopy)
    }

    // Connect audio nodes
    this.sourceNode.connect(this.analyserNode)
    this.analyserNode.connect(this.scriptProcessor)
    this.scriptProcessor.connect(this.audioContext.destination)
  }

  private updateAudioLevel(audioData: Float32Array): void {
    // Calculate RMS level
    let sum = 0
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i]
    }

    this.audioLevel = Math.sqrt(sum / audioData.length)
    this.onAudioLevel?.(this.audioLevel)
  }

  private processVAD(audioData: Float32Array): void {
    const currentTime = Date.now()
    const isVoiceActive = this.audioLevel > this.vadConfig.threshold

    if (isVoiceActive) {
      if (!this.isSpeechDetected) {
        // Speech start detected
        this.speechStartTime = currentTime
        this.silenceStartTime = 0

        // Add pre-roll buffer if available
        if (this.preRollBuffer.length > 0) {
          this.audioBuffer.unshift(...this.preRollBuffer)
          this.preRollBuffer = []
        }

        this.isSpeechDetected = true
        this.onSpeechStart?.()
      }
    } else {
      if (this.isSpeechDetected) {
        if (this.silenceStartTime === 0) {
          this.silenceStartTime = currentTime
        }

        // Check if silence duration meets threshold
        const silenceDuration = currentTime - this.silenceStartTime
        const speechDuration = this.silenceStartTime - this.speechStartTime

        if (
          silenceDuration >= this.vadConfig.minSilenceMs &&
          speechDuration >= this.vadConfig.minSpeechMs
        ) {
          // Speech end detected
          this.isSpeechDetected = false
          this.speechStartTime = 0
          this.silenceStartTime = 0
          this.onSpeechEnd?.()
        }
      } else {
        // Store pre-roll audio
        const audioCopy = new Float32Array(audioData)
        this.preRollBuffer.push(audioCopy)

        // Limit pre-roll buffer size
        const maxPreRollFrames = Math.ceil(
          ((this.vadConfig.preRollMs / 1000) *
            (this.audioContext?.sampleRate || 16000)) /
            AUDIO_SETTINGS.BUFFER_SIZE
        )

        if (this.preRollBuffer.length > maxPreRollFrames) {
          this.preRollBuffer.shift()
        }
      }
    }
  }

  startRecording(): void {
    if (!this.isInitialized || this.isRecording) return

    this.isRecording = true
    this.audioBuffer = []
    this.isSpeechDetected = false
    this.speechStartTime = 0
    this.silenceStartTime = 0
  }

  stopRecording(): Float32Array[] {
    if (!this.isRecording) return []

    this.isRecording = false
    const recordedAudio = [...this.audioBuffer]
    this.audioBuffer = []

    return recordedAudio
  }

  getAudioLevel(): number {
    return this.audioLevel
  }

  // Event handlers
  onAudioDataReceived(callback: (audioData: Float32Array) => void): void {
    this.onAudioData = callback
  }

  onSpeechStartDetected(callback: () => void): void {
    this.onSpeechStart = callback
  }

  onSpeechEndDetected(callback: () => void): void {
    this.onSpeechEnd = callback
  }

  onAudioLevelChange(callback: (level: number) => void): void {
    this.onAudioLevel = callback
  }

  onErrorOccurred(callback: (error: VoiceError) => void): void {
    this.onError = callback
  }

  // Cleanup
  async dispose(): Promise<void> {
    this.isRecording = false

    // Stop media tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }

    // Disconnect and cleanup audio nodes
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect()
      this.scriptProcessor = null
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect()
      this.analyserNode = null
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect()
      this.sourceNode = null
    }

    // Close audio context
    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
    }

    this.isInitialized = false
  }

  // Getters
  get isReady(): boolean {
    return this.isInitialized && !this.isRecording
  }

  get isActive(): boolean {
    return this.isRecording
  }

  get sampleRate(): number {
    return this.audioContext?.sampleRate || 16000
  }
}
