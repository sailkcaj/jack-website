import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { isOwner } from './ownerIdentity';

// Only the owner can open Time. Firestore enforces the same UID for reads
// and writes. Auth persists the owner's sign-in across visits on a device.
export default function useEditAuth() {
  const [user, setUser] = useState(undefined); // undefined = not yet known
  const [authError, setAuthError] = useState('');

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const signIn = useCallback(async (email, password) => {
    setAuthError('');
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!isOwner(credential.user)) {
        await signOut(auth);
        setAuthError('This account does not have owner access.');
        return false;
      }
      return true;
    } catch {
      setAuthError('Incorrect email or password.');
      return false;
    }
  }, []);

  const signOutEditor = useCallback(() => signOut(auth), []);

  return {
    isEditor: isOwner(user),
    authReady: user !== undefined,
    editorEmail: user ? user.email : null,
    authError,
    clearAuthError: () => setAuthError(''),
    signIn,
    signOutEditor,
  };
}
