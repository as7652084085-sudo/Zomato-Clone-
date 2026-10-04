import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { isAdminEmail } from '../admin';

const AuthContext = createContext(null);

// Login SIRF Google se hota hai (Firebase Google Auth).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      try {
        const raw = localStorage.getItem('mock_user');
        if (raw) setUser(JSON.parse(raw));
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const googleLogin = async () => {
    if (!isFirebaseConfigured) {
      // Mock mode (bina .env): test login taaki flow bina Firebase ke bhi dekha ja sake
      const mock = { uid: 'mock_google_' + Date.now(), email: 'test@gmail.com', displayName: 'Test User' };
      localStorage.setItem('mock_user', JSON.stringify(mock));
      setUser(mock);
      return mock;
    }
    const c = await signInWithPopup(auth, new GoogleAuthProvider());
    return c.user;
  };

  // Admin login SIRF email+password se (customer login Google-only rehta hai)
  const adminLogin = async (email, password) => {
    if (!isFirebaseConfigured) throw new Error('Admin login ke liye Firebase config chahiye.');
    const c = await signInWithEmailAndPassword(auth, email, password);
    if (!isAdminEmail(c.user.email)) {
      await signOut(auth);
      throw new Error('Ye admin account nahi hai.');
    }
    return c.user;
  };
  const logout = async () => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem('mock_user');
      setUser(null);
      return;
    }
    await signOut(auth);
  };

  const isAdmin = isAdminEmail(user?.email);
  const value = useMemo(() => ({ user, loading, googleLogin, adminLogin, logout, isAdmin, isMock: !isFirebaseConfigured }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
