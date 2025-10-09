import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAssistantStore } from "../state";
import { askAssistant } from "../services";
import { useSpeechInput, useTTS } from "../hooks";
import { AssistantView } from "../views/AssistantView";
import { NameModal } from "../components/NameModal";
import MeetingEmailModal from "../../scheduling/components/MeetingEmailModal";
import { useMeetingDetector } from "../../scheduling/hooks/useMeetingDetector";
import { schedulingController } from "../../scheduling/controllers/schedulingController";
import { Mode } from "../../scheduling/types";

export const AssistantContainer = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);
  const {
    messages,
    isLoading,
    isStreaming,
    voiceEnabled,
    micEnabled,
    currentInput,
    userName,
    addMessage,
    setLoading,
    toggleVoice,
    setCurrentInput,
    setCancelToken,
    cancelRequest,
    setUserName,
    clearMessages,
  } = useAssistantStore();

  const [finalTranscript, setFinalTranscript] = useState("");
  const submitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scheduling state
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [schedulingMode, setSchedulingMode] = useState<Mode>("email");
  const [schedulingError, setSchedulingError] = useState<string>("");
  const [isSchedulingLoading, setIsSchedulingLoading] = useState(false);
  const [modalWasClosed, setModalWasClosed] = useState(false);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    isSupported: speechSupported,
  } = useSpeechInput();
  const {
    isSpeaking,
    speak,
    stopSpeaking,
    isSupported: ttsSupported,
  } = useTTS();

  // Meeting detection hook - memoize messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(
    () =>
      messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp:
          msg.timestamp instanceof Date
            ? msg.timestamp.toISOString()
            : msg.timestamp,
      })),
    [messages]
  );

  const handleModalOpen = useCallback((mode: Mode) => {
    setSchedulingMode(mode);
    setShowSchedulingModal(true);
  }, []);

  const { shouldOpen, suggestedMode } = useMeetingDetector({
    messages: memoizedMessages,
    onModalOpen: handleModalOpen,
    isModalOpen: showSchedulingModal,
  });

  const handleSubmit = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      // Stop any ongoing speech when submitting a new request
      if (isSpeaking) {
        stopSpeaking();
      }

      // If scheduling modal is open, always send to AI API for processing
      if (showSchedulingModal) {
        const userMessage = { role: "user" as const, content: query };
        addMessage(userMessage);
        setCurrentInput("");
        setLoading(true);

        // Create abort controller for this request
        const abortController = new AbortController();
        setCancelToken(abortController);

        try {
          const response = await askAssistant(
            {
              query,
              mode: "text",
              history: messages.slice(-5), // Last 5 messages for context
              userName: userName || undefined,
            },
            abortController.signal
          );

          addMessage({
            role: "assistant",
            content: response.message,
          });

          if (voiceEnabled && ttsSupported) {
            speak(response.message); // Use clean text for TTS
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            console.log("Request was cancelled");
            addMessage({
              role: "assistant",
              content: "Request cancelled.",
            });
          } else {
            console.error("Assistant error:", error);
            addMessage({
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            });
          }
        } finally {
          setLoading(false);
          setCancelToken(null);
        }
        return;
      }

      // Remove client-side meeting keyword detection - let server handle it
      // The server will return appropriate response and set showMeetingPopup flag if needed

      const userMessage = { role: "user" as const, content: query };
      addMessage(userMessage);
      setCurrentInput("");
      setLoading(true);

      // Create abort controller for this request
      const abortController = new AbortController();
      setCancelToken(abortController);

      try {
        const response = await askAssistant(
          {
            query,
            mode: "text",
            history: messages.slice(-5), // Last 5 messages for context
            userName: userName || undefined,
          },
          abortController.signal
        );

        addMessage({
          role: "assistant",
          content: response.message,
        });

        // Check if the response indicates we should show the meeting popup
        if (response.metadata?.showMeetingPopup) {
          setShowSchedulingModal(true);
          setSchedulingMode("meeting");
        }

        if (voiceEnabled && ttsSupported) {
          speak(response.message); // Use clean text for TTS
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Request was cancelled");
          addMessage({
            role: "assistant",
            content: "Request cancelled.",
          });
        } else {
          console.error("Assistant error:", error);
          addMessage({
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          });
        }
      } finally {
        setLoading(false);
        setCancelToken(null);
      }
    },
    [
      messages,
      addMessage,
      setLoading,
      setCurrentInput,
      voiceEnabled,
      ttsSupported,
      speak,
      setCancelToken,
    ]
  );

  const handleMicToggle = useCallback(() => {
    // Stop any ongoing speech when mic is clicked
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      stopListening();
      setFinalTranscript("");
      setCurrentInput("");
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
        submitTimerRef.current = null;
      }
    } else {
      startListening();
    }
  }, [
    isListening,
    startListening,
    stopListening,
    setCurrentInput,
    isSpeaking,
    stopSpeaking,
  ]);

  const handleVoiceToggle = useCallback(() => {
    toggleVoice();
    if (isSpeaking) {
      stopSpeaking();
    }
  }, [toggleVoice, isSpeaking, stopSpeaking]);

  // Handle speech input with pause before submitting
  useEffect(() => {
    if (transcript) {
      setFinalTranscript((prev) => prev + transcript);
    }
  }, [transcript]);

  // Update input display
  useEffect(() => {
    setCurrentInput(finalTranscript + interimTranscript);
  }, [finalTranscript, interimTranscript, setCurrentInput]);

  // Handle submission timer
  useEffect(() => {
    if (finalTranscript || interimTranscript) {
      // Clear existing timer
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
      }

      // Set new timer to submit after 1.5 seconds of silence
      submitTimerRef.current = setTimeout(() => {
        if (finalTranscript.trim()) {
          console.log("Submitting accumulated transcript:", finalTranscript);
          handleSubmit(finalTranscript);
          setFinalTranscript("");
          setCurrentInput("");
          stopListening();
        }
      }, 1500);
    }
  }, [
    finalTranscript,
    interimTranscript,
    handleSubmit,
    stopListening,
    setCurrentInput,
  ]);

  // Clear timer when stopping listening
  useEffect(() => {
    if (!isListening && submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }
  }, [isListening]);

  // Handle scheduling modal opening
  useEffect(() => {
    if (shouldOpen && !showSchedulingModal && !modalWasClosed) {
      setSchedulingMode(suggestedMode);
      setShowSchedulingModal(true);
    }
  }, [shouldOpen, suggestedMode, showSchedulingModal, modalWasClosed]);

  const handleCancelRequest = useCallback(() => {
    cancelRequest();
  }, [cancelRequest]);

  const handleCancelVoice = useCallback(() => {
    stopSpeaking();
  }, [stopSpeaking]);

  const handleNameSubmit = useCallback(
    (name: string) => {
      setUserName(name);
      // Add greeting message
      addMessage({
        role: "assistant",
        content: `Hi ${name}, I am Avinash. We can start our conversation by clicking on the mic or start typing.`,
      });
    },
    [setUserName, addMessage]
  );

  const handleSchedulingSubmit = useCallback(
    async (data: any, mode: Mode) => {
      setIsSchedulingLoading(true);
      setSchedulingError("");

      try {
        await schedulingController.handleSchedulingRequest(
          messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp:
              msg.timestamp instanceof Date
                ? msg.timestamp.toISOString()
                : msg.timestamp,
          })),
          {
            ...data,
            userName: userName || undefined,
          },
          mode
        );
        setShowSchedulingModal(false);
        addMessage({
          role: "assistant",
          content: `I've ${mode === "meeting" ? "scheduled your meeting" : "sent your email"} successfully! please check your email`,
        });
      } catch (error) {
        console.error("Scheduling error:", error);
        setSchedulingError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsSchedulingLoading(false);
      }
    },
    [messages, addMessage]
  );

  const handleSchedulingClose = useCallback(() => {
    setShowSchedulingModal(false);
    setSchedulingError("");
    setModalWasClosed(true);
  }, []);

  const handleClearSession = useCallback(() => {
    // Clear messages and reset session state
    clearMessages();
    setUserName(null);
    setCurrentInput("");
    setFinalTranscript("");
    setModalWasClosed(false);
    setShowSchedulingModal(false);
    setSchedulingError("");
    // Cancel any ongoing requests
    cancelRequest();
  }, [clearMessages, setUserName, setCurrentInput, cancelRequest]);

  return (
    <>
      <AssistantView
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        voiceEnabled={voiceEnabled}
        micEnabled={micEnabled}
        currentInput={currentInput}
        isListening={isListening}
        isSpeaking={isSpeaking}
        speechSupported={speechSupported}
        ttsSupported={ttsSupported}
        userName={userName}
        onSubmit={handleSubmit}
        onInputChange={setCurrentInput}
        onMicToggle={handleMicToggle}
        onVoiceToggle={handleVoiceToggle}
        onCancelRequest={handleCancelRequest}
        onCancelVoice={handleCancelVoice}
        onScheduleToggle={() => setShowSchedulingModal(true)}
        onClearSession={handleClearSession}
        onBack={handleBack}
      />

      <NameModal isOpen={userName === null} onSubmit={handleNameSubmit} />

      <MeetingEmailModal
        isOpen={showSchedulingModal}
        suggestedMode={schedulingMode}
        onSubmit={handleSchedulingSubmit}
        onClose={handleSchedulingClose}
        isLoading={isSchedulingLoading}
        error={schedulingError}
      />
    </>
  );
};
