import { useOrderStore } from '../store/useOrderStore';
import { Clock, Crown, CheckCircle2, ChefHat, Archive, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { OrderStatus } from '../types';
import { Link } from 'react-router-dom'; // Добавили импорт Link

export default function KitchenDashboard() {
  const { orders, updateOrderStatus } = useOrderStore();

  // Отфильтровываем заказы в архиве
  const activeOrders = orders.filter(o => o.status !== 'archived');

  // Умная сортировка: VIP первее, затем по времени. Готовые уходят вниз.
  const sortedOrders = [...activeOrders].sort((a, b) => {
    if (a.status === 'ready' && b.status !== 'ready') return 1;
    if (b.status === 'ready' && a.status !== 'ready') return -1;
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const getDepartmentColor = (dept?: string) => {
    switch (dept) {
      case 'Горячий цех': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'Холодный цех': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'Бар': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'Десерты': return 'text-pink-400 bg-pink-400/10 border-pink-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Шапка доски */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <h1 className="text-4xl font-black uppercase tracking-tight text-text-primary flex items-center gap-4">
          <ChefHat className="w-10 h-10 text-primary" />
          Доска заказов
        </h1>
        <div className="flex gap-6 bg-bg-surface p-4 rounded-2xl border border-border-color">
          <div className="flex items-center gap-2 text-base font-bold"><span className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>Новые</div>
          <div className="flex items-center gap-2 text-base font-bold"><span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>В работе</div>
          <div className="flex items-center gap-2 text-base font-bold"><span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>Готовы</div>
        </div>
      </div>

      {/* Сетка чеков */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 items-start">
        {sortedOrders.map((order) => (
          <div 
            key={order.id} 
            className={cn(
              "bg-bg-surface rounded-3xl flex flex-col overflow-hidden transition-all shadow-xl relative",
              order.isVip ? "border-[3px] border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.15)]" : "border border-border-color",
              order.status === 'ready' && "opacity-80 scale-[0.98]"
            )}
          >
            {/* VIP Бейдж */}
            {order.isVip && (
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-black uppercase px-4 py-2 rounded-bl-2xl flex items-center gap-1.5 shadow-md z-10">
                <Crown className="w-4 h-4" /> VIP ЗАКАЗ
              </div>
            )}

            {/* Шапка чека */}
            <div className={cn(
              "p-6 border-b border-border-color",
              order.status === 'pending' ? "bg-yellow-500/10" : 
              order.status === 'cooking' ? "bg-blue-500/10" : "bg-green-500/10"
            )}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-base text-text-muted font-mono font-bold">#{order.id.split('-')[1].toUpperCase()}</span>
                <span className="text-sm text-text-primary font-bold flex items-center gap-1.5 bg-bg-surface px-3 py-1 rounded-lg border border-border-color">
                  <Clock className="w-4 h-4 text-primary" />
                  {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="font-black text-text-primary text-2xl truncate">{order.userName}</div>
            </div>

            {/* Список блюд (Тело чека) */}
            <div className="p-6 flex-1 flex flex-col gap-5 min-h-[200px]">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 pb-5 border-b border-border-color/50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-4">
                    
                    {/* ССЫЛКА НА РЕЦЕПТ */}
                    <Link 
                      to={`/recipe/${item.recipeId}`}
                      className="font-bold text-text-primary text-lg leading-tight group flex items-start gap-2 hover:text-primary transition-colors"
                      title="Открыть рецепт"
                    >
                      <span className="group-hover:underline underline-offset-4">{item.title}</span>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                    </Link>

                    <span className="font-black text-2xl text-primary shrink-0 bg-primary/10 px-3 py-1 rounded-xl">x{item.quantity}</span>
                  </div>
                  <div className={cn("text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border w-fit", getDepartmentColor(item.department))}>
                    {item.department || 'Без цеха'}
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопки статуса */}
            <div className="p-4 bg-bg-surface border-t border-border-color">
              {order.status === 'pending' && (
                <button 
                  onClick={() => updateOrderStatus(order.id, 'cooking')}
                  className="w-full py-5 rounded-2xl font-black uppercase tracking-wide text-base bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                  Начать готовить
                </button>
              )}
              {order.status === 'cooking' && (
                <button 
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  className="w-full py-5 rounded-2xl font-black uppercase tracking-wide text-base bg-green-500 hover:bg-green-600 text-white transition-colors shadow-lg shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-6 h-6" /> Заказ готов
                </button>
              )}
              {order.status === 'ready' && (
                <button 
                  onClick={() => updateOrderStatus(order.id, 'archived')}
                  className="w-full py-5 rounded-2xl font-black uppercase tracking-wide text-base bg-bg-surface-light border-2 border-border-color hover:bg-border-color text-text-primary transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Archive className="w-6 h-6 text-text-muted" /> Выдан (В архив)
                </button>
              )}
            </div>
          </div>
        ))}

        {sortedOrders.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-text-muted bg-bg-surface-light rounded-3xl border border-border-color border-dashed">
            <ChefHat className="w-24 h-24 mb-6 opacity-20" />
            <p className="text-2xl font-black uppercase tracking-widest opacity-50">Нет активных заказов</p>
          </div>
        )}
      </div>
    </div>
  );
}