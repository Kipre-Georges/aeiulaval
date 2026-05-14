'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'aeiulaval-pwa-dismissed';

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Already installed?
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    // Detect iOS (no beforeinstallprompt support)
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    if (iOS) {
      // Show iOS hint after 5s on first visit
      const timer = setTimeout(() => setShowIOSHint(true), 5000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // Show prompt after 5s of browsing
      setTimeout(() => setVisible(true), 5000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
      setDeferred(null);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
    setShowIOSHint(false);
  };

  if (!visible && !showIOSHint) return null;

  return (
    <div className="pwa-prompt" role="dialog" aria-labelledby="pwa-title">
      <button className="pwa-close" onClick={dismiss} aria-label="Fermer">×</button>
      <div className="pwa-icon">
        <div className="pwa-icon-stripe" style={{ background: '#FF6B2B' }} />
        <div className="pwa-icon-stripe" style={{ background: '#FFFFFF' }} />
        <div className="pwa-icon-stripe" style={{ background: '#00C853' }} />
      </div>
      <div className="pwa-text">
        <h4 id="pwa-title">La famille à portée de main 🇨🇮</h4>
        {isIOS ? (
          <p>Appuie sur <strong>Partager</strong> → <strong>« Sur l'écran d'accueil »</strong>. Les events, ressources et notifs te suivent partout.</p>
        ) : (
          <p>Installe l'app AEIULAVAL : retrouve les events, les ressources et la communauté en un clic depuis ton écran d'accueil.</p>
        )}
      </div>
      {!isIOS && (
        <button className="pwa-btn" onClick={install}>Akwaba 🚀</button>
      )}
    </div>
  );
}
