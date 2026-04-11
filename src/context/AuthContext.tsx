/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { User, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  adminSignIn: (email: string, password: string) => Promise<void>;
  adminSignOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  adminSignIn: async () => {},
  adminSignOut: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('vr_admin_session') === 'active';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    try {
      if (isAdmin) {
        adminSignOut();
      }
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const adminSignIn = async (email: string, password: string) => {
    // SYSTEM DEFAULT CREDENTIALS (as requested)
    if (email === 'admin@viralraja.com' && password === 'admin786') {
      setIsAdmin(true);
      localStorage.setItem('vr_admin_session', 'active');
    } else {
      throw new Error('Invalid System Admin Credentials');
    }
  };

  const adminSignOut = () => {
    setIsAdmin(false);
    localStorage.removeItem('vr_admin_session');
  };

  // For now, we consider the first user or a specific email as admin
  // In a real app, this should be checked against the 'admins' table in the backend
  const value = {
    user,
    isAdmin: isAdmin || user?.email === 'snehakumari1278.11@gmail.com' || user?.email === 'admin@viralraja.com',
    signIn,
    signUp,
    signOut,
    adminSignIn,
    adminSignOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
