import { create } from 'zustand';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type AuthError
} from 'firebase/auth';
import { firebase } from '../firebase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  const { auth } = firebase;
  
  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {
      console.log('Auth state changed:', { 
        userEmail: user?.email,
        isAuthenticated: !!user,
        timestamp: new Date().toISOString()
      });
      
      set({ 
        user, 
        isLoading: false, 
        isInitialized: true,
        error: null 
      });
    },
    (error) => {
      console.error('Auth state error:', error);
      set({ 
        user: null, 
        isLoading: false, 
        isInitialized: true,
        error: error.message 
      });
    }
  );

  // Clean up subscription
  if (typeof window !== 'undefined') {
    window.addEventListener('unload', unsubscribe);
  }

  return {
    // Initial state
    user: null,
    isLoading: true,
    isInitialized: false,
    error: null,

    // Actions
    signIn: async (email: string, password: string) => {
      try {
        set({ isLoading: true, error: null });
        console.log('Attempting sign in for:', email);
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Sign in successful');
      } catch (error) {
        const authError = error as AuthError;
        console.error('Sign in error:', authError);
        set({ error: authError.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    signUp: async (email: string, password: string) => {
      try {
        set({ isLoading: true, error: null });
        console.log('Attempting sign up for:', email);
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Sign up successful');
      } catch (error) {
        const authError = error as AuthError;
        console.error('Sign up error:', authError);
        set({ error: authError.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    signOut: async () => {
      try {
        set({ isLoading: true, error: null });
        console.log('Attempting sign out');
        await firebaseSignOut(auth);
        console.log('Sign out successful');
        set({ user: null });
      } catch (error) {
        const authError = error as AuthError;
        console.error('Sign out error:', authError);
        set({ error: authError.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    }
  };
});