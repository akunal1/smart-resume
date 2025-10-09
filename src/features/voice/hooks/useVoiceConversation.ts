// Voice Conversation Modal - Custom Hook
// Manages the conversation controller and provides React integration

import { useEffect, useRef, useState, useCallback } from 'react'
import { VoiceSessionState, VoiceEvent, VoiceState } from '../types'
import { ConversationController } from '../services/ConversationController'
import { KEYBOARD_SHORTCUTS } from '../constants'

interface UseVoiceConversationOptions {
  onTranscriptReady: (transcript: string) => Promise<string>
  onPartialTranscript?: (transcript: string) => void
  onClose: () => void
  isOpen?: boolean // Add isOpen parameter
}

export const useVoiceConversation = ({
  onTranscriptReady,
  onPartialTranscript,
  onClose,
  isOpen = false, // Default to false
}: UseVoiceConversationOptions) => {
  const controllerRef = useRef<ConversationController | null>(null)
  const [sessionState, setSessionState] = useState<VoiceSessionState>({
    state: VoiceState.IDLE,
    isModalOpen: false,
    isSessionDisabled: false,
    currentTranscript: '',
    partialTranscript: '',
    audioLevel: 0,
  })

  // Initialize controller
  useEffect(() => {
    const controller = new ConversationController()
    controllerRef.current = controller

    // Set up event handlers
    controller.onTranscriptComplete(onTranscriptReady)
    controller.onPartialTranscriptChange(onPartialTranscript || (() => {}))
    controller.onStateChanged(setSessionState)

    // Don't auto-start - wait for explicit user action
    // controller.openModal()

    return () => {
      controller.dispose()
    }
  }, [onTranscriptReady, onPartialTranscript])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!controllerRef.current || !isOpen) return // Only work when modal is open

      // Don't trigger shortcuts if user is typing in an input field
      const target = event.target as HTMLElement
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (isInputField) return

      // Prevent default behavior for our shortcuts
      const shortcuts = Object.values(KEYBOARD_SHORTCUTS) as string[]
      const isOurShortcut = shortcuts.includes(event.key)
      if (isOurShortcut) {
        event.preventDefault()
      }

      switch (event.key) {
        case KEYBOARD_SHORTCUTS.TOGGLE_LISTEN:
          controllerRef.current.toggleListening()
          break
        case KEYBOARD_SHORTCUTS.LISTEN_AGAIN:
          controllerRef.current.interruptAndListen()
          break
        case KEYBOARD_SHORTCUTS.CLOSE_MODAL:
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, isOpen]) // Add isOpen to dependencies

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && controllerRef.current) {
        // Pause conversation when page is hidden
        controllerRef.current.closeModal()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Control methods
  const toggleListening = useCallback(async () => {
    await controllerRef.current?.toggleListening()
  }, [])

  const interruptAndListen = useCallback(async () => {
    await controllerRef.current?.interruptAndListen()
  }, [])

  const disableForSession = useCallback(() => {
    controllerRef.current?.disableForSession()
    onClose()
  }, [onClose])

  const enableForSession = useCallback(() => {
    controllerRef.current?.enableForSession()
  }, [])

  const startModal = useCallback(async () => {
    if (controllerRef.current) {
      await controllerRef.current.openModal()
    }
  }, [])

  const stopModal = useCallback(async () => {
    if (controllerRef.current) {
      await controllerRef.current.closeModal()
    }
  }, [])

  const canOpenModal = controllerRef.current?.canOpenModal ?? false

  return {
    sessionState,
    toggleListening,
    interruptAndListen,
    disableForSession,
    enableForSession,
    startModal,
    stopModal,
    canOpenModal,
    controller: controllerRef.current,
  }
}
