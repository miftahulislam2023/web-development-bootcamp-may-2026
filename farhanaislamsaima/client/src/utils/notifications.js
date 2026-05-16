import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import apiClient from '../api/apiClient';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every(Boolean)
    && Boolean(import.meta.env.VITE_FIREBASE_VAPID_KEY);
}

async function registerNotifications() {
  if (!hasFirebaseConfig() || !('Notification' in window) || !('serviceWorker' in navigator)) {
    const missingConfig = Object.entries({
      VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
      VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
      VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
      VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
      VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
      VITE_FIREBASE_APP_ID: firebaseConfig.appId,
      VITE_FIREBASE_VAPID_KEY: import.meta.env.VITE_FIREBASE_VAPID_KEY
    })
      .filter(([, value]) => !value)
      .map(([key]) => key);

    console.log('Firebase notifications skipped: missing config or browser support');
    console.log('Missing Firebase config:', missingConfig);
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    console.log('Firebase notifications skipped: permission was not granted');
    return;
  }

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration
  });

  if (token) {
    await apiClient.post('/notifications/token', { token });
    console.log('Firebase notification token registered');
  }

  onMessage(messaging, (payload) => {
    if (payload.notification?.title && document.visibilityState === 'visible') {
      console.log('Notification received:', payload);

      new Notification(payload.notification.title, {
        body: payload.notification.body || '',
        icon: '/favicon.svg',
        data: payload.data || {}
      });
    }
  });
}

export {
  registerNotifications
};
