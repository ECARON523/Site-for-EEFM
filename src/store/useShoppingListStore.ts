import { create } from 'zustand';
import { Ingredient } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface ShoppingListState {
  addToShoppingList: (userId: string, shoppingList: any[], ingredient: Ingredient, customAmount?: number) => Promise<void>;
  removeFromShoppingList: (userId: string, shoppingList: any[], id: string) => Promise<void>;
  toggleShoppingItem: (userId: string, shoppingList: any[], id: string) => Promise<void>;
  clearShoppingList: (userId: string) => Promise<void>;
}

export const useShoppingListStore = create<ShoppingListState>(() => ({
  addToShoppingList: async (userId, shoppingList, ingredient, customAmount) => {
    const existingItemIndex = shoppingList.findIndex(
      item => item.name === ingredient.name && item.unit === ingredient.unit && !item.checked
    );

    let updatedList;
    if (existingItemIndex !== -1) {
      updatedList = [...shoppingList];
      updatedList[existingItemIndex] = {
        ...updatedList[existingItemIndex],
        amount: updatedList[existingItemIndex].amount + (customAmount ?? ingredient.amount)
      };
    } else {
      const newItem = {
        id: `shop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: ingredient.name,
        amount: customAmount ?? ingredient.amount,
        unit: ingredient.unit,
        checked: false
      };
      updatedList = [...shoppingList, newItem];
    }
    
    try {
      await updateDoc(doc(db, 'users', userId), { shoppingList: updatedList });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },
  removeFromShoppingList: async (userId, shoppingList, id) => {
    const updatedList = shoppingList.filter(item => item.id !== id);
    try {
      await updateDoc(doc(db, 'users', userId), { shoppingList: updatedList });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },
  toggleShoppingItem: async (userId, shoppingList, id) => {
    const updatedList = shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    try {
      await updateDoc(doc(db, 'users', userId), { shoppingList: updatedList });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },
  clearShoppingList: async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { shoppingList: [] });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }
}));
