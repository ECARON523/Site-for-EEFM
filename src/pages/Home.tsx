import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useRecipes } from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import { RecipeCategory } from '../types';
import { AdminEditModal } from '../components/AdminEditModal';
import { RecipeCardSkeleton } from '../components/Skeleton';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Articles from './Articles';

const CATEGORIES: { id: string; label: RecipeCategory; image: string }[] = [
  { id: 'breakfast', label: 'Завтрак', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop' },
  { id: 'lunch', label: 'Обед', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop' },
  { id: 'dinner', label: 'Ужин', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop' },
  { id: 'healthy', label: 'Здоровая еда', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop' },
  { id: 'snacks', label: 'Закуски', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=400&h=300&fit=crop' },
  { id: 'desserts', label: 'Десерты', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop' },
];

import { MOCK_USERS } from '../data/mockData';

export default function Home() {
  const { currentUser } = useAuthStore();
  const { users } = useUserStore();
  const { recipes, loading } = useRecipes();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'Главная' | 'Рецепты' | 'Статьи' | null;
  const [activeTab, setActiveTab] = useState<'Главная' | 'Рецепты' | 'Статьи'>(tabParam || 'Главная');
  const [filter, setFilter] = useState<'all' | 'fast' | 'healthy'>('all');
  const [editModal, setEditModal] = useState<{isOpen: boolean; title: string; fields: any[]; onSave: (data: any) => void} | null>(null);

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'Главная' | 'Рецепты' | 'Статьи') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const approvedRecipes = recipes.filter(r => r.status === 'approved');
  const isAdmin = currentUser?.role === 'admin';

  const featuredRecipe = approvedRecipes[0]; // Simple hero

  const filteredRecipes = approvedRecipes.filter(r => {
    if (filter === 'fast') return (r.prepTime + r.cookTime) <= 30;
    if (filter === 'healthy') return r.category === 'Здоровая еда';
    return true;
  });

  const recommendedRecipes = approvedRecipes
    .filter(r => {
      if (filter === 'fast') return (r.prepTime + r.cookTime) <= 30;
      if (filter === 'healthy') return r.category === 'Здоровая еда';
      return true;
    })
    .sort((a, b) => {
      const aLiked = currentUser?.likedRecipeIds?.includes(a.id) ? 1 : 0;
      const bLiked = currentUser?.likedRecipeIds?.includes(b.id) ? 1 : 0;
      return bLiked - aLiked || b.views - a.views;
    })
    .slice(0, 6);

  const topAuthors = users.sort((a, b) => b.followersCount - a.followersCount).slice(0, 3);

  const handleEditSection = (
    title: string, 
    fields: { name: string; label: string; type: 'text' | 'number' | 'textarea'; value: any }[], 
    onSave: (data: any) => void
  ) => {
    setEditModal({ isOpen: true, title, fields, onSave });
  };

  return (
    <div className="space-y-12">
      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border-color">
        {['Главная', 'Рецепты', 'Статьи'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab as any)}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === tab ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Главная' && (
        <div className="space-y-12">
          {/* Hero Section */}
          {featuredRecipe && (
            <section className="relative rounded-3xl overflow-hidden aspect-[21/9]">
              <img src={featuredRecipe.imageUrl} alt={featuredRecipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h1 className="text-4xl font-black text-white mb-2">Рецепт дня: {featuredRecipe.title}</h1>
                <Link to={`/recipe/${featuredRecipe.id}`} className="bg-primary text-black px-6 py-2 rounded-full font-bold">Готовить</Link>
              </div>
            </section>
          )}

          {/* Filters */}
          <section className="flex gap-4">
            {(['all', 'fast', 'healthy'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full border ${filter === f ? 'bg-primary text-black' : 'border-border-color text-text-muted'}`}>
                {f === 'all' ? 'Все' : f === 'fast' ? 'Быстро (до 30 мин)' : 'Здоровая еда'}
              </button>
            ))}
          </section>

          {/* Recommendations */}
          {currentUser && recommendedRecipes.length > 0 && (
            <section>
              <h2 className="text-2xl font-black uppercase text-text-primary mb-6">Рекомендуем вам</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedRecipes.map(r => <RecipeCard key={r.id} recipe={r} author={users.find(u => u.id === r.authorId)!} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === 'Рецепты' && (
        <>
          {/* Categories Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary">Приготовить сегодня</h2>
              {isAdmin && (
                <button onClick={() => handleEditSection('Редактировать заголовок', [{name: 'title', label: 'Заголовок', type: 'text', value: 'Приготовить сегодня'}], (data) => console.log(data))} className="text-sm text-primary">
                  Редактировать
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <Link 
                  key={cat.id} 
                  to={`/recipes/${cat.id}`}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
                >
                  {cat.image && (
                    <img 
                      src={cat.image} 
                      alt={cat.label} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-lg">
                    {cat.label}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Best Recipes Feed */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary">Лучшие рецепты</h2>
              <Link to="/recipes/all" className="text-sm text-text-muted hover:text-text-primary underline underline-offset-4">
                Смотреть все
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)
              ) : (
                filteredRecipes.slice(0, 12).map((recipe) => {
                  const author = users.find(u => u.id === recipe.authorId) || MOCK_USERS.find(u => u.id === recipe.authorId);
                  if (!author) return null;
                  return <RecipeCard key={recipe.id} recipe={recipe} author={author} />;
                })
              )}
            </div>
          </section>
        </>
      )}
      {activeTab === 'Статьи' && <Articles />}
      {editModal && (
        <AdminEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal(null)}
          title={editModal.title}
          fields={editModal.fields}
          onSave={editModal.onSave}
        />
      )}
    </div>
  );
}
