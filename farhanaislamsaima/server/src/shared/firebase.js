import admin from 'firebase-admin';

function getFirebaseCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  if (
    process.env.FIREBASE_PROJECT_ID
    && process.env.FIREBASE_CLIENT_EMAIL
    && process.env.FIREBASE_PRIVATE_KEY
  ) {
    return admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    });
  }

  return null;
}

function getFirebaseApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const credential = getFirebaseCredential();

  if (!credential) {
    return null;
  }

  return admin.initializeApp({ credential });
}

function getMessaging() {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  return admin.messaging(app);
}

export {
  getMessaging
};
