import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Mic, ArrowLeft, X } from 'lucide-react';
import VoiceVisualizer from './VoiceVisualizer';
import Logo from './Logo';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { findResponse } from '../constants/knowledgeBase';

interface VoiceAgentProps {
  onBack: () => void;
  onClose: () => void;
  onMessage?: (text: string, sender: 'user' | 'bot') => void;
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({
  onBack,
  onClose,
  onMessage,
}) => {
  const [isCalling, setIsCalling] = useState(false);
  const [agentStatus, setAgentStatus] = useState<
    'idle' | 'listening' | 'thinking' | 'speaking'
  >('idle');
  const [lastTranscript, setLastTranscript] = useState('');
  const [lastBotResponse, setLastBotResponse] = useState('');

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechToText();

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initialize local audio context for visualizer only
  const initAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      }
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const source = audioContextRef.current.createMediaStreamSource(
          streamRef.current
        );
        source.connect(analyserRef.current);
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (err) {
      console.error('Failed to init audio for visualizer:', err);
    }
  };

  const cleanupAudio = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const startCall = async () => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        'Your browser does not support speech recognition. Please try Chrome or Edge.'
      );
      return;
    }
    await initAudio();
    setIsCalling(true);
    setAgentStatus('listening');
    startListening();
  };

  const stopCall = useCallback(() => {
    setIsCalling(false);
    setAgentStatus('idle');
    stopListening();
    resetTranscript();
    window.speechSynthesis.cancel();
    cleanupAudio();
  }, [stopListening, resetTranscript]);

  const speak = useCallback(
    (text: string, shouldEndSession = false) => {
      window.speechSynthesis.cancel();

      // Split text into natural chunks (sentences)
      // This regex splits by periods, question marks, or exclamation marks, keeping the punctuation
      const chunks = text.match(/[^.?!]+[.?!]+|[^.?!]+$/g) || [text];

      let currentChunkIndex = 0;

      const speakChunk = () => {
        if (currentChunkIndex >= chunks.length) {
          // Finished speaking all chunks
          if (shouldEndSession) {
            stopCall();
            onClose();
          } else {
            setAgentStatus('listening');
            // Add delay to prevent hearing own voice (echo cancellation)
            setTimeout(() => {
              if (!window.speechSynthesis.speaking) {
                startListening();
              }
            }, 1200);
          }
          return;
        }

        const chunkText = chunks[currentChunkIndex].trim();
        if (!chunkText) {
          currentChunkIndex++;
          speakChunk();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Voice Selection Logic (Same as before)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              (v.name.includes('Natural') &&
                v.name.includes('English') &&
                (v.name.includes('US') || v.name.includes('United States'))) ||
              v.name.includes('Google US English') ||
              v.name.includes('Samantha') ||
              v.name.includes('Zira')
          ) ||
          voices.find((v) => v.name.includes('Female')) ||
          voices.find((v) => v.lang === 'en-US');

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          setAgentStatus('speaking');
          if (currentChunkIndex === 0) {
            // Only call onMessage for the first chunk to avoid spamming chat
            if (onMessage) {
              onMessage(text, 'bot');
            }
            setLastBotResponse(text);
          }
        };

        utterance.onend = () => {
          currentChunkIndex++;
          // Add "breathing" pause between sentences
          if (currentChunkIndex < chunks.length) {
            // Keep status as speaking during the pause
            setTimeout(speakChunk, 600);
          } else {
            speakChunk(); // Determine end of session
          }
        };

        utterance.onerror = () => {
          // If error, just move to next or finish
          currentChunkIndex++;
          speakChunk();
        };

        window.speechSynthesis.speak(utterance);
      };

      setAgentStatus('thinking');
      setTimeout(() => {
        speakChunk();
      }, 10);
    },
    [startListening, stopCall, onClose]
  );

  // Active Silence Detection
  // Automatically stop listening if user pauses for 700ms
  useEffect(() => {
    if (isCalling && isListening && transcript) {
      const silenceTimer = setTimeout(() => {
        stopListening();
      }, 700);

      return () => clearTimeout(silenceTimer);
    }
  }, [isCalling, isListening, transcript, stopListening]);

  // Helper to normalize text for comparison
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  };

  // Handle incoming transcript logic
  useEffect(() => {
    if (isCalling && !isListening && transcript) {
      if (window.speechSynthesis.speaking) {
        resetTranscript();
        return;
      }

      // Capture and clear immediately
      const currentText = transcript;
      resetTranscript();

      // DEDUPLICATION: Check if the input is just the bot's own echo
      const normInput = normalizeText(currentText);
      const normLastResponse = normalizeText(lastBotResponse);

      // If input is empty or matches last bot response (echo), ignore it
      if (
        !normInput ||
        (normLastResponse && normInput.includes(normLastResponse))
      ) {
        // Resume listening if we ignored it
        setAgentStatus('listening');
        startListening();
        return;
      }

      // User finished speaking (valid input)
      const result = findResponse(currentText);
      setLastTranscript(currentText);

      if (onMessage) {
        onMessage(currentText, 'user');
      }

      const responseToSpeak = result.response;

      speak(responseToSpeak, result.shouldEndSession);
    }
  }, [
    isListening,
    transcript,
    isCalling,
    speak,
    resetTranscript,
    lastBotResponse,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCall();
      window.speechSynthesis.cancel();
    };
  }, [stopCall]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => {
          stopCall();
          onBack();
        }}
        aria-label="Go back"
        className="absolute top-4 left-4 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
        title="Go back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Close Button */}
      <button
        onClick={() => {
          stopCall();
          onClose();
        }}
        aria-label="Close voice assistant"
        className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
        title="Close support"
      >
        <X size={20} />
      </button>

      {/* Voice Status Indicator */}
      <div className="flex flex-col items-center text-center space-y-6 w-full max-w-xs">
        <div
          className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 relative ${
            isCalling
              ? 'bg-[#2d5a27] shadow-[0_0_40px_rgba(45,90,39,0.3)] scale-110'
              : 'bg-white shadow-lg ring-4 ring-slate-100'
          }`}
        >
          {agentStatus === 'listening' && (
            <span className="absolute inset-0 rounded-full bg-[#2d5a27] opacity-20 animate-ping"></span>
          )}
          {agentStatus === 'speaking' && (
            <span className="absolute inset-0 rounded-full bg-amber-500 opacity-20 animate-pulse"></span>
          )}

          {agentStatus === 'listening' ? (
            <Mic size={40} className="text-white" />
          ) : agentStatus === 'speaking' ? (
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center animate-bounce">
              <Logo className="w-12 h-12" />
            </div>
          ) : (
            <Logo className="w-20 h-20" />
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {agentStatus === 'listening'
              ? 'Listening to you...'
              : agentStatus === 'thinking'
                ? 'Processing...'
                : agentStatus === 'speaking'
                  ? 'Agent Speaking'
                  : 'Voice Assistant'}
          </h2>
          <p className="text-sm text-slate-500 mt-1 px-4 min-h-[40px]">
            {isCalling && transcript ? (
              <span className="italic text-slate-400">"{transcript}"</span>
            ) : isCalling ? (
              'Speak now, I am listening...'
            ) : (
              ''
            )}
          </p>
        </div>

        {isCalling && (
          <div className="w-full py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <VoiceVisualizer
              isActive={isCalling}
              analyser={analyserRef.current}
            />
          </div>
        )}

        <button
          onClick={isCalling ? stopCall : startCall}
          className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
            isCalling
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
              : 'bg-[#2d5a27] hover:bg-[#21431d] text-white shadow-green-100'
          }`}
        >
          {isCalling ? (
            <>
              <PhoneOff size={22} />
              End Conversation
            </>
          ) : (
            <>
              <Phone size={22} />
              Start Conversation
            </>
          )}
        </button>

        {!browserSupportsSpeechRecognition && (
          <p className="text-xs text-red-500 mt-4">
            Voice features require a modern browser like Chrome or Edge.
          </p>
        )}
      </div>

      {/* Branding Footer */}
      <div className="absolute bottom-6 flex items-center gap-2 opacity-30">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Local Voice Service
        </span>
      </div>
    </div>
  );
};

export default VoiceAgent;
