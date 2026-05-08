import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider, // ДОБАВИЛИ ДЛЯ APPLE
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

interface AuthState {
  currentUser: User | null;
  isAuthReady: boolean;
  isLoggingIn: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithApple: () => Promise<void>; // НОВАЯ ФУНКЦИЯ ДЛЯ APPLE
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
}

let unsubscribeUser: (() => void) | null = null;

export const useAuthStore = create<AuthState>((set, get) => {
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
          const isAdmin = firebaseUser.email === 'roysemeconi890@gmail.com';
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Новый пользователь',
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
        if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
          console.error("Login failed:", error);
        }
        throw error;
      } finally {
        set({ isLoggingIn: false });
      }
    },

    loginWithGithub: async () => {
      if (get().isLoggingIn) return;
      set({ isLoggingIn: true });
      const provider = new GithubAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error: any) {
        if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
          console.error("Github login failed:", error);
        }
        throw error;
      } finally {
        set({ isLoggingIn: false });
      }
    },

    // ЛОГИКА ВХОДА ЧЕРЕЗ APPLE
    loginWithApple: async () => {
      if (get().isLoggingIn) return;
      set({ isLoggingIn: true });
      const provider = new OAuthProvider('apple.com');
      // Запрашиваем имя и почту
      provider.addScope('email');
      provider.addScope('name');
      try {
        await signInWithPopup(auth, provider);
      } catch (error: any) {
        if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
          console.error("Apple login failed:", error);
        }
        throw error;
      } finally {
        set({ isLoggingIn: false });
      }
    },

    loginWithEmail: async (email, password) => {
      if (get().isLoggingIn) return;
      set({ isLoggingIn: true });
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        throw error;
      } finally {
        set({ isLoggingIn: false });
      }
    },

    registerWithEmail: async (email, password, name) => {
      if (get().isLoggingIn) return;
      set({ isLoggingIn: true });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const isAdmin = email === 'roysemeconi890@gmail.com';
        const newUser: User = {
          id: userCredential.user.uid,
          name: name,
          avatar: `https://picsum.photos/seed/${userCredential.user.uid}/100/100`,
          role: isAdmin ? 'admin' : 'user',
          followersCount: 0,
          followingIds: [],
          likedRecipeIds: [],
          savedRecipeIds: [],
          pinnedRecipeIds: [],
          shoppingList: [],
          collections: []
        };
        await setDoc(userDocRef, newUser, { merge: true });
      } catch (error) {
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