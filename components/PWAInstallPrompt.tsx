import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Share,
  PlusSquare,
  Star,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Logo } from './Logo';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isAppStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone;
    setIsStandalone(isAppStandalone);

    if (isAppStandalone) {
      return;
    }

    // Check if dismissed recently (e.g., within the last 7 days)
    const dismissedTime = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissedTime) {
      const now = new Date().getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - parseInt(dismissedTime) < sevenDays) {
        return;
      }
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show prompt after a short delay on iOS
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
      return () => clearTimeout(timer);
    }

    // Android / Desktop handling
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Slight delay to let the page load before showing the prompt
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback: If beforeinstallprompt hasn't fired but we're on Android/Desktop, show our own prompt?
    // beforeinstallprompt is the only reliable way to trigger the native install on Android/Chrome.

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem(
      'pwa_prompt_dismissed',
      new Date().getTime().toString()
    );
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
      {/* Dark blur backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={handleDismiss}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 duration-700 ease-out">
        {/* Dynamic Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-[#2d5a27] opacity-90">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm transition-all z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 pt-16 px-6 sm:px-8 pb-8">
          {/* App Icon */}
          <div className="mx-auto w-24 h-24 bg-white rounded-2xl shadow-xl border-4 border-white flex items-center justify-center p-3 mb-5 transform -translate-y-4">
            <Logo className="w-full h-full" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Get the GeoMining App
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Install our official application for lightning-fast access,
              offline capabilities, and a seamless native experience on your
              device.
            </p>

            {/* Premium Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-700 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <span className="ml-1 text-slate-400 font-medium">5.0</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Secure</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-blue-500" />
                <span>Fast</span>
              </div>
            </div>
          </div>

          {/* Install Instructions or Action Buttons */}
          {isIOS ? (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 shadow-inner">
              <p className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  i
                </span>
                How to install on iOS
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    1
                  </div>
                  <p className="text-sm text-slate-600">
                    Tap the{' '}
                    <Share size={16} className="text-blue-500 inline mx-1" />{' '}
                    <strong>Share</strong> button at the bottom of Safari
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    2
                  </div>
                  <p className="text-sm text-slate-600">
                    Scroll down and tap{' '}
                    <strong className="text-slate-900">
                      Add to Home Screen
                    </strong>{' '}
                    <PlusSquare
                      size={16}
                      className="text-slate-600 inline ml-1"
                    />
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full mt-5 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
              >
                Got it, thanks!
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleInstallClick}
                className="w-full bg-[#2d5a27] text-white font-black text-sm py-4 rounded-xl hover:bg-slate-900 shadow-lg shadow-[#2d5a27]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <Download size={18} />
                Install Application
              </button>
              <button
                onClick={handleDismiss}
                className="w-full bg-white text-slate-500 font-bold text-sm py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
