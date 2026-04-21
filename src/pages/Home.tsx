import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useRecipes } from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import { RecipeCategory } from '../types';
import { AdminEditModal } from '../components/AdminEditModal';
import { RecipeCardSkeleton } from '../components/Skeleton';
import Articles from './Articles';
import { MOCK_USERS } from '../data/mockData';

// ДОБАВЛЕНЫ KEYWORDS ИЗ ТВОЕЙ СТРУКТУРЫ ДЛЯ УМНОГО ПОИСКА
const CATEGORIES: { id: string; label: RecipeCategory; image: string; keywords: string[] }[] = [
  { 
    id: 'breakfast', 
    label: 'Завтрак', 
    image: 'https://avatars.mds.yandex.net/i?id=d062c59f18da50d4235819d5c01b69c1_l-10744014-images-thumbs&n=13',
    keywords: ['завтрак', 'сырник', 'блин', 'каша', 'омлет', 'яичниц', 'мюсли', 'панкейк']
  },
  { 
    id: 'lunch', 
    label: 'Обед', 
    image: 'https://avatars.mds.yandex.net/i?id=5fee187abb88ea4a11ec6d812c7ac38c_l-4477535-images-thumbs&n=13',
    keywords: ['обед', 'суп', 'борщ', 'щи', 'горячее', 'второе', 'жарко', 'бульон']
  },
  { 
    id: 'dinner', 
    label: 'Ужин', 
    image: 'https://www.koolinar.ru/all_image/article/5/5342/article-9f042aae-a14d-4c98-8e2d-09bb4aa03ff3_large.jpg',
    keywords: ['ужин', 'мясо', 'рыба', 'куриц', 'запеканк', 'паста', 'спагетти', 'стейк']
  },
  { 
    id: 'healthy', 
    label: 'Здоровая еда', 
    image: 'https://lnr-news.ru/img/20260225/37fd4d3da3aff77ef48d0678433cfadb.jpg',
    keywords: ['здоров', 'пп', 'полезн', 'диетич', 'без сахара', 'веган', 'вегетариан', 'фитнес']
  },
  { 
    id: 'snacks', 
    label: 'Закуски', 
    image: 'https://i.ytimg.com/vi/zlKdkGV4WAo/maxresdefault.jpg',
    keywords: ['закуск', 'бутерброд', 'канапе', 'тост', 'рулет', 'тарталетк', 'чипс', 'снек']
  },
  { 
    id: 'desserts', 
    label: 'Десерты', 
    image: 'https://avatars.mds.yandex.net/i?id=c14b9168ab27382c43189b759ed15f75be2442f9-5100742-images-thumbs&n=13',
    keywords: ['десерт', 'торт', 'пирожн', 'морожен', 'сладк', 'крем', 'пудинг', 'желе']
  },
];

export default function Home() {
  const { currentUser } = useAuthStore();
  const { users } = useUserStore();
  const { recipes, loading } = useRecipes();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'Главная' | 'Рецепты' | 'Статьи' | null;
  const categoryParam = searchParams.get('category'); 
  
  const [activeTab, setActiveTab] = useState<'Главная' | 'Рецепты' | 'Статьи'>(tabParam || 'Главная');
  const [filter, setFilter] = useState<'all' | 'fast' | 'healthy'>('all');
  const [editModal, setEditModal] = useState<{isOpen: boolean; title: string; fields: any[]; onSave: (data: any) => void} | null>(null);
  
  const recipesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'Главная' | 'Рецепты' | 'Статьи') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSearchParams({ tab: 'Рецепты', category: categoryId });
    setTimeout(() => {
      recipesGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const approvedRecipes = recipes.filter(r => r.status === 'approved');
  const isAdmin = currentUser?.role === 'admin';
  const featuredRecipe = approvedRecipes[0]; 

  // УМНАЯ ЛОГИКА ФИЛЬТРАЦИИ С KEYWORDS
  const filteredRecipes = approvedRecipes.filter(r => {
    // 1. Проверяем кнопки "Все", "Быстро", "Здоровая еда"
    if (filter === 'fast' && (r.prepTime + r.cookTime) > 30) return false;
    if (filter === 'healthy' && !r.category.toLowerCase().includes('здоров')) return false;

    // 2. Проверяем клик по плашке с учетом keywords (твоя логика)
    if (categoryParam) {
      const targetCategory = CATEGORIES.find(c => c.id === categoryParam);
      if (targetCategory) {
        // Ищем строгое совпадение категории
        const exactMatch = r.category === targetCategory.label;
        // Или совпадение по ключевым словам в названии, описании или категории
        const keywordMatch = targetCategory.keywords.some(kw => {
          const lowerKw = kw.toLowerCase();
          return r.title.toLowerCase().includes(lowerKw) || 
                 r.description.toLowerCase().includes(lowerKw) || 
                 r.category.toLowerCase().includes(lowerKw);
        });

        // Если не совпало ни так, ни так — отбрасываем
        if (!exactMatch && !keywordMatch) return false;
      }
    }

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
                <div 
                  key={cat.id} 
                  onClick={() => handleCategoryClick(cat.id)}
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
                </div>
              ))}
            </div>
          </section>

          {/* Best Recipes Feed */}
          <section ref={recipesGridRef} className="scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary">
                  {categoryParam 
                    ? `Блюда: ${CATEGORIES.find(c => c.id === categoryParam)?.label || categoryParam}` 
                    : 'Лучшие рецепты'}
                </h2>
                {categoryParam && (
                  <button 
                    onClick={() => setSearchParams({ tab: 'Рецепты' })} 
                    className="text-xs font-bold bg-bg-surface-light px-3 py-1 rounded-full text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    ✕ Сбросить
                  </button>
                )}
              </div>
              {!categoryParam && (
                <Link to="/recipes/all" className="text-sm text-text-muted hover:text-text-primary underline underline-offset-4">
                  Смотреть все
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)
              ) : filteredRecipes.length > 0 ? (
                filteredRecipes.slice(0, 12).map((recipe) => {
                  const author = users.find(u => u.id === recipe.authorId) || MOCK_USERS.find(u => u.id === recipe.authorId);
                  if (!author) return null;
                  return <RecipeCard key={recipe.id} recipe={recipe} author={author} />;
                })
              ) : (
                <div className="col-span-full py-12 text-center text-text-muted bg-bg-surface-light rounded-2xl border border-border-color">
                  В этой категории пока нет рецептов. Будьте первым, кто добавит!
                </div>
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