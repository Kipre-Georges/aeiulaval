'use client';

import Script from 'next/script';

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
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
            try {
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
                        delay: { pageViews: 0, timeDelay: 4 },
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
                  prenotify: true,
                  showAfter: 0,
                  text: {
                    'tip.state.unsubscribed': 'Active les notifications 🇨🇮',
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

              console.log('[OneSignal] Initialized successfully');

              // Always try to prompt push if user is not subscribed and not blocked
              setTimeout(async () => {
                try {
                  const permission = OneSignal.Notifications.permission;
                  let optedIn = false;
                  try {
                    const result = OneSignal.User.PushSubscription.optedIn;
                    optedIn = await Promise.resolve(result);
                  } catch (e) { optedIn = false; }

                  console.log('[OneSignal] permission:', permission, '| optedIn:', optedIn);

                  if (!optedIn && permission !== 'denied' && permission !== true) {
                    await OneSignal.Slidedown.promptPush({ force: true });
                    console.log('[OneSignal] Slidedown prompt shown');
                  }
                } catch (e) {
                  console.warn('[OneSignal] Auto-prompt failed:', e);
                }
              }, 5000);

              // Expose helper for the manual subscribe button
              window.aeiulavalSubscribe = async function() {
                try {
                  const permission = OneSignal.Notifications.permission;
                  if (permission === 'denied') {
                    alert('Les notifications sont bloquées dans ton navigateur. Va dans les paramètres du site pour les autoriser.');
                    return;
                  }
                  await OneSignal.Slidedown.promptPush({ force: true });
                } catch (e) {
                  console.error('[OneSignal] Manual subscribe failed:', e);
                }
              };
            } catch (e) {
              console.error('[OneSignal] Init failed:', e);
            }
          });
        `}
      </Script>
    </>
  );
}
