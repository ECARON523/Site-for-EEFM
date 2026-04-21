import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecipeStore } from '../store/useRecipeStore';
import { useUserStore } from '../store/useUserStore';
import RecipeCard from '../components/RecipeCard';
import { RecipeCardSkeleton } from '../components/Skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const ITEMS_PER_PAGE = 12;

export default function AllRecipes() {
  const { recipes } = useRecipeStore();
  const { users } = useUserStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (recipes.length > 0) {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [recipes]);

  const approvedRecipes = useMemo(() => {
    return recipes
      .filter(r => r.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [recipes]);

  const totalPages = Math.ceil(approvedRecipes.length / ITEMS_PER_PAGE);
  const validCurrentPage = isNaN(currentPage) ? 1 : Math.min(Math.max(1, currentPage), totalPages || 1);
  
  const currentRecipes = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return approvedRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [approvedRecipes, validCurrentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight text-text-primary mb-4">
          Все рецепты
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          Откройте для себя нашу полную коллекцию вкусных и проверенных рецептов от нашего сообщества.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
        </div>
      ) : currentRecipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentRecipes.map(recipe => {
              const author = users.find(u => u.id === recipe.authorId);
              if (!author) return null;
              return <RecipeCard key={recipe.id} recipe={recipe} author={author} />;
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(validCurrentPage - 1)}
                disabled={validCurrentPage === 1}
                className="p-2 rounded-xl border border-border-color disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg-surface-light transition-colors text-text-muted"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-10 h-10 rounded-xl font-bold transition-all",
                      validCurrentPage === page
                        ? "bg-primary text-black shadow-md"
                        : "text-text-muted hover:bg-bg-surface-light hover:text-text-primary"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(validCurrentPage + 1)}
                disabled={validCurrentPage === totalPages}
                className="p-2 rounded-xl border border-border-color disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg-surface-light transition-colors text-text-muted"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-bg-surface rounded-3xl border border-border-color">
          <p className="text-text-muted">Рецепты пока не добавлены.</p>
        </div>
      )}
    </div>
  );
}
