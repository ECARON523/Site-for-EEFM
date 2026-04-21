import { create } from 'zustand';
import { User } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';

interface UserState {
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  fetchUsers: () => void;
  toggleFollow: (currentUserId: string, targetUserId: string) => Promise<void>;
  toggleLikeRecipe: (currentUserId: string, recipeId: string) => Promise<void>;
  toggleSaveRecipe: (currentUserId: string, recipeId: string) => Promise<void>;
  togglePinRecipe: (currentUserId: string, recipeId: string) => Promise<void>;
  updateProfile: (currentUserId: string, updates: Partial<Pick<User, 'name' | 'avatar' | 'bio'>>) => Promise<void>;
  updateUserRole: (userId: string, newRole: 'user' | 'admin') => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: MOCK_USERS,
  usersLoading: false,
  usersError: null,
  fetchUsers: () => {
    set({ usersLoading: true, usersError: null });
    const q = query(collection(db, 'users'));
    onSnapshot(q, (snapshot) => {
      const firestoreUsers = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as User[];
      
      const allUsers = MOCK_USERS.map(mu => {
        const fu = firestoreUsers.find(f => f.id === mu.id);
        if (fu) {
          return { ...mu, ...fu };
        }
        return mu;
      });
      
      const trulyNewUsers = firestoreUsers.filter(fu => !MOCK_USERS.find(mu => mu.id === fu.id));
      set({ users: [...allUsers, ...trulyNewUsers], usersLoading: false });
    }, (error) => {
      set({ usersError: error.message, usersLoading: false });
    });
  },
  updateUserRole: async (userId, newRole) => {
    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', userId), { role: newRole }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },
  toggleFollow: async (currentUserId, targetUserId) => {
    const { users } = get();
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;

    const isFollowing = currentUser.followingIds?.includes(targetUserId) || false;
    const updatedFollowingIds = isFollowing 
      ? (currentUser.followingIds || []).filter(id => id !== targetUserId)
      : [...(currentUser.followingIds || []), targetUserId];

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', currentUserId), {
        followingIds: updatedFollowingIds
      }, { merge: true });
      
      const targetUser = users.find(u => u.id === targetUserId);
      if (targetUser) {
        try {
          await setDoc(doc(db, 'users', targetUserId), {
            followersCount: isFollowing ? Math.max(0, (targetUser.followersCount || 0) - 1) : (targetUser.followersCount || 0) + 1
          }, { merge: true });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${targetUserId}`);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUserId}`);
    }
  },
  toggleLikeRecipe: async (currentUserId, recipeId) => {
    const { users } = get();
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;

    const isLiked = currentUser.likedRecipeIds?.includes(recipeId) || false;
    const updatedLikedRecipeIds = isLiked 
      ? (currentUser.likedRecipeIds || []).filter(id => id !== recipeId)
      : [...(currentUser.likedRecipeIds || []), recipeId];

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', currentUserId), {
        likedRecipeIds: updatedLikedRecipeIds
      }, { merge: true });
      
      // Update recipe likes count
      const { useRecipeStore } = await import('./useRecipeStore');
      await useRecipeStore.getState().toggleLike(recipeId, !isLiked);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUserId}`);
    }
  },
  toggleSaveRecipe: async (currentUserId, recipeId) => {
    const { users } = get();
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;

    const isSaved = currentUser.savedRecipeIds?.includes(recipeId) || false;
    const updatedSavedRecipeIds = isSaved 
      ? (currentUser.savedRecipeIds || []).filter(id => id !== recipeId)
      : [...(currentUser.savedRecipeIds || []), recipeId];

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', currentUserId), {
        savedRecipeIds: updatedSavedRecipeIds
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUserId}`);
    }
  },
  togglePinRecipe: async (currentUserId, recipeId) => {
    const { users } = get();
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;

    const isPinned = currentUser.pinnedRecipeIds?.includes(recipeId) || false;
    const updatedPinnedRecipeIds = isPinned 
      ? (currentUser.pinnedRecipeIds || []).filter(id => id !== recipeId)
      : [...(currentUser.pinnedRecipeIds || []), recipeId];

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', currentUserId), {
        pinnedRecipeIds: updatedPinnedRecipeIds
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUserId}`);
    }
  },
  updateProfile: async (currentUserId, updates) => {
    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', currentUserId), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUserId}`);
    }
  }
}));
