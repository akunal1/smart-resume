import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AssistantState, Message } from "../types";

interface AssistantActions {
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  toggleVoice: () => void;
  toggleMic: () => void;
  setCurrentInput: (input: string) => void;
  clearMessages: () => void;
  updateLastMessage: (content: string) => void;
  setCancelToken: (token: AbortController | null) => void;
  cancelRequest: () => void;
  setUserName: (name: string | null) => void;
}

type AssistantStore = AssistantState & AssistantActions;

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      isStreaming: false,
      voiceEnabled: true,
      micEnabled: false,
      currentInput: "",
      cancelToken: null,
      userName: null,

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      toggleVoice: () =>
        set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      toggleMic: () => set((state) => ({ micEnabled: !state.micEnabled })),
      setCurrentInput: (currentInput) => set({ currentInput }),

      clearMessages: () => set({ messages: [] }),

      updateLastMessage: (content) =>
        set((state) => {
          const messages = [...state.messages];
          if (messages.length > 0) {
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              content,
            };
          }
          return { messages };
        }),

      setCancelToken: (cancelToken) => set({ cancelToken }),

      cancelRequest: () =>
        set((state) => {
          if (state.cancelToken) {
            state.cancelToken.abort();
          }
          return {
            cancelToken: null,
            isLoading: false,
            isStreaming: false,
          };
        }),

      setUserName: (userName) => set({ userName }),
    }),
    {
      name: "assistant-storage",
      partialize: (state) => ({
        messages: state.messages.slice(-10), // Keep last 10 messages
        voiceEnabled: state.voiceEnabled,
        userName: state.userName,
      }),
    }
  )
);
