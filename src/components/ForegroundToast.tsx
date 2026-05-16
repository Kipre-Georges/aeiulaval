'use client';

import { useEffect, useState } from 'react';

interface Toast {
  id: number;
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

declare global {
  interface Window {
    OneSignalDeferred?: any[];
  }
}

export default function ForegroundToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let nextId = 1;

    const removeToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const addToast = (notification: any) => {
      const id = nextId++;
      const toast: Toast = {
        id,
        title: notification.title || notification.heading || 'AEIULAVAL',
        body: notification.body || notification.content || '',
        url: notification.launchURL || notification.url,
        icon: notification.icon,
      };
      setToasts((prev) => [...prev, toast]);
      // auto-dismiss after 6s
      setTimeout(() => removeToast(id), 6000);

      // play a subtle ping
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(880, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        o.start(); o.stop(ctx.currentTime + 0.4);
      } catch (e) { /* sound is best-effort */ }
    };

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(function (OneSignal: any) {
      try {
        OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
          // Prevent default OS display (we show our own)
          event.preventDefault();
          addToast(event.notification);
        });
      } catch (e) { /* fail silently */ }
    });

    // Expose for manual testing in the console: window.aeiulavalToast({title, body})
    (window as any).aeiulavalToast = (data: { title: string; body: string; url?: string }) => addToast(data);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="ft-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className="ft-toast" role="alert">
          <div className="ft-toast-icon" aria-hidden="true">
            <div className="ft-stripe" style={{ background: '#FF6B2B' }} />
            <div className="ft-stripe" style={{ background: '#FFFFFF' }} />
            <div className="ft-stripe" style={{ background: '#00C853' }} />
          </div>
          <div className="ft-toast-body">
            <div className="ft-toast-title">{t.title}</div>
            <div className="ft-toast-text">{t.body}</div>
            {t.url && (
              <a href={t.url} className="ft-toast-link" onClick={() => dismiss(t.id)}>
                Ouvrir →
              </a>
            )}
          </div>
          <button className="ft-toast-close" onClick={() => dismiss(t.id)} aria-label="Fermer">×</button>
        </div>
      ))}
    </div>
  );
}
