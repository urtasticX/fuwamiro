import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { Analytics } from 'firebase/analytics';

// Firebase web configuration is public. Access is controlled by Firebase Rules.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC7DKSUL66PTTFVuj9fO0N-yjxJ54viVc4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'fuwamiro.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'fuwamiro',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'fuwamiro.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '414085320298',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:414085320298:web:09b5017569bd15fba98413',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-HNJGM3JECS',
};

// Reuse the default app during Next.js hot reloads.
export const app = getApps().some(app => app.name === '[DEFAULT]') ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export function getFirebaseAuth() { return getAuth(app); }

let analyticsPromise: Promise<Analytics | null> | undefined;
export function initializeAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  analyticsPromise ??= import('firebase/analytics')
    .then(async ({ isSupported, getAnalytics }) => (await isSupported()) ? getAnalytics(app) : null)
    .catch(() => null); // Analytics must never prevent the site from loading.
  return analyticsPromise;
}
