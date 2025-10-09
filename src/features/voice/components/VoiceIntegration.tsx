// Voice Integration Component
// Adds voice conversation capability to the existing chat interface

import React, { useState } from 'react'
import styled from 'styled-components'
import { VoiceChatModal } from '../index'

interface VoiceIntegrationProps {
  onNewMessage?: (message: string) => void
  className?: string
}

const VoiceButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
  box-shadow:
    0 4px 15px rgba(102, 126, 234, 0.4),
    0 0 0 0 rgba(102, 126, 234, 0.7);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 25px rgba(102, 126, 234, 0.6),
      0 0 0 0 rgba(102, 126, 234, 0.7);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow:
      0 4px 15px rgba(102, 126, 234, 0.4),
      0 0 0 3px rgba(102, 126, 234, 0.3);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none !important;
  }
`

const VoiceTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  margin-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.8);
  }

  ${VoiceButton}:hover & {
    opacity: 1;
  }
`

const Container = styled.div`
  position: relative;
  display: inline-block;
`

export const VoiceIntegration: React.FC<VoiceIntegrationProps> = ({
  onNewMessage,
  className,
}) => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  const handleOpenVoiceModal = () => {
    setIsVoiceModalOpen(true)
  }

  const handleCloseVoiceModal = () => {
    setIsVoiceModalOpen(false)
  }

  const handleContinueChat = (transcript: string) => {
    if (transcript && onNewMessage) {
      onNewMessage(transcript)
    }
    setIsVoiceModalOpen(false)
  }

  const handleTranscriptReady = async (transcript: string): Promise<string> => {
    // This would integrate with your existing AI chat system
    // For now, we'll just echo the transcript
    console.log('Processing transcript:', transcript)

    // In a real implementation, this would:
    // 1. Send the transcript to your AI service
    // 2. Get the response
    // 3. Return the response for TTS

    return `I heard you say: "${transcript}". This is a demo response.`
  }

  return (
    <Container className={className}>
      <VoiceButton
        onClick={handleOpenVoiceModal}
        aria-label="Start voice conversation"
        title="Start voice conversation (Space)"
      >
        🎤
        <VoiceTooltip>Voice Chat</VoiceTooltip>
      </VoiceButton>

      <VoiceChatModal
        isOpen={isVoiceModalOpen}
        onClose={handleCloseVoiceModal}
        onContinueChat={handleContinueChat}
        onTranscriptReady={handleTranscriptReady}
        onPartialTranscript={(transcript) => {
          console.log('Partial:', transcript)
        }}
        initialMessage="Hi! I'm ready to chat with you using voice."
        reducedMotion={false}
      />
    </Container>
  )
}

export default VoiceIntegration
