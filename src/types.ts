export type Role = 'user' | 'admin';

export interface Collection {
  id: string;
  name: string;
  recipeIds: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  checked: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: Role;
  followersCount: number;
  followingIds: string[];
  likedRecipeIds?: string[];
  savedRecipeIds?: string[];
  pinnedRecipeIds?: string[];
  collections?: Collection[];
  shoppingList?: ShoppingItem[];
  bio?: string;
}

export type RecipeCategory = 'Завтрак' | 'Обед' | 'Ужин' | 'Здоровая еда' | 'Закуски' | 'Десерты' | 'Пироги с рыбой' | 'Блюда из творога' | 'Суп' | 'Гарнир' | 'Салаты' | 'Выпечка';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  weightGrams?: number; // Optional exact weight in grams for display like "1 кочан = 100 г"
  imageUrl?: string;
  category?: string; // e.g., 'Для салата', 'Для заправки'
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export type RecipeStatus = 'pending' | 'approved' | 'rejected';

export interface RecipeStep {
  id: string;
  order: number;
  description: string;
  imageUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: RecipeCategory;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  spiciness?: 1 | 2 | 3 | 4 | 5;
  cuisine?: string;
  allergens?: string[];
  portions: number;
  ingredients: Ingredient[];
  steps?: RecipeStep[];
  nutritionalInfo: NutritionalInfo;
  authorId: string;
  status: RecipeStatus;
  views: number;
  likesCount?: number;
  createdAt: string;
}
