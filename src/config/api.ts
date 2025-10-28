// API Configuration
interface ApiEndpoints {
  HEALTH: string;
  CONTACT: string;
  ASSISTANT: {
    ASK: string;
  };
  AI: {
    SUMMARY: string;
  };
  MEETINGS: string;
  EMAIL: string;
}

interface ApiConfig {
  BASE_URL: string;
  ENDPOINTS: ApiEndpoints;
  TIMEOUT: number;
}

export const API_CONFIG: ApiConfig = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3002",
  ENDPOINTS: {
    HEALTH: "/api/health",
    CONTACT: "/api/contact",
    ASSISTANT: {
      ASK: "/api/assistant/ask",
    },
    AI: {
      SUMMARY: "/api/ai/summary",
    },
    MEETINGS: "/api/meetings",
    EMAIL: "/api/email",
  },
  TIMEOUT: 30000, // 30 seconds
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get the appropriate base URL for fetch calls
export const getApiBaseUrl = (): string => {
  const isDevelopment = import.meta.env.DEV;
  const useLocalBackend =
    !import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL.includes("localhost");

  if (isDevelopment && useLocalBackend) {
    // In development with local backend, use relative URLs to leverage Vite proxy
    return "";
  } else {
    // In production or when using remote backend, use the full API URL
    return API_CONFIG.BASE_URL;
  }
};

// Helper function for API calls
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};
