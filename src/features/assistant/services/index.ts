import { AskRequest, AskResponse } from "../types";
import { apiCall, getApiBaseUrl, API_CONFIG } from "../../../config/api";

export const askAssistant = async (
  request: AskRequest,
  signal?: AbortSignal
): Promise<AskResponse> => {
  const response = await apiCall(API_CONFIG.ENDPOINTS.ASSISTANT.ASK, {
    method: "POST",
    body: JSON.stringify(request),
    signal, // Add abort signal
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const streamAssistant = (
  request: AskRequest,
  onChunk: (chunk: string) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: Error) => void
): (() => void) => {
  const baseUrl = getApiBaseUrl();
  const eventSource = new EventSource(
    `${baseUrl}${API_CONFIG.ENDPOINTS.ASSISTANT.ASK}?stream=true`
  );

  let fullResponse = "";

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.chunk) {
      fullResponse += data.chunk;
      onChunk(data.chunk);
    } else if (data.done) {
      onComplete(fullResponse);
      eventSource.close();
    }
  };

  eventSource.onerror = () => {
    onError(new Error("Streaming error"));
    eventSource.close();
  };

  // Send the request via POST (since SSE is GET, we need to handle this differently)
  // For simplicity, we'll use fetch for now and implement proper SSE later
  apiCall(API_CONFIG.ENDPOINTS.ASSISTANT.ASK, {
    method: "POST",
    body: JSON.stringify({ ...request, options: { streaming: true } }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const result = await response.json();
      onComplete(result.message);
    })
    .catch(onError);

  return () => eventSource.close();
};

export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await apiCall(API_CONFIG.ENDPOINTS.HEALTH);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return response.json();
};
