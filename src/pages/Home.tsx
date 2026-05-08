import { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useRecipes } from '../hooks/useRecipes';
import { useOrderStore } from '../store/useOrderStore';
import RecipeCard from '../components/RecipeCard';
import { AdminEditModal } from '../components/AdminEditModal';
import { RecipeCardSkeleton } from '../components/Skeleton';
import { MOCK_USERS } from '../data/mockData';
import KitchenDashboard from '../components/KitchenDashboard';
import { Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const DEPARTMENTS = [
  { id: 'hot', label: 'Горячий цех', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80' },
  { id: 'cold', label: 'Холодный цех', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80' },
  { id: 'desserts', label: 'Десерты', image: 'https://images.unsplash.com/photo-1551024506-0cb4a1cb1cdd?auto=format&fit=crop&q=80' },
  { id: 'bar', label: 'Бар', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80' }
];

export default function Home() {
  const { currentUser } = useAuthStore();
  const { users } = useUserStore();
  const { recipes, loading } = useRecipes();
  // БРОНЯ: Убеждаемся, что orders всегда массив, даже если стор глюканет
  const orders = useOrderStore(state => state.orders) || []; 
  
  const [searchParams, setSearchParams] = useSearchParams();
  const departmentParam = searchParams.get('department'); 
  
  const [editModal, setEditModal] = useState<{isOpen: boolean; title: string; fields: any[]; onSave: (data: any) => void} | null>(null);
  const recipesGridRef = useRef<HTMLDivElement>(null);

  // БРОНЯ: Защита от undefined в recipes
  const safeRecipes = recipes || [];
  const approvedRecipes = safeRecipes.filter(r => r?.status === 'approved');

  const filteredRecipes = approvedRecipes.filter(r => {
    if (!departmentParam) return true;
    const targetDept = DEPARTMENTS.find(d => d.id === departmentParam);
    return r?.department === targetDept?.label;
  });

  const handleCategoryClick = (deptId: string) => {
    setSearchParams({ department: deptId });
    setTimeout(() => {
      recipesGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (currentUser?.role === 'admin' || currentUser?.role === 'kitchen') {
    return <KitchenDashboard />;
  }

  // БРОНЯ: Безопасный фильтр активных заказов
  const activeUserOrders = currentUser 
    ? orders.filter(o => o?.userId === currentUser.id && o?.status !== 'archived')
    : [];

  return (
    <div className="space-y-12 pb-20">
      
      {activeUserOrders.length > 0 && (
        <section className="pt-4">
          {activeUserOrders.map(order => {
            if (!order) return null; // Защита от битого заказа
            
            const stepIndex = order.status === 'pending' ? 0 : order.status === 'cooking' ? 1 : 2;
            const safeItems = order.items || []; // БРОНЯ: Если items пустой

            return (
              <div key={order.id || Math.random()} className="bg-bg-surface border-2 border-primary/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(250,204,21,0.05)] relative overflow-hidden mb-6">
                
                <div className={cn(
                  "absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-20",
                  order.status === 'pending' ? "bg-yellow-500" : order.status === 'cooking' ? "bg-blue-500" : "bg-green-500"
                )}></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary">
                        Заказ #{(order.id || 'err').split('-')[1]?.toUpperCase() || 'NEW'}
                      </h2>
                      <span className="text-sm font-bold text-text-muted flex items-center gap-1 bg-bg-surface-light px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Сейчас'}
                      </span>
                    </div>
                    
                    {/* БРОНЯ: Безопасный подсчет количества блюд */}
                    <p className="text-text-muted font-medium mb-6">
                      Блюд: {safeItems.reduce((acc, item) => acc + (item?.quantity || 1), 0)} шт. • Сумма: <span className="text-text-primary font-bold">{order.totalPrice || 0} ₽</span>
                    </p>

                    <div className="relative flex justify-between w-full max-w-md">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-bg-surface-light -translate-y-1/2 z-0 rounded-full"></div>
                      <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
                           style={{ width: stepIndex === 0 ? '0%' : stepIndex === 1 ? '50%' : '100%' }}></div>

                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm", stepIndex >= 0 ? "bg-primary text-black" : "bg-bg-surface-light text-text-muted")}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className={cn("text-xs font-bold uppercase tracking-wider", stepIndex >= 0 ? "text-text-primary" : "text-text-muted")}>Принят</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm", stepIndex >= 1 ? "bg-primary text-black" : "bg-bg-surface-light text-text-muted")}>
                          <ChefHat className="w-5 h-5" />
                        </div>
                        <span className={cn("text-xs font-bold uppercase tracking-wider", stepIndex >= 1 ? "text-text-primary" : "text-text-muted")}>Готовится</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm", stepIndex >= 2 ? "bg-green-500 text-white" : "bg-bg-surface-light text-text-muted")}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className={cn("text-xs font-bold uppercase tracking-wider", stepIndex >= 2 ? "text-green-500" : "text-text-muted")}>К выдаче</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto">
                    {order.status === 'ready' ? (
                      <div className="bg-green-500/20 text-green-500 border border-green-500/30 px-6 py-4 rounded-2xl text-center">
                        <p className="font-black uppercase text-lg mb-1">Заказ готов!</p>
                        <p className="text-sm font-medium">Подойдите на кассу</p>
                      </div>
                    ) : (
                      <Link to={`/profile/${currentUser?.id || ''}`} className="block w-full md:w-auto text-center bg-bg-surface-light hover:bg-border-color border border-border-color text-text-primary font-bold px-6 py-4 rounded-2xl transition-colors">
                        Детали в профиле
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <section className={activeUserOrders.length === 0 ? "pt-4" : ""}>
        <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary mb-6">Категории меню</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEPARTMENTS.map((dept) => (
            <div 
              key={dept.id} 
              onClick={() => handleCategoryClick(dept.id)}
              className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-[4/3] group cursor-pointer border border-border-color"
            >
              <img src={dept.image} alt={dept.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white font-black text-lg sm:text-xl uppercase tracking-wider leading-tight">{dept.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={recipesGridRef} className="scroll-mt-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary">
              {departmentParam ? `${DEPARTMENTS.find(d => d.id === departmentParam)?.label || 'Меню'}` : 'Все позиции'}
            </h2>
            {departmentParam && (
              <button onClick={() => setSearchParams({})} className="text-xs font-bold bg-bg-surface-light px-3 py-1 rounded-full text-text-muted hover:text-text-primary transition-colors cursor-pointer">✕ Сбросить</button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.slice(0, 12).map((recipe) => (
              recipe ? <RecipeCard key={recipe.id} recipe={recipe} /> : null
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-text-muted bg-bg-surface-light rounded-3xl border border-border-color">
              <div className="text-xl font-bold mb-2">В этом цеху пока пусто</div>
            </div>
          )}
        </div>
      </section>

      {editModal && <AdminEditModal isOpen={editModal.isOpen} onClose={() => setEditModal(null)} title={editModal.title} fields={editModal.fields} onSave={editModal.onSave} />}
    </div>
  );
}