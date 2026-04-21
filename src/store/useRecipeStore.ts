import { create } from 'zustand';
import { Recipe } from '../types';
import { MOCK_RECIPES } from '../data/mockData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, limit, startAfter, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface RecipeState {
  recipes: Recipe[];
  recipesLoading: boolean;
  recipesError: string | null;
  lastVisible: any;
  fetchRecipes: (filter?: { category?: string; search?: string }, pageSize?: number) => Promise<void>;
  loadMoreRecipes: (filter?: { category?: string; search?: string }, pageSize?: number) => Promise<void>;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'views' | 'likesCount' | 'createdAt' | 'status'>) => Promise<void>;
  updateRecipeStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>, isAdmin?: boolean) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
  toggleLike: (recipeId: string, increment: boolean) => Promise<void>;
  fetchRecipesByAuthor: (authorId: string) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: MOCK_RECIPES.map(r => ({ 
    ...r, 
    likesCount: r.likesCount || (Math.floor(Math.random() * 1101) + 200) 
  })),
  recipesLoading: false,
  recipesError: null,
  lastVisible: null,
  fetchRecipes: async (filter, pageSize = 10) => {
    set({ recipesLoading: true, recipesError: null });
    let q = query(collection(db, 'recipes_v2'), orderBy('createdAt', 'desc'), limit(pageSize));
    
    if (filter?.category) {
      q = query(collection(db, 'recipes_v2'), where('category', '==', filter.category), orderBy('createdAt', 'desc'), limit(pageSize));
    }

    try {
      const snapshot = await getDocs(q);
      const firestoreRecipes = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Recipe[];
      
      // Merge mock data with Firestore data (e.g. likesCount for mock recipes)
      const mergedMockRecipes = MOCK_RECIPES.map(mr => {
        const fr = firestoreRecipes.find(r => r.id === mr.id);
        if (fr) {
          return { ...mr, ...fr };
        }
        // If not in firestore, use the existing randomized likesCount or generate one
        const existing = get().recipes.find(r => r.id === mr.id);
        return { ...mr, likesCount: fr ? fr.likesCount : (existing?.likesCount || mr.likesCount || (Math.floor(Math.random() * 1101) + 200)) };
      });

      // Add recipes that are ONLY in Firestore (user created)
      const userRecipes = firestoreRecipes.filter(fr => !MOCK_RECIPES.find(mr => mr.id === fr.id));
      
      set({ 
        recipes: [...mergedMockRecipes, ...userRecipes], 
        lastVisible: snapshot.docs[snapshot.docs.length - 1], 
        recipesLoading: false 
      });
    } catch (error: any) {
      set({ 
        recipesError: error.message, 
        recipesLoading: false, 
        recipes: get().recipes.length > 0 ? get().recipes : MOCK_RECIPES.map(r => ({ ...r, likesCount: r.likesCount || (Math.floor(Math.random() * 1101) + 200) })) 
      });
    }
  },
  loadMoreRecipes: async (filter, pageSize = 10) => {
    const { lastVisible, recipes } = get();
    if (!lastVisible) return;
    
    let q = query(collection(db, 'recipes_v2'), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(pageSize));
    
    if (filter?.category) {
      q = query(collection(db, 'recipes_v2'), where('category', '==', filter.category), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(pageSize));
    }

    try {
      const snapshot = await getDocs(q);
      const newFirestoreRecipes = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Recipe[];
      
      const currentRecipes = get().recipes;
      
      // Update existing recipes with new data from Firestore (if any)
      const updatedRecipes = currentRecipes.map(cr => {
        const nr = newFirestoreRecipes.find(r => r.id === cr.id);
        if (nr) {
          return { ...cr, ...nr };
        }
        return cr;
      });

      // Add recipes that are truly new (not already in state)
      const trulyNewRecipes = newFirestoreRecipes.filter(nr => !currentRecipes.find(cr => cr.id === nr.id));
      
      set({ 
        recipes: [...updatedRecipes, ...trulyNewRecipes], 
        lastVisible: snapshot.docs[snapshot.docs.length - 1] 
      });
    } catch (error) {
      console.error("Error loading more recipes:", error);
    }
  },
  addRecipe: async (recipeData) => {
    const newRecipe = {
      ...recipeData,
      views: 0,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    try {
      const docRef = await addDoc(collection(db, 'recipes_v2'), newRecipe);
      
      // Update local state
      set(state => ({
        recipes: [...state.recipes, { ...newRecipe, id: docRef.id } as Recipe]
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'recipes_v2');
    }
  },
  updateRecipeStatus: async (id, status) => {
    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'recipes_v2', id), { status }, { merge: true });
      
      // Update local state
      set(state => ({
        recipes: state.recipes.map(r => r.id === id ? { ...r, status } : r)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `recipes_v2/${id}`);
    }
  },
  updateRecipe: async (id, updates, isAdmin = false) => {
    try {
      const { setDoc, doc } = await import('firebase/firestore');
      const finalUpdates = { ...updates };
      if (!isAdmin) {
        finalUpdates.status = 'pending';
      }
      await setDoc(doc(db, 'recipes_v2', id), finalUpdates, { merge: true });
      
      // Update local state
      set(state => ({
        recipes: state.recipes.map(r => r.id === id ? { ...r, ...finalUpdates } : r)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `recipes_v2/${id}`);
    }
  },
  deleteRecipe: async (recipeId) => {
    try {
      await deleteDoc(doc(db, 'recipes_v2', recipeId));
      
      // Update local state
      set(state => ({
        recipes: state.recipes.filter(r => r.id !== recipeId)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `recipes_v2/${recipeId}`);
    }
  },
  toggleLike: async (recipeId, increment) => {
    // Update local state immediately for better UX
    set(state => ({
      recipes: state.recipes.map(r => 
        r.id === recipeId ? { ...r, likesCount: (r.likesCount || 0) + (increment ? 1 : -1) } : r
      )
    }));

    try {
      const { setDoc, doc, increment: firestoreIncrement } = await import('firebase/firestore');
      await setDoc(doc(db, 'recipes_v2', recipeId), {
        likesCount: firestoreIncrement(increment ? 1 : -1)
      }, { merge: true });
    } catch (error) {
      // Revert local state on error
      set(state => ({
        recipes: state.recipes.map(r => 
          r.id === recipeId ? { ...r, likesCount: (r.likesCount || 0) - (increment ? 1 : -1) } : r
        )
      }));
      handleFirestoreError(error, OperationType.UPDATE, `recipes_v2/${recipeId}`);
    }
  },
  fetchRecipesByAuthor: async (authorId: string) => {
    try {
      const q = query(collection(db, 'recipes_v2'), where('authorId', '==', authorId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const authorRecipes = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Recipe[];

      set(state => {
        const otherRecipes = state.recipes.filter(r => r.authorId !== authorId);
        // We still want to keep mock recipes if they belong to this author but weren't in the firestore query
        // (though they should be if they were ever interacted with)
        const existingAuthorMockRecipes = MOCK_RECIPES.filter(mr => mr.authorId === authorId);
        
        const mergedAuthorRecipes = [...authorRecipes];
        existingAuthorMockRecipes.forEach(mr => {
          if (!mergedAuthorRecipes.find(ar => ar.id === mr.id)) {
            const existing = state.recipes.find(r => r.id === mr.id);
            mergedAuthorRecipes.push({ ...mr, likesCount: existing?.likesCount || mr.likesCount || (Math.floor(Math.random() * 1101) + 200) });
          }
        });

        return {
          recipes: [...otherRecipes, ...mergedAuthorRecipes]
        };
      });
    } catch (error) {
      console.error("Error fetching author recipes:", error);
    }
  }
}));
