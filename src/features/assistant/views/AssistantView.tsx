import styled from "styled-components";
import { Message } from "../types";
import { useEffect, useRef, useState } from "react";
import { VoiceChatModal } from "../../voice";

// Message content formatter component
const MessageContent = ({ content }: { content: string }) => {
  // Simple approach: render the content with basic HTML for links
  const renderContent = (text: string) => {
    // Replace markdown links with HTML links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: Array<{
      type: "text" | "link";
      content: string;
      url?: string;
    }> = [];

    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before link
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        if (textBefore) {
          parts.push({ type: "text", content: textBefore });
        }
      }

      // Add link
      parts.push({
        type: "link",
        content: match[1], // link text
        url: match[2], // URL
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remaining = text.slice(lastIndex);
      if (remaining) {
        parts.push({ type: "text", content: remaining });
      }
    }

    return parts;
  };

  const parts = renderContent(content);

  return (
    <MessageContentContainer>
      {parts.map((part, index) => {
        if (part.type === "link") {
          return (
            <Link
              key={index}
              href={part.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part.content}
            </Link>
          );
        }
        return <span key={index}>{part.content}</span>;
      })}
    </MessageContentContainer>
  );
};

interface AssistantViewProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  voiceEnabled: boolean;
  micEnabled: boolean;
  currentInput: string;
  isListening: boolean;
  isSpeaking: boolean;
  speechSupported: boolean;
  ttsSupported: boolean;
  userName?: string | null;
  onSubmit: (query: string) => void;
  onInputChange: (input: string) => void;
  onMicToggle: () => void;
  onVoiceToggle: () => void;
  onCancelRequest: () => void;
  onCancelVoice: () => void;
  onScheduleToggle?: () => void;
  onClearSession?: () => void;
  onBack?: () => void;
}

export const AssistantView = ({
  messages,
  isLoading,
  voiceEnabled,
  currentInput,
  isListening,
  isSpeaking,
  speechSupported,
  ttsSupported,
  userName,
  onSubmit,
  onInputChange,
  onMicToggle,
  onVoiceToggle,
  onCancelRequest,
  onCancelVoice,
  onScheduleToggle,
  onClearSession,
  onBack,
}: AssistantViewProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice modal state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when AI completes response (when loading changes from true to false)
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      // Small delay to ensure the UI has updated
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isLoading]);

  // Focus input when voice input stops
  useEffect(() => {
    if (!isListening && inputRef.current) {
      // Small delay to ensure the UI has updated
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isListening]);

  // Focus input on initial mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(currentInput);
    // Focus the input after submission so user can continue typing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Voice modal handlers
  const handleOpenVoiceModal = () => {
    // Stop the old speech system first to avoid conflicts
    if (isListening || isSpeaking) {
      onCancelVoice();
    }
    setIsVoiceModalOpen(true);
  };

  const handleCloseVoiceModal = () => {
    setIsVoiceModalOpen(false);
  };

  const handleContinueChat = (transcript: string) => {
    // Add the voice transcript to the input and submit
    onInputChange(transcript);
    onSubmit(transcript);
    setIsVoiceModalOpen(false);
  };

  const handleTranscriptReady = async (transcript: string): Promise<string> => {
    try {
      // Add user message to chat
      const userMessage = { role: "user" as const, content: transcript };
      // Note: We're not using onSubmit here because we need the response
      // Instead, we'll directly call the AI service

      // Import needed for the AI service call
      const { askAssistant } = await import("../services");
      const { useAssistantStore } = await import("../state");

      // Get current state
      const store = useAssistantStore.getState();

      // Add user message
      store.addMessage(userMessage);

      // Call AI service
      const response = await askAssistant({
        query: transcript,
        mode: "voice",
        history: store.messages.slice(-5), // Last 5 messages for context
        userName: userName || undefined,
      });

      // Add assistant response
      store.addMessage({
        role: "assistant",
        content: response.message,
      });

      // Return the response for TTS
      return response.message;
    } catch (error) {
      console.error("Voice AI error:", error);
      const errorMessage =
        "Sorry, I encountered an error processing your voice message. Please try again.";

      // Add error message to chat
      const { useAssistantStore } = await import("../state");
      const store = useAssistantStore.getState();
      store.addMessage({
        role: "assistant",
        content: errorMessage,
      });

      return errorMessage;
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTopRow>
          {onBack && (
            <BackButton onClick={onBack} title="Back to Resume">
              ← Back
            </BackButton>
          )}
          <TitleContainer>
            {/* <Title
              data-text={userName ? `Hi ${userName}` : "AI Neural Assistant"}
            >
              {userName ? `Hi ${userName}` : "AI Neural Assistant"}
            </Title> */}
            <Disclaimer>
              <span className="text-green-500">Neural Network Active</span> -{" "}
              <span className="text-red-500">
                AI can make mistakes. Please verify important information.
              </span>
            </Disclaimer>
          </TitleContainer>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {onClearSession && (
              <NewSessionButton
                onClick={onClearSession}
                title="Start a new session"
              >
                🗑️ New Session
              </NewSessionButton>
            )}
            <StatusIndicators>
              {isListening && (
                <ListeningIndicator>🎤 Listening...</ListeningIndicator>
              )}
              {isSpeaking && (
                <>
                  <SpeakingIndicator>🔊 Speaking...</SpeakingIndicator>
                  <CancelVoiceButton onClick={onCancelVoice}>
                    ✕ Stop
                  </CancelVoiceButton>
                </>
              )}
            </StatusIndicators>
          </div>
        </HeaderTopRow>
      </Header>

      <ChatContainer ref={chatContainerRef}>
        {messages.length === 0 && (
          <EmptyState>
            <EmptyText>
              Ask me anything about My career or schedule a meeting.
            </EmptyText>
          </EmptyState>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role}>
            <MessageContent content={message.content} />
          </MessageBubble>
        ))}

        {isLoading && (
          <LoadingIndicator>
            <TypingDots>
              <Dot />
              <Dot />
              <Dot />
            </TypingDots>
            <CancelButton onClick={onCancelRequest}>
              ✕ Cancel Request
            </CancelButton>
          </LoadingIndicator>
        )}
      </ChatContainer>

      <InputContainer onSubmit={handleSubmit}>
        <InputWrapper>
          <Input
            ref={inputRef}
            value={currentInput}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
          />
          <InputControls>
            {speechSupported && (
              <InputControlButton
                type="button"
                onClick={onMicToggle}
                active={isListening}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                🎤
              </InputControlButton>
            )}
            {ttsSupported && (
              <InputControlButton
                type="button"
                onClick={onVoiceToggle}
                active={voiceEnabled}
                aria-label={
                  voiceEnabled ? "Disable voice output" : "Enable voice output"
                }
              >
                🔊
              </InputControlButton>
            )}
            {speechSupported && (
              <InputControlButton
                type="button"
                onClick={handleOpenVoiceModal}
                active={isVoiceModalOpen}
                aria-label="Open voice conversation modal"
                title="Voice Conversation (Enhanced)"
              >
                💬
              </InputControlButton>
            )}
            {onScheduleToggle && (
              <InputControlButton
                type="button"
                onClick={onScheduleToggle}
                active={false}
                aria-label="Schedule meeting or send email"
              >
                📅
              </InputControlButton>
            )}
            <SubmitButton type="submit" disabled={isLoading || !currentInput}>
              ➤
            </SubmitButton>
          </InputControls>
        </InputWrapper>
      </InputContainer>

      {/* Enhanced Voice Conversation Modal */}
      <VoiceChatModal
        isOpen={isVoiceModalOpen}
        onClose={handleCloseVoiceModal}
        onContinueChat={handleContinueChat}
        onTranscriptReady={handleTranscriptReady}
        onPartialTranscript={(transcript) => {
          // Real-time transcript updates could update the input field
          console.log("Partial transcript:", transcript);
        }}
        initialMessage="Hello! I'm ready to have a voice conversation with you."
        reducedMotion={false}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: ${({ theme }) => theme.fonts.primary};
  position: relative;
  overflow: hidden;

  /* Subtle gradient overlay inspired by Key Achievements */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(
        circle at 25% 25%,
        rgba(59, 130, 246, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 75% 75%,
        rgba(139, 92, 246, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 50% 50%,
        rgba(16, 185, 129, 0.03) 0%,
        transparent 70%
      );
    pointer-events: none;
    z-index: 0;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 10;
  backdrop-filter: blur(10px);
  border-radius: 0 0 ${({ theme }) => theme.borderRadius}
    ${({ theme }) => theme.borderRadius};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Disclaimer = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.9;
  padding: 2px 8px;
  background: rgba(255, 165, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 165, 0, 0.2);
  font-weight: 500;
  white-space: nowrap;
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const HeaderTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 50%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  font-family: ${({ theme }) => theme.fonts.primary};
  position: relative;

  /* Add a subtle glow effect */
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary} 0%,
      ${({ theme }) => theme.colors.secondary} 50%,
      ${({ theme }) => theme.colors.accent} 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: blur(8px);
    opacity: 0.5;
  }
`;

const StatusIndicators = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const ListeningIndicator = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}20,
    ${({ theme }) => theme.colors.primary}10
  );
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  backdrop-filter: ${({ theme }) => theme.backdropFilter};
  animation: neuralListening 2s ease-in-out infinite;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;

  /* Neural activity dots */
  &::before {
    content: "⚡";
    animation: neuralPulse 1s ease-in-out infinite;
  }

  /* Processing indicator */
  &::after {
    content: "";
    position: absolute;
    right: 8px;
    width: 6px;
    height: 6px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: neuralBeat 0.8s ease-in-out infinite;
  }

  @keyframes neuralListening {
    0%,
    100% {
      box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}40;
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 20px ${({ theme }) => theme.colors.primary}60;
      transform: scale(1.02);
    }
  }

  @keyframes neuralBeat {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
`;

const SpeakingIndicator = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary}20,
    ${({ theme }) => theme.colors.accent}20
  );
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  backdrop-filter: ${({ theme }) => theme.backdropFilter};
  animation: neuralSpeaking 1.2s ease-in-out infinite;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;

  /* Neural speaking wave */
  &::before {
    content: "🔊";
    animation: neuralWave 0.6s ease-in-out infinite;
  }

  /* Voice output indicator */
  &::after {
    content: "";
    position: absolute;
    right: 8px;
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    animation: voiceOutput 0.5s ease-in-out infinite alternate;
  }

  @keyframes neuralSpeaking {
    0%,
    100% {
      box-shadow: 0 0 15px ${({ theme }) => theme.colors.secondary}40;
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 25px ${({ theme }) => theme.colors.secondary}60;
      transform: scale(1.03);
    }
  }

  @keyframes neuralWave {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes voiceOutput {
    0% {
      opacity: 0.3;
      transform: scale(0.6);
    }
    100% {
      opacity: 1;
      transform: scale(1.3);
    }
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  z-index: 5;
  max-width: 1400px; /* Increased from 1000px */
  margin: 0 auto;
  width: 100%;
  scroll-behavior: smooth;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 300px;
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  text-align: center;
  line-height: 1.6;
  max-width: 500px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
  opacity: 0.8;
`;

const MessageBubble = styled.div<{ role: "user" | "assistant" }>`
  align-self: ${({ role }) => (role === "user" ? "flex-end" : "flex-start")};
  max-width: 80%;
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing.md}; /* Reduced from lg */
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ role }) =>
    role === "user"
      ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" // Blue gradient like Key Achievements
      : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"}; // Green gradient for assistant
  color: ${({ theme }) => theme.colors.text};
  border-left: 4px solid
    ${({ role }) =>
      role === "user"
        ? "#3b82f6" // Blue-500 border
        : "#10b981"}; // Green-500 border
  position: relative;
  overflow: visible;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  line-height: 1.6; /* Reduced from 1.7 for more compact */
  font-family: ${({ theme }) => theme.fonts.primary};
  text-align: left;
  white-space: pre-wrap;
  transform: translateZ(0);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  /* Hover effect */
  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  /* Speaking animation for assistant messages */
  ${({ role }) =>
    role === "assistant" &&
    `
    &.speaking {
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
      animation: speak 1s ease-in-out infinite;
    }
  `}

  /* Typing effect disabled */
  &.ai-typing {
    opacity: 0.3;
    filter: blur(4px);
  }
`;

const MessageContentContainer = styled.div`
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

const CodeBlock = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.1);
  background: rgba(59, 130, 246, 0.02);
`;

const CodeHeader = styled.div`
  background: rgba(59, 130, 246, 0.05);
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CodeLanguage = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
`;

const CodeContent = styled.pre`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.9rem;
  line-height: 1.4;
  overflow-x: auto;
  white-space: pre;
`;

const Citation = styled.sup`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  margin-left: 2px;
  vertical-align: super;
`;

const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const LoadingIndicator = styled.div`
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surface},
    rgba(255, 255, 255, 0.03)
  );
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: ${({ theme }) => theme.backdropFilter};
  box-shadow: ${({ theme }) => theme.boxShadow};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  /* Neural processing indicator */
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.secondary}
    );
    border-radius: inherit;
    opacity: 0.3;
    z-index: -1;
    animation: neuralProcessing 2s linear infinite;
  }

  @keyframes neuralProcessing {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
`;

const TypingDots = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  /* Add neural processing text */
  &::before {
    content: "⚡ Processing...";
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
    font-weight: 500;
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  animation: neuralTyping 1.6s infinite ease-in-out;
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}60;

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.3s;
  }

  &:nth-child(3) {
    animation-delay: 0.6s;
  }

  @keyframes neuralTyping {
    0%,
    80%,
    100% {
      transform: scale(0.8);
      opacity: 0.4;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;

const CancelButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CancelVoiceButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const InputContainer = styled.form`
  padding: ${({ theme }) => theme.spacing.md}; /* Reduced from lg */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  position: relative;
  z-index: 10;
  max-width: 1400px; /* Increased to match ChatContainer */
  margin: 0 auto;
  width: 100%;
  backdrop-filter: ${({ theme }) => theme.backdropFilter};

  /* Neural connection line at top */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 100px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
    transform: translateX(-50%);
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.sm};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  transform: translateZ(0);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Subtle glow on focus */
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(59, 130, 246, 0.05);
    transform: translateY(-2px) translateZ(0);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);

    /* Neural activity indicator */
    &::before {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.primary},
        ${({ theme }) => theme.colors.secondary}
      );
      border-radius: inherit;
      opacity: 0.3;
      z-index: -1;
      animation: neuralFlow 2s linear infinite;
    }
  }

  @keyframes neuralFlow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
`;

const Input = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InputControlButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${({ active, theme }) =>
    active
      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
      : "rgba(0, 0, 0, 0.08)"};
  color: ${({ active, theme }) =>
    active ? theme.colors.light : theme.colors.textSecondary};
  border: 1px solid
    ${({ active, theme }) =>
      active ? theme.colors.primary : "rgba(0, 0, 0, 0.1)"};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: ${({ theme }) => theme.backdropFilter};
  position: relative;

  /* Neural pulse effect when active */
  ${({ active, theme }) =>
    active &&
    `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
      border-radius: inherit;
      z-index: -1;
      opacity: 0.5;
      animation: neuralPulse 1.5s ease-in-out infinite;
    }
  `}

  &:hover {
    transform: translateY(-2px);
    background: ${({ active, theme }) =>
      active
        ? `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.accent})`
        : "rgba(255, 255, 255, 0.1)"};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.colors.glow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 44px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  color: ${({ theme }) => theme.colors.light};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: ${({ theme }) => theme.backdropFilter};

  /* Neural pulse ring */
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.accent}
    );
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Shimmer effect */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.glow};
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.accent},
      ${({ theme }) => theme.colors.primary}
    );

    &::before {
      opacity: 1;
    }

    &::after {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    background: rgba(100, 116, 139, 0.2);
    border: 1px solid rgba(100, 116, 139, 0.3);
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const NewSessionButton = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.light};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
