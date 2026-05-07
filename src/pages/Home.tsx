import { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useRecipes } from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import { RecipeCategory } from '../types';
import { AdminEditModal } from '../components/AdminEditModal';
import { RecipeCardSkeleton } from '../components/Skeleton';
import { MOCK_USERS } from '../data/mockData';
import KitchenDashboard from '../components/KitchenDashboard';

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
  const categoryParam = searchParams.get('category'); 
  
  const [editModal, setEditModal] = useState<{isOpen: boolean; title: string; fields: any[]; onSave: (data: any) => void} | null>(null);
  
  const recipesGridRef = useRef<HTMLDivElement>(null);

  const approvedRecipes = recipes.filter(r => r.status === 'approved');

  const filteredRecipes = approvedRecipes.filter(r => {
    if (categoryParam) {
      const targetCategory = CATEGORIES.find(c => c.id === categoryParam);
      if (targetCategory) {
        const exactMatch = r.category === targetCategory.label;
        const keywordMatch = targetCategory.keywords.some(kw => {
          const lowerKw = kw.toLowerCase();
          return r.title.toLowerCase().includes(lowerKw) || 
                 r.description.toLowerCase().includes(lowerKw) || 
                 r.category.toLowerCase().includes(lowerKw);
        });

        if (!exactMatch && !keywordMatch) return false;
      }
    }

    return true;
  });

  const handleEditSection = (
    title: string, 
    fields: { name: string; label: string; type: 'text' | 'number' | 'textarea'; value: any }[], 
    onSave: (data: any) => void
  ) => {
    setEditModal({ isOpen: true, title, fields, onSave });
  };

  // Если это Кухня или Админ — показываем им доску заказов вместо рецептов
  if (currentUser?.role === 'admin' || currentUser?.role === 'kitchen') {
    return <KitchenDashboard />;
  }

  return (
    <div className="space-y-12">
      <section ref={recipesGridRef} className="scroll-mt-24 pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary">
              {categoryParam 
                ? `Блюда: ${CATEGORIES.find(c => c.id === categoryParam)?.label || categoryParam}` 
                : 'Меню'}
            </h2>
            {categoryParam && (
              <button 
                onClick={() => setSearchParams({})} 
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
              В этой категории пока пусто.
            </div>
          )}
        </div>
      </section>

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