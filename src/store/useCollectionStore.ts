import { create } from 'zustand';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface CollectionState {
  createCollection: (userId: string, collections: any[], name: string) => Promise<void>;
  addToCollection: (userId: string, collections: any[], collectionId: string, recipeId: string) => Promise<void>;
  removeFromCollection: (userId: string, collections: any[], collectionId: string, recipeId: string) => Promise<void>;
}

export const useCollectionStore = create<CollectionState>(() => ({
  createCollection: async (userId, collections, name) => {
    const newCollection = {
      id: `coll_${Date.now()}`,
      name,
      recipeIds: []
    };
    const updatedCollections = [...collections, newCollection];
    try {
      await updateDoc(doc(db, 'users', userId), { collections: updatedCollections });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },
  addToCollection: async (userId, collections, collectionId, recipeId) => {
    const updatedCollections = collections.map(coll => {
      if (coll.id === collectionId) {
        if (coll.recipeIds.includes(recipeId)) return coll;
        return { ...coll, recipeIds: [...coll.recipeIds, recipeId] };
      }
      return coll;
    });
    try {
      await updateDoc(doc(db, 'users', userId), { collections: updatedCollections });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },
  removeFromCollection: async (userId, collections, collectionId, recipeId) => {
    const updatedCollections = collections.map(coll => {
      if (coll.id === collectionId) {
        return { ...coll, recipeIds: coll.recipeIds.filter(id => id !== recipeId) };
      }
      return coll;
    });
    try {
      await updateDoc(doc(db, 'users', userId), { collections: updatedCollections });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }
}));
