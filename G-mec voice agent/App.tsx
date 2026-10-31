import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GoogleGenAI,
  Modality,
  Type,
  FunctionDeclaration,
  Session,
} from '@google/genai';
import { SYSTEM_INSTRUCTION } from './constants';
import { decode, decodeAudioData, createBlob } from './services/audioUtils';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { TranscriptionEntry, AppointmentData } from './types';

// Function Declarations for Gemini
const checkAvailability: FunctionDeclaration = {
  name: 'check_availability',
  parameters: {
    type: Type.OBJECT,
    description:
      'Check if a specific date and time is available in the Google Calendar.',
    properties: {
      date: { type: Type.STRING, description: 'ISO date string' },
      time: { type: Type.STRING, description: 'Time string (e.g. 10:00 AM)' },
    },
    required: ['date', 'time'],
  },
};

const bookAppointment: FunctionDeclaration = {
  name: 'book_appointment',
  parameters: {
    type: Type.OBJECT,
    description: 'Finalizes the booking in the system after user verification.',
    properties: {
      fullName: { type: Type.STRING },
      email: { type: Type.STRING },
      service: { type: Type.STRING },
      date: { type: Type.STRING },
      time: { type: Type.STRING },
      location: { type: Type.STRING },
    },
    required: ['fullName', 'email', 'service', 'date', 'time', 'location'],
  },
};

const App: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>(
    []
  );
  const [lastBooking, setLastBooking] =
    useState<Partial<AppointmentData> | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'connecting' | 'connected' | 'error'
  >('idle');

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<Session> | null>(null);
  const transcriptRef = useRef<{ user: string; agent: string }>({
    user: '',
    agent: '',
  });
  const analyserRef = useRef<AnalyserNode | null>(null);

  const addTranscription = useCallback(
    (role: 'user' | 'agent', text: string) => {
      setTranscriptions((prev) => [
        ...prev,
        { role, text, timestamp: new Date() },
      ]);
    },
    []
  );

  const handleToolCall = async (fc: any) => {
    console.debug('Tool Call:', fc);
    if (fc.name === 'check_availability') {
      const isAvailable = Math.random() > 0.3;
      return isAvailable
        ? 'Available'
        : 'Sorry, that slot is already taken. We have 2:00 PM open instead.';
    }
    if (fc.name === 'book_appointment') {
      setLastBooking(fc.args);
      return 'Appointment successfully booked. A confirmation email has been sent.';
    }
    return 'Operation complete.';
  };

  const startCall = async () => {
    if (!process.env.API_KEY) {
      alert('API Key is missing. Please ensure it is configured.');
      return;
    }

    try {
      setStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Initialize Audio Contexts
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 16000 });
      outputAudioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 24000 });

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      // Use a promise-based approach to handle the session connection
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Sulafat' } },
          },
          tools: [
            { functionDeclarations: [checkAvailability, bookAppointment] },
          ],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            console.debug('Session opened');
            setStatus('connected');
            setIsCalling(true);

            // Microphone stream
            const source = audioContextRef.current!.createMediaStreamSource(
              streamRef.current!
            );
            const scriptProcessor =
              audioContextRef.current!.createScriptProcessor(4096, 1, 1);

            source.connect(analyserRef.current!);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // CRITICAL: Ensure we only send after the session is resolved
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message) => {
            // Handle Transcriptions
            if (message.serverContent?.inputTranscription) {
              transcriptRef.current.user +=
                message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              transcriptRef.current.agent +=
                message.serverContent.outputTranscription.text;
            }
            if (message.serverContent?.turnComplete) {
              if (transcriptRef.current.user)
                addTranscription('user', transcriptRef.current.user);
              if (transcriptRef.current.agent)
                addTranscription('agent', transcriptRef.current.agent);
              transcriptRef.current = { user: '', agent: '' };
            }

            // Handle Audio Output
            const base64Audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outCtx.currentTime
              );

              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outCtx,
                24000,
                1
              );
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.start(nextStartTimeRef.current);

              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Tool Calls
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                const result = await handleToolCall(fc);
                sessionPromise.then((session) => {
                  session.sendToolResponse({
                    functionResponses: {
                      id: fc.id,
                      name: fc.name,
                      response: { result },
                    },
                  });
                });
              }
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach((s) => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Gemini error:', e);
            setStatus('error');
            stopCall();
          },
          onclose: () => {
            console.debug('Session closed');
            stopCall();
          },
        },
      });

      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error('Failed to start call:', err);
      setStatus('error');
    }
  };

  const stopCall = () => {
    setIsCalling(false);
    setStatus('idle');

    // Use the stored promise to close the session if it exists
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then((session) => session.close());
      sessionPromiseRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            G
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              G-MEC Voice Agent
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Production Voice AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : status === 'error' ? 'bg-red-500' : 'bg-slate-300'}`}
          />
          <span className="text-sm font-medium text-slate-600">
            {status.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Controls and Visualizer */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-8 flex flex-col items-center text-center shadow-sm">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isCalling ? 'bg-blue-600 shadow-2xl scale-110' : 'bg-slate-200'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-16 w-16 ${isCalling ? 'text-white' : 'text-slate-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {isCalling
                ? 'Agent is Listening'
                : status === 'error'
                  ? 'Connection Failed'
                  : 'Ready to Assist'}
            </h2>
            <p className="text-sm text-slate-500 mb-8 px-4">
              {status === 'error'
                ? 'There was an issue connecting to the voice service. Please check your API key and try again.'
                : isCalling
                  ? 'G-MEC Voice Agent is currently in the call.'
                  : 'Click start to begin a conversation with our virtual receptionist.'}
            </p>

            {isCalling && (
              <VoiceVisualizer
                isActive={isCalling}
                analyser={analyserRef.current}
              />
            )}

            <button
              onClick={isCalling ? stopCall : startCall}
              disabled={status === 'connecting'}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg active:scale-95 ${
                isCalling
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 disabled:bg-slate-300'
              }`}
            >
              {status === 'connecting'
                ? 'Connecting...'
                : isCalling
                  ? 'End Call'
                  : 'Start Call'}
            </button>
          </div>

          <div className="glass rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Office Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-700 font-medium">
                  Monrovia, Liberia
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-blue-600 font-medium truncate ml-2">
                  info@geominingec.com
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hours:</span>
                <span className="text-slate-700 font-medium">
                  Mon-Sat 10AM-5PM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="text-slate-700 font-medium">
                  30 Min Consultation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Transcript and Summary */}
        <div className="lg:col-span-2 space-y-8 flex flex-col h-[700px]">
          <div className="flex-1 glass rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <span className="font-bold text-slate-800">Live Transcript</span>
              <button
                onClick={() => setTranscriptions([])}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear History
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {transcriptions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p>No activity yet. Start the call to see the transcript.</p>
                </div>
              ) : (
                transcriptions.map((t, i) => (
                  <div
                    key={i}
                    className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm ${
                        t.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] font-bold uppercase tracking-tighter">
                        {t.role === 'user' ? 'You' : 'G-MEC Agent'} •{' '}
                        {t.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      {t.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {lastBooking && (
            <div className="bg-green-600 rounded-3xl p-6 text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Appointment Booked!
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm opacity-90">
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-70">
                    Client
                  </p>
                  <p className="font-medium truncate">{lastBooking.fullName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-70">
                    Service
                  </p>
                  <p className="font-medium truncate">{lastBooking.service}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-70">
                    Date & Time
                  </p>
                  <p className="font-medium">
                    {lastBooking.date} at {lastBooking.time}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-70">
                    Location
                  </p>
                  <p className="font-medium capitalize">
                    {lastBooking.location}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-8 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} GEOMINING & ENVIRONMENTAL CONSULTANCY
        INC. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
