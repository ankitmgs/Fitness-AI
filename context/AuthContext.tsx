import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { firebaseService, User } from '../services/firebaseService';
import { DEV_MODE, mockUser } from '../config';

interface AuthContextState {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<{ error?: string }>;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_MODE) {
      // In development mode, bypass Firebase and use the mock user.
      setUser(mockUser as User);
      setLoading(false);
    } else {
      // In production mode, use real Firebase authentication.
      const unsubscribe = firebaseService.onAuthStateChanged(currentUser => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const loginWithGoogle = async () => {
    if (DEV_MODE) return { error: "Development mode is enabled." };
    try {
      setLoading(true);
      await firebaseService.signInWithGoogle();
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
  };

  const signIn = async (email: string, pass: string) => {
    if (DEV_MODE) return { error: "Development mode is enabled." };
     try {
      setLoading(true);
      await firebaseService.signInWithEmailAndPassword(email, pass);
      return {};
    } catch (error) {
      setLoading(false);
      return { error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
  };

  const signUp = async (email: string, pass: string) => {
    if (DEV_MODE) return { error: "Development mode is enabled." };
    try {
      setLoading(true);
      await firebaseService.createUserWithEmailAndPassword(email, pass);
      return {};
    } catch (error) {
      setLoading(false);
      return { error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
  };

  const logout = async () => {
    if (DEV_MODE) {
      alert("Logout is disabled in Development Mode. To switch users, set DEV_MODE to false in config.ts.");
      return;
    }
    await firebaseService.signOut();
    setUser(null);
  };

  const value: AuthContextState = { user, loading, loginWithGoogle, signIn, signUp, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
