// Voice Conversation Modal - Main Component

import React from 'react'
import { VoiceState } from '../types'
import { useVoiceConversation } from '../hooks/useVoiceConversation'
import VoiceChatModalView from './VoiceChatModalView'

interface VoiceChatModalProps {
  isOpen: boolean
  onClose: () => void
  onContinueChat?: (transcript: string) => void
  onTranscriptReady?: (transcript: string) => Promise<string>
  onPartialTranscript?: (transcript: string) => void
  initialMessage?: string
  reducedMotion?: boolean
}

export const VoiceChatModal: React.FC<VoiceChatModalProps> = ({
  isOpen,
  onClose,
  onContinueChat,
  onTranscriptReady,
  onPartialTranscript,
  initialMessage,
  reducedMotion = false,
}) => {
  const {
    sessionState,
    toggleListening,
    interruptAndListen,
    startModal,
    stopModal,
    controller,
  } = useVoiceConversation({
    onTranscriptReady:
      onTranscriptReady ||
      (async (transcript: string) => {
        // Default implementation - just echo the transcript
        return `Echo: ${transcript}`
      }),
    onPartialTranscript:
      onPartialTranscript ||
      ((transcript: string) => {
        console.log('Partial transcript:', transcript)
      }),
    onClose,
    isOpen, // Pass isOpen to prevent keyboard shortcuts when modal is closed
  })

  // Extract state from sessionState
  const state = sessionState.state
  const transcript = sessionState.currentTranscript
  const partialTranscript = sessionState.partialTranscript
  const audioLevel = sessionState.audioLevel || 0
  const isRecording = state === VoiceState.LISTENING

  // Handle modal open/close lifecycle
  React.useEffect(() => {
    if (isOpen) {
      // Start the voice modal when opened
      startModal()
    } else {
      // Stop the voice modal when closed
      stopModal()
    }
  }, [isOpen, startModal, stopModal])

  // Mock metrics for now - would come from the conversation controller
  const metrics = {
    sttLatency: 150,
    ttsLatency: 200,
    totalRoundtripTime: 2100,
    networkLatency: 45,
    totalConversations: 1,
    errorCount: 0,
  }

  // Handle voice recording toggle
  const handleToggleRecording = () => {
    if (isRecording || state === VoiceState.PROCESSING) {
      // If currently recording or processing, just toggle
      toggleListening()
    } else {
      // If idle or speaking, interrupt and start fresh
      interruptAndListen()
    }
  }

  // Handle stop speaking
  const handleStopSpeaking = () => {
    // Note: ConversationController doesn't have direct stop speaking method
    // This would typically interrupt current operations
    toggleListening()
  }

  // Handle retry
  const handleRetry = () => {
    if (controller) {
      controller.interruptAndListen()
    }
  }

  // Handle continue chat - pass transcript to parent
  const handleContinueChat = () => {
    const finalTranscript = transcript || partialTranscript
    if (finalTranscript && onContinueChat) {
      onContinueChat(finalTranscript)
    }
    onClose()
  }

  // Determine what user can do
  const canToggleRecording =
    state === VoiceState.IDLE ||
    state === VoiceState.LISTENING ||
    state === VoiceState.PROCESSING

  const canStopSpeaking = state === VoiceState.SPEAKING

  return (
    <VoiceChatModalView
      isOpen={isOpen}
      onClose={onClose}
      state={state}
      transcript={transcript}
      partialTranscript={partialTranscript}
      audioLevel={audioLevel}
      metrics={metrics}
      onToggleRecording={handleToggleRecording}
      onStopSpeaking={handleStopSpeaking}
      onRetry={handleRetry}
      onContinueChat={handleContinueChat}
      canToggleRecording={canToggleRecording}
      canStopSpeaking={canStopSpeaking}
      reducedMotion={reducedMotion}
    />
  )
}

export default VoiceChatModal
