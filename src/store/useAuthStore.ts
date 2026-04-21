import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface AuthState {
  currentUser: User | null;
  isAuthReady: boolean;
  isLoggingIn: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
}

let unsubscribeUser: (() => void) | null = null;

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize auth listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (unsubscribeUser) {
      unsubscribeUser();
      unsubscribeUser = null;
    }

    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      
      unsubscribeUser = onSnapshot(userDocRef, async (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          if (firebaseUser.email === 'roysemeconi890@gmail.com' && userData.role !== 'admin') {
            userData.role = 'admin';
            await setDoc(userDocRef, { role: 'admin' }, { merge: true });
          }
          set({ currentUser: userData, isAuthReady: true });
        } else {
          // Create new user profile
          const isAdmin = firebaseUser.email === 'roysemeconi890@gmail.com';
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Пользователь',
            avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
            role: isAdmin ? 'admin' : 'user',
            followersCount: 0,
            followingIds: [],
            likedRecipeIds: [],
            savedRecipeIds: [],
            pinnedRecipeIds: [],
            shoppingList: [],
            collections: []
          };
          await setDoc(userDocRef, newUser);
          set({ currentUser: newUser, isAuthReady: true });
        }
      });
    } else {
      set({ currentUser: null, isAuthReady: true });
    }
  });

  return {
    currentUser: null,
    isAuthReady: false,
    isLoggingIn: false,
    loginWithGoogle: async () => {
      if (get().isLoggingIn) return;
      
      set({ isLoggingIn: true });
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error: any) {
        if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
          console.warn("Login popup closed or cancelled");
        } else {
          console.error("Login failed:", error);
        }
        throw error;
      } finally {
        set({ isLoggingIn: false });
      }
    },
    logout: async () => {
      await signOut(auth);
      localStorage.removeItem('civs_ai_chat_history');
      set({ currentUser: null });
    },
    setCurrentUser: (user) => set({ currentUser: user }),
  };
});
