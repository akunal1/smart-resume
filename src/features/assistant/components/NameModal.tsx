import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

interface NameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

// Neural Connection Animation Component
const NeuralConnectionAnimation: React.FC = () => {
  return (
    <AnimationContainer>
      <BrainIcon>🧠</BrainIcon>
      <ConnectionTitle>Establishing Neural Connection</ConnectionTitle>
      <ConnectionSubtitle>
        Initializing AI neural networks...
      </ConnectionSubtitle>

      <NeuralNetwork>
        <Node center>
          <PulseRing />
          <PulseRing delay="0.5s" />
          <PulseRing delay="1s" />
        </Node>

        <ConnectionLine />
        <ConnectionLine delay="0.3s" />
        <ConnectionLine delay="0.6s" />
        <ConnectionLine delay="0.9s" />

        <Node top>
          <DataFlow />
        </Node>
        <Node bottom>
          <DataFlow />
        </Node>
        <Node left>
          <DataFlow />
        </Node>
        <Node right>
          <DataFlow />
        </Node>
      </NeuralNetwork>

      <ProgressBar>
        <ProgressFill />
      </ProgressBar>

      <StatusText>Connecting to neural pathways...</StatusText>
    </AnimationContainer>
  );
};

export const NameModal: React.FC<NameModalProps> = ({ isOpen, onSubmit }) => {
  const [name, setName] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setShowAnimation(true);
      setTimeout(() => {
        onSubmit(name.trim());
        setShowAnimation(false);
      }, 10000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      onSubmit(name.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        {showAnimation ? (
          <NeuralConnectionAnimation />
        ) : (
          <>
            <ModalTitle>AI Neural Assistant</ModalTitle>
            <ModalDescription>
              Connect with Avinash's AI assistant powered by advanced neural
              networks. Enter your name to establish a personalized conversation
              experience.
            </ModalDescription>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <SubmitButton type="submit" disabled={!name.trim()}>
                Initialize Neural Connection
              </SubmitButton>
            </Form>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(12px);

  /* Neural network pattern overlay */
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
        rgba(0, 212, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 75% 75%,
        rgba(139, 92, 246, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 450px;
  width: 90%;
  text-align: center;
  backdrop-filter: ${({ theme }) => theme.backdropFilter};
  box-shadow: ${({ theme }) => theme.boxShadow};
  position: relative;
  z-index: 1;

  /* Neural glow effect */
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
      ${({ theme }) => theme.colors.secondary}
    );
    border-radius: inherit;
    z-index: -1;
    opacity: 0.3;
    animation: neuralGlow 3s ease-in-out infinite alternate;
  }

  @keyframes neuralGlow {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 0.4;
    }
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 50%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  /* Add neural icon */
  &::before {
    content: "🧠";
    display: block;
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    animation: neuralPulse 2s ease-in-out infinite;
  }

  @keyframes neuralPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const ModalDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  line-height: 1.6;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: ${({ theme }) => theme.backdropFilter};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(0, 212, 255, 0.08);
    box-shadow: ${({ theme }) => theme.colors.glow};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme, disabled }) =>
    disabled
      ? "rgba(100, 116, 139, 0.2)"
      : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`};
  color: ${({ theme }) => theme.colors.light};
  border: 1px solid
    ${({ theme, disabled }) =>
      disabled ? "rgba(100, 116, 139, 0.3)" : theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  backdrop-filter: ${({ theme }) => theme.backdropFilter};
  position: relative;
  overflow: hidden;

  /* Neural activation effect */
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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.glow};

    &::before {
      opacity: 0.5;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

// Neural Connection Animation Styles
const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: 400px;
`;

const BrainIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: brainPulse 2s ease-in-out infinite;

  @keyframes brainPulse {
    0%,
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.2);
    }
  }
`;

const ConnectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 50%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textGlow 2s ease-in-out infinite alternate;
`;

const ConnectionSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  font-size: 1rem;
  animation: fadeInOut 3s ease-in-out infinite;
`;

const NeuralNetwork = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const Node = styled.div<{
  center?: boolean;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};

  ${({ center }) =>
    center &&
    `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `}

  ${({ top }) =>
    top &&
    `
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  `}
  
  ${({ bottom }) =>
    bottom &&
    `
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  `}
  
  ${({ left }) =>
    left &&
    `
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  `}
  
  ${({ right }) =>
    right &&
    `
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  `}
`;

const PulseRing = styled.div<{ delay?: string }>`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: pulseRing 2s ease-out infinite;
  animation-delay: ${({ delay }) => delay || "0s"};

  @keyframes pulseRing {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const ConnectionLine = styled.div<{ delay?: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme }) => theme.colors.primary},
    transparent
  );
  transform-origin: left center;
  animation: connectionFlow 1.5s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay || "0s"};

  &:nth-child(2) {
    transform: rotate(45deg);
  }
  &:nth-child(3) {
    transform: rotate(90deg);
  }
  &:nth-child(4) {
    transform: rotate(135deg);
  }

  @keyframes connectionFlow {
    0%,
    100% {
      opacity: 0.3;
      transform: scaleX(0) rotate(${({ delay }) => (delay ? "45deg" : "0deg")});
    }
    50% {
      opacity: 1;
      transform: scaleX(1) rotate(${({ delay }) => (delay ? "45deg" : "0deg")});
    }
  }
`;

const DataFlow = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 50%;
  animation: dataFlow 2s linear infinite;

  @keyframes dataFlow {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    50% {
      transform: scale(1);
      opacity: 0.8;
    }
    100% {
      transform: scale(0);
      opacity: 0;
    }
  }
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  border-radius: 2px;
  animation: progressFill 10s ease-out forwards;

  @keyframes progressFill {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }
`;

const StatusText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  animation: statusPulse 1s ease-in-out infinite alternate;

  @keyframes statusPulse {
    0% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes textGlow {
    0% {
      filter: brightness(1);
    }
    100% {
      filter: brightness(1.2);
    }
  }

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`;
