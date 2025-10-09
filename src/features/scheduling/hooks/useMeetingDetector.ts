import { useEffect, useState } from 'react'
import { ChatMessage, MeetingDetectorResult, Mode } from '../types'
import { MEETING_KEYWORDS, EMAIL_KEYWORDS } from '../consts'

interface UseMeetingDetectorProps {
  messages: ChatMessage[]
  onModalOpen?: (mode: Mode) => void
  aiClassifier?: (
    messages: ChatMessage[]
  ) => Promise<{ mode: Mode; confidence: number } | null>
}

export const useMeetingDetector = ({
  messages,
  onModalOpen,
  aiClassifier,
  isModalOpen = false,
}: UseMeetingDetectorProps & {
  isModalOpen?: boolean
}): MeetingDetectorResult => {
  const [result, setResult] = useState<MeetingDetectorResult>({
    shouldOpen: false,
    suggestedMode: 'email',
    confidence: 0,
  })

  useEffect(() => {
    const detectMeetingIntent = async () => {
      if (messages.length === 0) return

      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role !== 'user') return

      const content = lastMessage.content.toLowerCase()

      // Check for explicit keywords
      const hasMeetingKeywords = MEETING_KEYWORDS.some((keyword) =>
        content.includes(keyword)
      )
      const hasEmailKeywords = EMAIL_KEYWORDS.some((keyword) =>
        content.includes(keyword)
      )

      // Check for explicit button clicks or commands
      const isExplicitRequest =
        content.includes('schedule') ||
        content.includes('email') ||
        content.includes('meeting')

      let suggestedMode: Mode = 'email'
      let confidence = 0

      if (hasMeetingKeywords && !hasEmailKeywords) {
        suggestedMode = 'meeting'
        confidence = 0.8
      } else if (hasEmailKeywords) {
        suggestedMode = 'email'
        confidence = 0.7
      } else if (isExplicitRequest) {
        suggestedMode = hasMeetingKeywords ? 'meeting' : 'email'
        confidence = 0.6
      }

      // Use AI classifier if available for higher confidence
      if (aiClassifier && confidence < 0.8) {
        try {
          const aiResult = await aiClassifier(messages.slice(-5)) // Last 5 messages
          if (aiResult && aiResult.confidence > confidence) {
            suggestedMode = aiResult.mode
            confidence = aiResult.confidence
          }
        } catch (error) {
          console.warn('AI classifier failed:', error)
        }
      }

      // Trigger modal if confidence is high enough
      const shouldOpen = confidence >= 0.6 || isExplicitRequest

      const newResult: MeetingDetectorResult = {
        shouldOpen,
        suggestedMode,
        confidence,
      }

      setResult(newResult)

      if (shouldOpen && onModalOpen && !isModalOpen) {
        onModalOpen(suggestedMode)
      }
    }

    detectMeetingIntent()
  }, [messages, onModalOpen, aiClassifier])

  return result
}
