export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AssistantState {
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  voiceEnabled: boolean
  micEnabled: boolean
  currentInput: string
  cancelToken: AbortController | null
  userName: string | null
}

export interface AskRequest {
  query: string
  mode: 'text' | 'voice'
  history?: Message[]
  userName?: string
  options?: {
    streaming?: boolean
  }
}

export interface AskResponse {
  message: string
  metadata?: {
    tokens?: number
    model?: string
    showMeetingPopup?: boolean
  }
}
