import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';

// These values identify the Firebase project the Time tab's data lives in —
// they are NOT secret. Firestore Security Rules (firestore.rules) and
// Authentication are what actually control who can read/write, not keeping
// this object hidden. See README.md's "Time tab storage" section for the
// full setup: what to create in the Firebase console, the rule to paste in,
// and how the one editor account works.
const firebaseConfig = {
  apiKey: 'AIzaSyBDMvhoXhtJxP_T4BmrBpMHlOPKru0b8kM',
  authDomain: 'sailkcaj-c29a8.firebaseapp.com',
  projectId: 'sailkcaj-c29a8',
  storageBucket: 'sailkcaj-c29a8.firebasestorage.app',
  messagingSenderId: '828820560702',
  appId: '1:828820560702:web:781fb7c148339ff42daa6f',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Local dev only — point at `npm run emulators` instead of the real project
// when explicitly asked for (see README), so testing never touches real
// data or needs real credentials.
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

// Best-effort offline cache, so a browser that already loaded the Time tab
// once can still show that last-synced snapshot without a network — a
// flaky connection can't masquerade as the data disappearing. Safe to
// ignore if it fails (private browsing, multiple tabs, unsupported
// browser): the app still works, that tab just needs the network to see
// live data.
enableIndexedDbPersistence(db).catch(() => {});
