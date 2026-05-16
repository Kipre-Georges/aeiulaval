'use client';

import Script from 'next/script';

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

declare global {
  interface Window {
    OneSignalDeferred?: any[];
  }
}

export default function OneSignalProvider() {
  if (!APP_ID) return null;

  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
        defer
      />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "${APP_ID}",
              serviceWorkerPath: "OneSignalSDKWorker.js",
              serviceWorkerParam: { scope: "/" },
              promptOptions: {
                slidedown: {
                  prompts: [
                    {
                      type: "push",
                      autoPrompt: true,
                      text: {
                        actionMessage: "Active les notifications pour rester au courant des événements de la famille AEIULAVAL 🇨🇮",
                        acceptButton: "Je m'abonne",
                        cancelButton: "Plus tard",
                      },
                      delay: { pageViews: 1, timeDelay: 4 },
                    },
                  ],
                },
              },
              notifyButton: {
                enable: true,
                size: 'medium',
                theme: 'default',
                position: 'bottom-right',
                offset: { bottom: '20px', right: '20px' },
                showCredit: false,
                text: {
                  'tip.state.unsubscribed': 'Active les notifications pour les événements 🇨🇮',
                  'tip.state.subscribed': 'Tu es abonné aux notifications',
                  'tip.state.blocked': 'Notifications bloquées',
                  'message.prenotify': 'Clique pour activer les notifications',
                  'message.action.subscribed': "Merci ! Tu seras notifié des nouveaux événements 🎉",
                  'message.action.resubscribed': 'Notifications réactivées',
                  'message.action.unsubscribed': 'Tu ne recevras plus de notifications',
                  'dialog.main.title': 'Gérer les notifications AEIULAVAL',
                  'dialog.main.button.subscribe': "M'ABONNER",
                  'dialog.main.button.unsubscribe': 'ME DÉSABONNER',
                  'dialog.blocked.title': 'Débloquer les notifications',
                  'dialog.blocked.message': 'Suis ces instructions pour autoriser les notifications:',
                },
                colors: {
                  'circle.background': '#FF6B2B',
                  'circle.foreground': 'white',
                  'badge.background': '#00C853',
                  'badge.foreground': 'white',
                  'badge.bordercolor': 'white',
                  'pulse.color': '#FF6B2B',
                  'dialog.button.background.hovering': '#e55a1f',
                  'dialog.button.background.active': '#cc4f1c',
                  'dialog.button.background': '#FF6B2B',
                  'dialog.button.foreground': 'white',
                },
              },
              welcomeNotification: {
                title: 'Akwaba ! 🇨🇮',
                message: 'Bienvenue dans la famille AEIULAVAL. On te tient au courant des événements !',
              },
              allowLocalhostAsSecureOrigin: true,
            });

            // Force prompt when launched from PWA home screen if not subscribed yet
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches
              || (window.navigator).standalone === true;
            if (isStandalone) {
              setTimeout(async () => {
                try {
                  const optedIn = await OneSignal.User.PushSubscription.optedIn;
                  const permission = OneSignal.Notifications.permission;
                  if (!optedIn && permission !== 'denied') {
                    await OneSignal.Slidedown.promptPush({ force: true });
                  }
                } catch (e) { /* fail silently */ }
              }, 3000);
            }
          });
        `}
      </Script>
    </>
  );
}
