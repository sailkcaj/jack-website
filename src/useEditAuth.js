import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

// Gate for who can edit the Time tab. Reading is always public (see
// useTimeLog/useTimeNotes) — this only controls the paint/note/erase
// controls in TimeTracker.jsx. Firebase Auth persists the signed-in session
// in this browser on its own, so signing in once on a device keeps editing
// unlocked there until an explicit sign-out.
export default function useEditAuth() {
  const [user, setUser] = useState(undefined); // undefined = not yet known
  const [authError, setAuthError] = useState('');

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const signIn = useCallback(async (email, password) => {
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch {
      setAuthError('Incorrect email or password.');
      return false;
    }
  }, []);

  const signOutEditor = useCallback(() => signOut(auth), []);

  return {
    isEditor: !!user,
    authReady: user !== undefined,
    editorEmail: user ? user.email : null,
    authError,
    clearAuthError: () => setAuthError(''),
    signIn,
    signOutEditor,
  };
}
