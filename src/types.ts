export type Role = 'user' | 'admin' | 'vip' | 'kitchen';

export type Department = 'Горячий цех' | 'Холодный цех' | 'Бар' | 'Десерты';

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
  weightGrams?: number; 
  imageUrl?: string;
  category?: string; 
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
  department?: Department; 
  prepTime: number; 
  cookTime: number; 
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
  price?: number; 
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'archived';

export interface OrderItem {
  recipeId: string;
  title: string;
  quantity: number;
  department?: Department; 
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  isVip: boolean;
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  createdAt: string; 
}