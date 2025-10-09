// Voice Conversation Modal - View Component

import React from 'react'
import { VoiceState, VoiceMetrics } from '../types'
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  VisualizationContainer,
  VisualizationCircle,
  VisualizationIcon,
  StateIndicator,
  ControlsContainer,
  ControlButton,
  TranscriptContainer,
  TranscriptText,
  ModalFooter,
  ShortcutHint,
} from '../styles/VoiceChatModal.styles'

// Modal view props
interface VoiceChatModalViewProps {
  isOpen: boolean
  state: VoiceState
  transcript: string
  partialTranscript: string
  audioLevel: number
  metrics: VoiceMetrics
  onClose: () => void
  onToggleRecording: () => void
  onStopSpeaking: () => void
  onRetry: () => void
  onContinueChat: () => void
  canToggleRecording: boolean
  canStopSpeaking: boolean
  reducedMotion?: boolean
}

// State descriptions for accessibility and UI
const getStateDescription = (
  state: VoiceState
): { title: string; description: string } => {
  switch (state) {
    case VoiceState.IDLE:
      return {
        title: 'Ready to Listen',
        description: 'Press Space or click the microphone to start speaking',
      }
    case VoiceState.LISTENING:
      return {
        title: 'Listening...',
        description: 'Speak clearly into your microphone',
      }
    case VoiceState.PROCESSING:
      return {
        title: 'Processing...',
        description: 'Converting your speech to text',
      }
    case VoiceState.SPEAKING:
      return {
        title: 'AI Speaking',
        description: 'The AI is responding to your message',
      }
    case VoiceState.ERROR:
      return {
        title: 'Error Occurred',
        description: 'Something went wrong, please try again',
      }
    default:
      return {
        title: 'Voice Chat',
        description: 'Ready for conversation',
      }
  }
}

// Format metrics for display
const formatMetrics = (metrics: VoiceMetrics) => {
  const { sttLatency, ttsLatency, totalConversations, avgResponseTime } =
    metrics

  return {
    sttLatency: sttLatency ? `${Math.round(sttLatency)}ms` : 'N/A',
    ttsLatency: ttsLatency ? `${Math.round(ttsLatency)}ms` : 'N/A',
    totalConversations,
    avgResponseTime: avgResponseTime
      ? `${(avgResponseTime / 1000).toFixed(1)}s`
      : 'N/A',
  }
}

export const VoiceChatModalView: React.FC<VoiceChatModalViewProps> = ({
  isOpen,
  state,
  transcript,
  partialTranscript,
  audioLevel,
  metrics,
  onClose,
  onToggleRecording,
  onStopSpeaking,
  onRetry,
  onContinueChat,
  canToggleRecording,
  canStopSpeaking,
  reducedMotion = false,
}) => {
  const stateInfo = getStateDescription(state)
  const formattedMetrics = formatMetrics(metrics)
  const displayTranscript = partialTranscript || transcript

  // Handle backdrop click to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case ' ':
          if (e.target === document.body) {
            e.preventDefault()
            if (canToggleRecording) {
              onToggleRecording()
            }
          }
          break
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (canStopSpeaking) {
              onStopSpeaking()
            }
          }
          break
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onRetry()
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    isOpen,
    canToggleRecording,
    canStopSpeaking,
    onClose,
    onToggleRecording,
    onStopSpeaking,
    onRetry,
  ])

  if (!isOpen) return null

  return (
    <ModalOverlay
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      aria-describedby="voice-modal-description"
    >
      <ModalContainer>
        {/* Header */}
        <ModalHeader>
          <ModalTitle id="voice-modal-title">Voice Conversation</ModalTitle>
          <CloseButton
            onClick={onClose}
            aria-label="Close voice conversation modal"
            type="button"
          >
            ×
          </CloseButton>
        </ModalHeader>

        {/* Visualization */}
        <VisualizationContainer>
          <VisualizationCircle
            state={state}
            audioLevel={audioLevel}
            reducedMotion={reducedMotion}
            role="img"
            aria-label={`Voice state: ${stateInfo.title}`}
          >
            <VisualizationIcon state={state} />
          </VisualizationCircle>
        </VisualizationContainer>

        {/* State indicator */}
        <StateIndicator state={state}>
          <h3>{stateInfo.title}</h3>
          <p id="voice-modal-description">{stateInfo.description}</p>
        </StateIndicator>

        {/* Transcript */}
        <TranscriptContainer>
          <TranscriptText
            isPartial={!!partialTranscript}
            role="log"
            aria-live="polite"
            aria-label="Voice transcript"
          >
            {displayTranscript}
          </TranscriptText>
        </TranscriptContainer>

        {/* Control buttons */}
        <ControlsContainer>
          <ControlButton
            variant="primary"
            onClick={onToggleRecording}
            disabled={!canToggleRecording}
            aria-label={
              state === VoiceState.LISTENING
                ? 'Stop listening'
                : 'Start listening'
            }
          >
            {state === VoiceState.LISTENING ? '⏹️' : '🎤'}
            {state === VoiceState.LISTENING ? 'Stop' : 'Listen'}
          </ControlButton>

          {canStopSpeaking && (
            <ControlButton
              variant="secondary"
              onClick={onStopSpeaking}
              aria-label="Stop AI speaking"
            >
              🔇 Stop Speaking
            </ControlButton>
          )}

          {state === VoiceState.ERROR && (
            <ControlButton
              variant="primary"
              onClick={onRetry}
              aria-label="Retry voice conversation"
            >
              🔄 Retry
            </ControlButton>
          )}

          <ControlButton
            variant="secondary"
            onClick={onContinueChat}
            aria-label="Continue conversation in text chat"
          >
            💬 Continue in Chat
          </ControlButton>
        </ControlsContainer>

        {/* Footer with shortcuts and metrics */}
        <ModalFooter>
          <div>
            Conversations: {formattedMetrics.totalConversations} | Avg Response:{' '}
            {formattedMetrics.avgResponseTime}
          </div>

          <ShortcutHint>
            <span>
              <kbd>Space</kbd> Listen
            </span>
            <span>
              <kbd>Cmd+S</kbd> Stop
            </span>
            <span>
              <kbd>Esc</kbd> Close
            </span>
          </ShortcutHint>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default VoiceChatModalView
