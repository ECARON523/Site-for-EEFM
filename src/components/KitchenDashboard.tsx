import { useState } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { Clock, Crown, CheckCircle2, ChefHat, Archive, ExternalLink, History, RotateCcw, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { ItemStatus } from '../types';
import { Link } from 'react-router-dom';

type ViewMode = 'active' | 'archived';
type DepartmentFilter = 'all' | 'Горячий цех' | 'Холодный цех' | 'Десерты' | 'Бар';

export default function KitchenDashboard() {
  // БРОНЯ: Убеждаемся, что store отдает массив
  const orders = useOrderStore(state => state.orders) || [];
  const updateOrderStatus = useOrderStore(state => state.updateOrderStatus);
  const updateOrderItemStatus = useOrderStore(state => state.updateOrderItemStatus);
  
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [selectedDept, setSelectedDept] = useState<DepartmentFilter>('all');

  // БРОНЯ: Защита от undefined заказов
  const validOrders = orders.filter(o => o != null);

  const baseOrders = validOrders.filter(o => viewMode === 'active' ? o.status !== 'archived' : o.status === 'archived');

  const filteredOrders = baseOrders.filter(order => {
    if (selectedDept === 'all') return true;
    // БРОНЯ: Защита от отсутствия items
    return (order.items || []).some(item => {
      const itemDept = item?.department || 'Горячий цех';
      return itemDept === selectedDept;
    });
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // БРОНЯ: Защита от отсутствия createdAt
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    if (viewMode === 'archived') {
      return timeB - timeA; 
    }
    if (a.status === 'ready' && b.status !== 'ready') return 1;
    if (b.status === 'ready' && a.status !== 'ready') return -1;
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    return timeA - timeB;
  });

  const getDepartmentColor = (dept?: string) => {
    const d = dept?.toLowerCase() || '';
    if (d.includes('горяч')) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (d.includes('холод')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (d.includes('десерт')) return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
    if (d.includes('бар')) return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  const handleItemClick = (orderId: string, recipeId: string, currentStatus: ItemStatus) => {
    const nextStatus: ItemStatus = currentStatus === 'pending' ? 'cooking' : currentStatus === 'cooking' ? 'ready' : 'pending';
    updateOrderItemStatus(orderId, recipeId, nextStatus);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-6">
        <h1 className="text-4xl font-black uppercase tracking-tight text-text-primary flex items-center gap-4">
          <ChefHat className="w-10 h-10 text-primary" /> Доска заказов
        </h1>
        <div className="flex bg-bg-surface-light p-1.5 rounded-2xl border border-border-color shadow-sm">
          <button onClick={() => setViewMode('active')} className={cn("px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2", viewMode === 'active' ? "bg-bg-surface text-text-primary shadow-md border border-border-color" : "text-text-muted hover:text-text-primary")}>
            <ChefHat className="w-5 h-5" /> Текущие заказы
          </button>
          <button onClick={() => setViewMode('archived')} className={cn("px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2", viewMode === 'archived' ? "bg-bg-surface text-text-primary shadow-md border border-border-color" : "text-text-muted hover:text-text-primary")}>
            <History className="w-5 h-5" /> Архив выданного
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 bg-bg-surface p-4 rounded-2xl border border-border-color shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2 text-text-muted font-bold uppercase tracking-wider text-xs"><Filter className="w-4 h-4" /> Станция:</div>
          {(['all', 'Горячий цех', 'Холодный цех', 'Десерты', 'Бар'] as DepartmentFilter[]).map(dept => (
            <button key={dept} onClick={() => setSelectedDept(dept)} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all border", selectedDept === dept ? "bg-primary text-black border-primary shadow-md" : "bg-bg-surface-light text-text-muted border-border-color hover:text-text-primary")}>
              {dept === 'all' ? 'Все цеха (Сборка)' : dept}
            </button>
          ))}
        </div>
        {viewMode === 'active' && (
          <div className="flex gap-6 pl-4 lg:border-l border-border-color">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary"><span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></span>Новые</div>
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>В работе</div>
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary"><span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>Готовы</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6 items-start">
        {sortedOrders.map((order) => {
          // БРОНЯ: Защита от undefined order
          if (!order) return null;

          const safeItems = order.items || [];
          
          const visibleItems = safeItems.filter(item => {
            if (!item) return false;
            if (selectedDept === 'all') return true;
            return (item.department || 'Горячий цех') === selectedDept;
          });

          return (
            <div key={order.id || Math.random()} className={cn("bg-bg-surface rounded-2xl flex flex-col overflow-hidden transition-all shadow-xl relative", (order.isVip && viewMode === 'active') ? "ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.15)] ring-offset-2 ring-offset-bg-primary" : "border border-border-color", order.status === 'ready' && "opacity-80 scale-[0.99]", order.status === 'archived' && "opacity-60 grayscale-[30%] border-dashed border-2")}>
              
              <div className={cn("p-5 relative transition-colors", order.status === 'pending' ? "bg-yellow-400 text-black" : order.status === 'cooking' ? "bg-blue-600 text-white" : order.status === 'ready' ? "bg-green-600 text-white" : "bg-bg-surface-light text-text-muted border-b border-border-color")}>
                {order.isVip && (
                  <div className={cn("absolute top-0 right-0 text-[10px] font-black uppercase px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 shadow-sm", order.status === 'pending' ? "bg-black text-yellow-400" : "bg-yellow-400 text-black", order.status === 'archived' && "bg-transparent text-text-muted shadow-none opacity-50")}>
                    <Crown className="w-3 h-3" /> VIP
                  </div>
                )}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-mono font-bold opacity-80">#{(order.id || 'err').split('-')[1]?.toUpperCase() || 'NEW'}</span>
                  <span className={cn("text-sm font-black flex items-center gap-1.5 px-2.5 py-1 rounded-md", (order.status === 'pending' || order.status === 'archived') ? "bg-black/10" : "bg-black/20")}>
                    <Clock className="w-4 h-4" />{order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                  </span>
                </div>
                <div className={cn("font-black text-2xl truncate pr-20", order.status === 'archived' && "text-text-primary")}>{order.userName || 'Гость'}</div>
              </div>

              <div className="p-4 flex-1 flex flex-col gap-0 min-h-[150px]">
                {visibleItems.map((item, idx) => {
                  if (!item) return null;
                  return (
                    <div key={idx} className={cn("flex justify-between items-center gap-4 py-3 border-b border-border-color/50 last:border-0", item.status === 'ready' && "opacity-50")}>
                      <div className="flex-1">
                        <Link to={`/recipe/${item.recipeId}`} className={cn("font-bold text-base leading-tight group flex items-start gap-2 transition-colors mb-1.5", order.status === 'archived' ? "text-text-primary" : "text-text-primary hover:text-primary")} title="Открыть рецепт">
                          <span className={cn("group-hover:underline underline-offset-4 line-clamp-2", item.status === 'ready' && "line-through")}>{item.title || 'Блюдо'}</span>
                          {order.status !== 'archived' && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />}
                        </Link>
                        <div className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border w-fit inline-block", order.status === 'archived' ? "text-text-muted border-border-color bg-bg-surface" : getDepartmentColor(item.department))}>
                          {item.department || 'Без цеха'}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="font-black text-xl text-text-primary">x{item.quantity || 1}</div>
                        {order.status !== 'archived' && (
                          <button 
                            onClick={() => handleItemClick(order.id, item.recipeId, item.status || 'pending')}
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 active:scale-95",
                              (!item.status || item.status === 'pending') ? "bg-bg-surface-light border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 shadow-[0_0_10px_rgba(250,204,21,0.1)]" :
                              item.status === 'cooking' ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-pulse" :
                              "bg-green-600 border-green-600 text-white shadow-md"
                            )}
                          >
                            {(!item.status || item.status === 'pending') && <Clock className="w-6 h-6" />}
                            {item.status === 'cooking' && <ChefHat className="w-6 h-6" />}
                            {item.status === 'ready' && <CheckCircle2 className="w-6 h-6" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-bg-surface border-t border-border-color">
                {order.status === 'pending' && (
                  <button onClick={() => updateOrderStatus(order.id, 'cooking')} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors active:scale-[0.98]">
                    Начать готовить
                  </button>
                )}
                {order.status === 'cooking' && (
                  <button onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-green-600 hover:bg-green-500 text-white transition-colors active:scale-[0.98] flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Блюда готовы
                  </button>
                )}
                {selectedDept === 'all' && order.status === 'ready' && (
                  <button onClick={() => updateOrderStatus(order.id, 'archived')} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-green-500 hover:bg-green-400 text-black transition-colors active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                    <Archive className="w-5 h-5" /> Выдать заказ
                  </button>
                )}
                {selectedDept === 'all' && order.status !== 'ready' && order.status !== 'archived' && (
                  <div className="w-full py-3 rounded-xl bg-bg-surface-light border border-border-color flex items-center justify-center gap-2">
                    <span className="text-sm font-bold text-text-muted uppercase tracking-widest">
                      Готово блюд: <span className="text-primary font-black text-lg ml-1">{safeItems.filter(i => i?.status === 'ready').length} / {safeItems.length}</span>
                    </span>
                  </div>
                )}
                {selectedDept !== 'all' && order.status !== 'archived' && (
                   <div className="w-full text-center text-xs font-bold text-text-muted uppercase tracking-widest">
                     Станция: {selectedDept}
                   </div>
                )}
                {order.status === 'archived' && (
                  <button onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-bg-surface hover:bg-bg-surface-light border border-border-color text-text-muted hover:text-text-primary transition-colors active:scale-[0.98] flex items-center justify-center gap-2">
                    <RotateCcw className="w-5 h-5" /> Вернуть в "Готовые"
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {sortedOrders.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-text-muted bg-bg-surface rounded-3xl border border-border-color border-dashed shadow-sm">
             <ChefHat className={cn("w-20 h-20 mb-6", viewMode === 'active' ? "text-primary opacity-20" : "opacity-20")} />
             <p className="text-xl font-black uppercase tracking-widest opacity-50">
               {viewMode === 'active' ? (selectedDept === 'all' ? 'Нет активных заказов' : `Нет заказов: ${selectedDept}`) : 'Архив пуст'}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}