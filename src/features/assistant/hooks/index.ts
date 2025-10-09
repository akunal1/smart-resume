import { useState, useEffect, useRef, useCallback } from "react";
import { SPEECH_CONFIG, TTS_CONFIG } from "../constants";

export const useSpeechInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.lang = SPEECH_CONFIG.LANG;
        recognitionRef.current.maxAlternatives = SPEECH_CONFIG.MAX_ALTERNATIVES;
        recognitionRef.current.continuous = SPEECH_CONFIG.CONTINUOUS;
        recognitionRef.current.interimResults = SPEECH_CONFIG.INTERIM_RESULTS;

        recognitionRef.current.onresult = (event) => {
          console.log("Speech recognition result:", event);
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          if (finalTranscript) {
            console.log("Final transcript:", finalTranscript);
            setTranscript(finalTranscript);
          }
          setInterimTranscript(interimTranscript);
        };

        recognitionRef.current.onend = () => {
          console.log("Speech recognition ended");
          setIsListening(false);
          setInterimTranscript("");
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error, event);
          setIsListening(false);
          setInterimTranscript("");
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript("");
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    isSupported: !!recognitionRef.current,
  };
};

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Log available voices for debugging
  useEffect(() => {
    const logAvailableVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log("Available TTS voices:");
      voices.forEach((voice, index) => {
        console.log(
          `${index}: ${voice.name} (${voice.lang}) - Local: ${voice.localService}`
        );
      });
    };

    // Log voices when they're loaded
    if (speechSynthesis.getVoices().length > 0) {
      logAvailableVoices();
    } else {
      speechSynthesis.onvoiceschanged = logAvailableVoices;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }

      setIsSpeaking(true);

      // Wait for voices to load if needed
      const selectVoice = () => {
        const voices = speechSynthesis.getVoices();

        // Priority order for most realistic voices available in market
        const voicePriorities = [
          // Premium neural/natural voices (if available)
          "Microsoft Aria Online (Natural)",
          "Microsoft Jenny Online (Natural)",
          "Microsoft Guy Online (Natural)",
          "Microsoft Ana Online (Natural)",
          "Google UK English Female",
          "Google US English Female",
          "Google UK English Male",
          "Google US English Male",

          // High-quality system voices
          "Samantha", // macOS premium voice
          "Alex", // macOS male voice
          "Victoria", // Windows premium voice
          "Hazel", // macOS premium voice
          "Karen", // macOS voice
          "Susan", // macOS voice
          "Veena", // macOS voice
          "Fiona", // macOS voice
          "Moira", // macOS voice
          "Tessa", // macOS voice
          "Microsoft Zira Desktop",
          "Microsoft David Desktop",
          "Microsoft Mark Desktop",
          "Microsoft Aria Desktop",

          // Browser-specific high quality voices
          "Chrome OS US English Female",
          "Chrome OS UK English Female",
        ];

        // First try to find exact matches for premium voices
        for (const voiceName of voicePriorities) {
          const voice = voices.find((v) => v.name === voiceName);
          if (voice) {
            console.log("Selected premium voice:", voice.name);
            return voice;
          }
        }

        // Fallback: Find best available voice by quality indicators
        const premiumVoice = voices.find(
          (voice) =>
            voice.localService &&
            (voice.name.toLowerCase().includes("neural") ||
              voice.name.toLowerCase().includes("natural") ||
              voice.name.toLowerCase().includes("premium") ||
              voice.name.toLowerCase().includes("enhanced") ||
              voice.name.toLowerCase().includes("online"))
        );

        if (premiumVoice) {
          console.log("Selected premium fallback voice:", premiumVoice.name);
          return premiumVoice;
        }

        // Secondary fallback: Best local voice
        const goodLocalVoice = voices.find(
          (voice) =>
            voice.lang === "en-US" &&
            voice.localService &&
            (voice.name.includes("Samantha") ||
              voice.name.includes("Alex") ||
              voice.name.includes("Victoria") ||
              voice.name.includes("Aria"))
        );

        if (goodLocalVoice) {
          console.log("Selected local voice:", goodLocalVoice.name);
          return goodLocalVoice;
        }

        // Final fallback: Any English voice
        const englishVoice = voices.find(
          (voice) => voice.lang === "en-US" || voice.lang.startsWith("en-")
        );

        console.log(
          "Selected fallback voice:",
          englishVoice?.name || "default"
        );
        return englishVoice || voices[0];
      };

      const speakFullText = (selectedVoice: SpeechSynthesisVoice | null) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Use the pre-selected voice
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.lang = TTS_CONFIG.LANG;
        utterance.rate = TTS_CONFIG.RATE;
        utterance.pitch = TTS_CONFIG.PITCH;
        utterance.volume = TTS_CONFIG.VOLUME;

        utterance.onend = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        speechSynthesis.speak(utterance);
      };

      // Get the best available voice
      let selectedVoice = selectVoice();

      // If no voices loaded yet, wait for them
      if (!selectedVoice && speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          selectedVoice = selectVoice();
          speakFullText(selectedVoice || null);
        };
        return;
      }

      // Speak the full text as one utterance
      speakFullText(selectedVoice || null);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stopSpeaking,
    isSupported: "speechSynthesis" in window,
  };
};
