export const ASSISTANT_EVENTS = {
  MESSAGE_RECEIVED: 'assistant:message_received',
  STREAM_START: 'assistant:stream_start',
  STREAM_END: 'assistant:stream_end',
  ERROR: 'assistant:error',
} as const

export const SPEECH_CONFIG = {
  LANG: 'en-US',
  MAX_ALTERNATIVES: 1,
  CONTINUOUS: true,
  INTERIM_RESULTS: true,
} as const

export const TTS_CONFIG = {
  LANG: 'en-US',
  RATE: 0.85, // Slower for more natural, conversational pace
  PITCH: 1.0, // Normal pitch - let the premium voice handle naturalness
  VOLUME: 0.9, // Comfortable volume level
} as const
