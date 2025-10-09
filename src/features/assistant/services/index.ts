import { AskRequest, AskResponse, Message } from '../types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export const askAssistant = async (
  request: AskRequest,
  signal?: AbortSignal
): Promise<AskResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/assistant/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    signal, // Add abort signal
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

export const streamAssistant = (
  request: AskRequest,
  onChunk: (chunk: string) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: Error) => void
): (() => void) => {
  const eventSource = new EventSource(
    `${API_BASE_URL}/api/assistant/ask?stream=true`
  )

  let fullResponse = ''

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.chunk) {
      fullResponse += data.chunk
      onChunk(data.chunk)
    } else if (data.done) {
      onComplete(fullResponse)
      eventSource.close()
    }
  }

  eventSource.onerror = (error) => {
    onError(new Error('Streaming error'))
    eventSource.close()
  }

  // Send the request via POST (since SSE is GET, we need to handle this differently)
  // For simplicity, we'll use fetch for now and implement proper SSE later
  fetch(`${API_BASE_URL}/api/assistant/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...request, options: { streaming: true } }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const result = await response.json()
      onComplete(result.message)
    })
    .catch(onError)

  return () => eventSource.close()
}

export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/health`)
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`)
  }
  return response.json()
}
