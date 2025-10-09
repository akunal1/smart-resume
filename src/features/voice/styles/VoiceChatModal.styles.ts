// Voice Conversation Modal - Styled Components

import styled, { keyframes, css } from 'styled-components'
import { VoiceState } from '../types'
import { COLORS, ANIMATION_DURATIONS } from '../constants'

// Modal animations
const modalEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`

const modalExit = keyframes`
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
`

// Wave/ring animations
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
`

const ripple = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

// Modal overlay
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${modalEnter} ${ANIMATION_DURATIONS.MODAL_ENTER}ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    backdrop-filter: none;
    background: rgba(0, 0, 0, 0.8);
  }
`

// Main modal container
export const ModalContainer = styled.div`
  background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
  border-radius: 24px;
  padding: 2rem;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  position: relative;

  @media (prefers-reduced-motion: reduce) {
    backdrop-filter: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    min-width: 320px;
    padding: 1.5rem;
    margin: 1rem;
  }
`

// Header
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, ${COLORS.LISTENING}, ${COLORS.SPEAKING});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme?.colors?.text || '#374151'};
  opacity: 0.7;
  transition: opacity 0.2s ease;
  padding: 0.5rem;
  border-radius: 8px;

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: 2px solid ${COLORS.LISTENING};
    outline-offset: 2px;
  }
`

// Visualization container
export const VisualizationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  margin: 2rem 0;
  position: relative;
`

// State-based visualization styles
const getVisualizationColor = (state: VoiceState) => {
  switch (state) {
    case VoiceState.LISTENING:
      return COLORS.LISTENING
    case VoiceState.PROCESSING:
      return COLORS.PROCESSING
    case VoiceState.SPEAKING:
      return COLORS.SPEAKING
    case VoiceState.ERROR:
      return COLORS.ERROR
    default:
      return COLORS.IDLE
  }
}

const getVisualizationAnimation = (
  state: VoiceState,
  reducedMotion: boolean
) => {
  if (reducedMotion) return 'none'

  switch (state) {
    case VoiceState.LISTENING:
      return css`
        animation: ${pulse} 1s ease-in-out infinite;
      `
    case VoiceState.PROCESSING:
      return css`
        animation: ${rotate} 2s linear infinite;
      `
    case VoiceState.SPEAKING:
      return css`
        animation: ${ripple} 1s ease-out infinite;
      `
    default:
      return 'none'
  }
}

// Main visualization element
export const VisualizationCircle = styled.div<{
  state: VoiceState
  audioLevel?: number
  reducedMotion?: boolean
}>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ state }) => getVisualizationColor(state)};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;

  ${({ state, reducedMotion = false }) =>
    getVisualizationAnimation(state, reducedMotion)}

  /* Audio level scaling */
  transform: scale(${({ audioLevel = 0, state }) =>
    state === VoiceState.LISTENING ? 1 + audioLevel * 0.3 : 1});

  /* State-specific styling */
  ${({ state }) => {
    switch (state) {
      case VoiceState.LISTENING:
        return css`
          box-shadow:
            0 0 20px ${COLORS.LISTENING}40,
            inset 0 0 20px ${COLORS.LISTENING}20;
        `
      case VoiceState.PROCESSING:
        return css`
          background: conic-gradient(
            ${COLORS.PROCESSING},
            transparent,
            ${COLORS.PROCESSING}
          );
          border: 3px solid ${COLORS.PROCESSING};
        `
      case VoiceState.SPEAKING:
        return css`
          box-shadow:
            0 0 30px ${COLORS.SPEAKING}60,
            0 0 60px ${COLORS.SPEAKING}30;
        `
      case VoiceState.ERROR:
        return css`
          background: ${COLORS.ERROR};
          box-shadow: 0 0 20px ${COLORS.ERROR}40;
        `
      default:
        return css`
          background: ${COLORS.IDLE};
        `
    }
  }}

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transform: none !important;
  }
`

// Icon inside the circle
export const VisualizationIcon = styled.div<{ state: VoiceState }>`
  font-size: 2.5rem;
  color: white;

  &::before {
    content: ${({ state }) => {
      switch (state) {
        case VoiceState.LISTENING:
          return '"🎤"'
        case VoiceState.PROCESSING:
          return '"⏳"'
        case VoiceState.SPEAKING:
          return '"🔊"'
        case VoiceState.ERROR:
          return '"❌"'
        default:
          return '"💬"'
      }
    }};
  }
`

// State indicator
export const StateIndicator = styled.div<{ state: VoiceState }>`
  text-align: center;
  margin: 1rem 0;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: ${({ state }) => getVisualizationColor(state)};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme?.colors?.text || '#6b7280'};
    opacity: 0.8;
  }
`

// Control buttons
export const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
`

export const ControlButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: ${COLORS.LISTENING};
          color: white;

          &:hover:not(:disabled) {
            background: ${COLORS.LISTENING}dd;
            transform: translateY(-1px);
          }
        `
      case 'secondary':
        return css`
          background: ${({ theme }) => theme?.colors?.secondary || '#f3f4f6'};
          color: ${({ theme }) => theme?.colors?.text || '#374151'};

          &:hover:not(:disabled) {
            background: ${({ theme }) => theme?.colors?.accent || '#e5e7eb'};
            transform: translateY(-1px);
          }
        `
      case 'danger':
        return css`
          background: ${COLORS.ERROR};
          color: white;

          &:hover:not(:disabled) {
            background: ${COLORS.ERROR}dd;
            transform: translateY(-1px);
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus {
    outline: 2px solid ${COLORS.LISTENING};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none !important;
  }
`

// Transcript display
export const TranscriptContainer = styled.div`
  background: ${({ theme }) => theme?.colors?.background || '#f9fafb'};
  border: 1px solid ${({ theme }) => theme?.colors?.textSecondary || '#e5e7eb'};
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  min-height: 60px;
  max-height: 150px;
  overflow-y: auto;
`

export const TranscriptText = styled.div<{ isPartial?: boolean }>`
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ theme, isPartial }) =>
    isPartial
      ? (theme?.colors?.text || '#6b7280') + '80'
      : theme?.colors?.text || '#374151'};
  font-style: ${({ isPartial }) => (isPartial ? 'italic' : 'normal')};

  &:empty::before {
    content: 'Transcript will appear here...';
    opacity: 0.5;
  }
`

// Footer with shortcuts
export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid
    ${({ theme }) => theme?.colors?.textSecondary || '#e5e7eb'};
  font-size: 0.8rem;
  color: ${({ theme }) => theme?.colors?.text || '#6b7280'};
  opacity: 0.7;
`

export const ShortcutHint = styled.div`
  display: flex;
  gap: 1rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  kbd {
    background: ${({ theme }) => theme?.colors?.secondary || '#f3f4f6'};
    border: 1px solid
      ${({ theme }) => theme?.colors?.textSecondary || '#d1d5db'};
    border-radius: 4px;
    padding: 0.125rem 0.25rem;
    font-size: 0.75rem;
    font-family: monospace;
  }

  @media (max-width: 768px) {
    display: none;
  }
`
