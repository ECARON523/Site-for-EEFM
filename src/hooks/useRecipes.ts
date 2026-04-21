import { useRecipeStore } from '../store/useRecipeStore';

export function useRecipes() {
  const recipes = useRecipeStore(state => state.recipes);
  const loading = useRecipeStore(state => state.recipesLoading);

  return { recipes, loading };
}
