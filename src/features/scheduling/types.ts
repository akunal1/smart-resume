// Types for scheduling and email functionality
export type Mode = 'email' | 'meeting'

export interface MeetingRequest {
  userEmail: string
  dateISO: string
  endDateISO: string
  description?: string
  attendees: string[]
  timezone: string
  summary: string
  conversation: string
}

export interface EmailRequest {
  userEmail: string
  description?: string
  summary: string
  conversation: string
  icsAttachment?: string
  subject?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface AISummaryResponse {
  summary: string
  suggestedTitle: string
  suggestedMode?: Mode
}

export interface MeetingResponse {
  eventId: string
  htmlLink: string
  hangoutLink: string
}

export interface EmailResponse {
  messageId: string
  status: 'sent'
}

export interface MeetingDetectorResult {
  shouldOpen: boolean
  suggestedMode: Mode
  confidence: number
}
