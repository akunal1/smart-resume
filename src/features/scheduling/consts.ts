// Constants for scheduling functionality
export const DEFAULT_TIMEZONE = 'Asia/Kolkata'

export const MEETING_DURATIONS = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
] as const

export const MEETING_KEYWORDS = [
  'schedule',
  'meeting',
  'book a call',
  'set up a time',
  'calendar',
  'appointment',
  'call me',
  'talk later',
  'follow up',
  'discuss',
  'meet',
  'catch up',
  'touch base',
  'sync up',
] as const

export const EMAIL_KEYWORDS = [
  'email',
  'send',
  'mail',
  'contact',
  'reach out',
  'message',
  'write',
  'correspond',
] as const

export const MAX_CONVERSATION_LENGTH = 15000 // characters
export const MAX_MESSAGES_HISTORY = 50
