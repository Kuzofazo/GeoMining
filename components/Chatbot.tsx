import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  User,
  Bot,
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
} from 'lucide-react';
import Logo from './Logo';
import ChannelSelector from './ChannelSelector';
import VoiceAgent from './VoiceAgent';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { findResponse } from '../constants/knowledgeBase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type SupportView = 'selection' | 'chat' | 'voice';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<SupportView>('selection');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm the GEOMINING Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  } = useSpeechToText();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync transcript to input value
  useEffect(() => {
    if (isListening && transcript) {
      setInputValue(transcript);
    }
  }, [transcript, isListening]);

  const speak = (text: string) => {
    if (!isTTSEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Priority: Natural (Human-like) -> Google (High Quality) -> Standard Female -> Default
    const preferredVoice =
      voices.find(
        (v) =>
          // Edge/Windows "Natural" voices (Highest Quality)
          (v.name.includes('Natural') &&
            v.name.includes('English') &&
            (v.name.includes('US') || v.name.includes('United States'))) ||
          // Chrome High Quality
          v.name.includes('Google US English') ||
          // Common OS Specific Good Voices
          v.name.includes('Samantha') ||
          v.name.includes('Zira')
      ) ||
      voices.find((v) => v.name.includes('Female')) ||
      voices.find((v) => v.lang === 'en-US');

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, view]);

  // Reset view when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('selection'), 300);
    }
  }, [isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const result = findResponse(userMsg.text);
      const botResponseText = result.response;
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      speak(botResponseText);
    }, 10);
  };

  const handleVoiceMessage = useCallback(
    (text: string, sender: 'user' | 'bot') => {
      const newMsg: Message = {
        id: Date.now().toString(),
        text,
        sender,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMsg]);
      // Check for save command in bot response if triggered from voice
      if (sender === 'bot' && text.includes('I’ll save this conversation')) {
        saveConversation();
      }
    },
    []
  );

  const saveConversation = useCallback(() => {
    const timestamp = new Date().toLocaleString();
    const content = messages
      .map(
        (m) =>
          `[${m.timestamp.toLocaleTimeString()}] ${m.sender === 'user' ? 'You' : 'Assistant'}: ${m.text}`
      )
      .join('\n\n');
    const header = `GEOMINING Consultation\nSaved on: ${timestamp}\n----------------------------------------\n\n`;
    const fullContent = header + content;

    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-history-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages]);

  return (
    <>
      {/* WhatsApp Button with Ripple Beacon */}
      <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-4 md:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
        <a
          href="https://wa.me/231777772778"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-full h-full rounded-full shadow-xl bg-[#25D366] text-white hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Contact on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-whatsapp"
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
          </svg>
        </a>
      </div>

      {/* Floating Action Button (Support Toggle) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-16 sm:bottom-24 right-3 sm:right-4 md:right-6 z-50 p-2.5 sm:p-3.5 md:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${
          isOpen
            ? 'bg-amber-500 text-slate-900 rotate-90'
            : 'bg-[#2d5a27] text-white'
        }`}
        aria-label="Toggle Support"
      >
        {isOpen ? (
          <>
            <X size={20} className="sm:hidden" />
            <X size={26} className="hidden sm:block" />
          </>
        ) : (
          <>
            <MessageSquare size={20} className="sm:hidden" />
            <MessageSquare size={26} className="hidden sm:block" />
          </>
        )}
      </button>

      {/* Support Window */}
      <div
        className={`fixed bottom-[104px] md:bottom-[112px] right-3 sm:right-4 md:right-8 z-50 w-[calc(100vw-1.5rem)] sm:w-[400px] max-w-[400px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col transition-all duration-300 origin-bottom-right max-h-[calc(100dvh-130px)] ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {view === 'selection' ? (
          <ChannelSelector
            onSelect={(v) => setView(v)}
            onClose={() => setIsOpen(false)}
          />
        ) : view === 'voice' ? (
          <VoiceAgent
            onBack={() => setView('selection')}
            onClose={() => setIsOpen(false)}
            onMessage={handleVoiceMessage}
          />
        ) : (
          <>
            {/* Message View Header */}
            <div className="bg-[#2d5a27] pt-10 pb-6 px-6 flex items-center gap-5 border-b border-white/10 rounded-t-2xl overflow-hidden relative">
              <button
                onClick={() => setView('selection')}
                aria-label="Go back"
                className="absolute top-2 left-2 p-1.5 text-white/50 hover:text-white transition-colors"
                title="Back"
              >
                <ArrowLeft size={16} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="absolute top-2 right-2 p-1.5 text-white/50 hover:text-white transition-colors"
                title="Close Chat"
              >
                <X size={16} />
              </button>

              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl ring-2 ring-white/20 flex-shrink-0">
                <Logo className="w-full h-full" />
              </div>
              <div>
                <h3 className="text-white font-bold font-heading uppercase tracking-wide text-sm">
                  GEOMINING Support
                </h3>
                <p className="text-white/70 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={saveConversation}
                  aria-label="Save conversation history"
                  className="p-2 rounded-full transition-colors bg-white/10 text-white/50 hover:text-white"
                  title="Save Conversation"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                  aria-label={
                    isTTSEnabled
                      ? 'Disable text-to-speech'
                      : 'Enable text-to-speech'
                  }
                  className={`p-2 rounded-full transition-colors ${isTTSEnabled ? 'bg-amber-500 text-slate-900' : 'bg-white/10 text-white/50 hover:text-white'}`}
                  title={
                    isTTSEnabled
                      ? 'Disable Text-to-Speech'
                      : 'Enable Text-to-Speech'
                  }
                >
                  {isTTSEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[350px] max-h-[60vh]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-transparent'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <User size={16} />
                    ) : (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white ring-1 ring-slate-100 p-1">
                        <Logo className="w-full h-full" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-white text-slate-800 rounded-tr-none border border-slate-100'
                        : 'bg-[#2d5a27] text-white rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-slate-100 flex gap-2 rounded-b-2xl"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isListening ? 'Listening...' : 'Type your message...'
                }
                className={`flex-1 bg-slate-100 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 border-transparent transition-all ${isListening ? 'ring-2 ring-amber-500/50' : ''}`}
              />
              {browserSupportsSpeechRecognition && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  aria-label={
                    isListening ? 'Stop voice input' : 'Start voice input'
                  }
                  className={`p-2.5 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                  title={isListening ? 'Stop recording' : 'Speak message'}
                >
                  {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
              )}
              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Send message"
                className="p-2.5 bg-amber-500 text-slate-900 rounded-full hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Chatbot;
