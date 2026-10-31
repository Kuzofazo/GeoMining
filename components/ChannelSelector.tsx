import React from 'react';
import { MessageSquare, Mic, ChevronRight, X } from 'lucide-react';

interface ChannelSelectorProps {
  onSelect: (mode: 'chat' | 'voice') => void;
  onClose: () => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  onSelect,
  onClose,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 bg-white min-h-[400px] relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
          How can we help?
        </h2>
        <p className="text-sm text-slate-500">
          Choose your preferred way to connect with us
        </p>
      </div>

      <div className="w-full space-y-3">
        {/* Chat Option */}
        <button
          onClick={() => onSelect('chat')}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#2d5a27]/30 hover:bg-[#2d5a27]/5 hover:scale-[1.02] transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-[#2d5a27] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-slate-800">Message Support</h3>
            <p className="text-xs text-slate-500">
              Instant text-based assistance
            </p>
          </div>
          <ChevronRight
            size={20}
            className="text-slate-300 group-hover:text-[#2d5a27] transition-colors"
          />
        </button>

        {/* Voice Option */}
        <button
          onClick={() => onSelect('voice')}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-500/30 hover:bg-amber-50/50 hover:scale-[1.02] transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Mic size={24} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-slate-800">Voice Assistant</h3>
            <p className="text-xs text-slate-500">
              Real-time voice conversation
            </p>
          </div>
          <ChevronRight
            size={20}
            className="text-slate-300 group-hover:text-amber-500 transition-colors"
          />
        </button>
      </div>

      <div className="pt-4 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Empowering Your Regional Presence
        </p>
      </div>
    </div>
  );
};

export default ChannelSelector;
