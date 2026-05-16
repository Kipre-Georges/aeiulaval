'use client';

declare global {
  interface Window {
    aeiulavalSubscribe?: () => Promise<void>;
  }
}

export default function SubscribeButton() {
  const handleClick = () => {
    if (typeof window.aeiulavalSubscribe === 'function') {
      window.aeiulavalSubscribe();
    } else {
      alert('Le système de notifications charge encore. Réessaie dans 2 secondes.');
    }
  };

  return (
    <button type="button" className="footer-subscribe-btn" onClick={handleClick}>
      🔔 Activer les notifications
    </button>
  );
}
