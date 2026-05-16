import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const outputPath = path.join(publicDir, 'firebase-messaging-sw.js');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        return env;
      }

      const index = trimmed.indexOf('=');

      if (index === -1) {
        return env;
      }

      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');

      return {
        ...env,
        [key]: value
      };
    }, {});
}

const env = {
  ...parseEnvFile(path.join(rootDir, '..', '.env')),
  ...parseEnvFile(path.join(rootDir, '.env')),
  ...process.env
};

function value(key) {
  return JSON.stringify(env[key] || '');
}

const content = `importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: ${value('VITE_FIREBASE_API_KEY')},
  authDomain: ${value('VITE_FIREBASE_AUTH_DOMAIN')},
  projectId: ${value('VITE_FIREBASE_PROJECT_ID')},
  storageBucket: ${value('VITE_FIREBASE_STORAGE_BUCKET')},
  messagingSenderId: ${value('VITE_FIREBASE_MESSAGING_SENDER_ID')},
  appId: ${value('VITE_FIREBASE_APP_ID')}
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'New message';
  const options = {
    body: payload.notification?.body || '',
    icon: '/favicon.svg',
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(outputPath, content);
