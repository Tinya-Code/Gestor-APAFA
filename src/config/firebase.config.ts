import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseApp: App;

function getFirebaseApp(): App {
  if (!firebaseApp) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId: process.env['FIREBASE_PROJECT_ID'],
        privateKey: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
        clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
      }),
    });
  }
  return firebaseApp;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
