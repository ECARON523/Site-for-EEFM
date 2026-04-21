import { useSearchParams } from 'react-router-dom';
import { useRecipeStore } from '../store/useRecipeStore';
import { useUserStore } from '../store/useUserStore';
import RecipeCard from '../components/RecipeCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { recipes } = useRecipeStore();
  const { users } = useUserStore();

  const filteredRecipes = useMemo(() => {
    if (!query.trim()) return [];
    
    // Check if user is searching for ingredients specifically
    const isIngredientSearch = query.includes(',');
    const lowerQuery = query.toLowerCase();
    
    if (isIngredientSearch) {
      const ingredients = lowerQuery.split(',').map(i => i.trim()).filter(i => i !== '');
      return recipes.filter(r => 
        ingredients.every(ing => 
          r.ingredients.some(ri => ri.name.toLowerCase().includes(ing))
        )
      );
    }

    return recipes.filter(r => 
      r.title.toLowerCase().includes(lowerQuery) ||
      r.category.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(lowerQuery))
    );
  }, [recipes, query]);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-text-primary">
            Результаты поиска
          </h1>
        </div>
        <p className="text-text-muted">
          По запросу <span className="font-bold text-text-primary">«{query}»</span> найдено {filteredRecipes.length} рецептов
        </p>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map(recipe => {
            const author = users.find(u => u.id === recipe.authorId);
            if (!author) return null;
            return <RecipeCard key={recipe.id} recipe={recipe} author={author} />;
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-bg-surface-light rounded-3xl border border-border-color">
          <div className="text-text-muted mb-4">
            <Search className="w-16 h-16 mx-auto opacity-20" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Ничего не найдено</h3>
          <p className="text-text-muted max-w-md mx-auto">
            Попробуйте использовать другие ключевые слова или проверьте правильность написания запроса.
          </p>
        </div>
      )}
    </div>
  );
}
