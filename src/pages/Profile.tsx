import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useOrderStore } from '../store/useOrderStore';
import { Clock, ShoppingBag, History, Crown, ShieldAlert, ChefHat, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

type Tab = 'active_orders' | 'history';

export default function Profile() {
  const { id } = useParams();
  const { currentUser } = useAuthStore();
  const { users } = useUserStore();
  const { orders } = useOrderStore();

  const [activeTab, setActiveTab] = useState<Tab>('active_orders');

  const profileUser = users.find(u => u.id === id);
  const isOwnProfile = currentUser?.id === profileUser?.id;

  if (!profileUser) {
    return <div className="p-8 text-center text-text-muted">Пользователь не найден</div>;
  }

  if (!isOwnProfile && currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const userOrders = orders.filter(o => o.userId === profileUser.id);
  const activeOrders = userOrders.filter(o => o.status === 'pending' || o.status === 'cooking');
  const historyOrders = userOrders.filter(o => o.status === 'ready' || o.status === 'archived');

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-500 rounded-lg text-xs font-black uppercase tracking-widest"><ShieldAlert className="w-3.5 h-3.5" /> Администратор</div>;
      case 'vip': return <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/20 text-yellow-500 rounded-lg text-xs font-black uppercase tracking-widest"><Crown className="w-3.5 h-3.5" /> VIP Клиент</div>;
      case 'kitchen': return <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-500 rounded-lg text-xs font-black uppercase tracking-widest"><ChefHat className="w-3.5 h-3.5" /> Персонал Кухни</div>;
      default: return <div className="flex items-center gap-1.5 px-3 py-1 bg-bg-surface-light text-text-muted rounded-lg text-xs font-black uppercase tracking-widest"><UserIcon className="w-3.5 h-3.5" /> Клиент</div>;
    }
  };

  const getClientOrderStatus = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-400 text-black px-3 py-1 rounded-md text-xs font-bold uppercase">Ожидает на кухне</span>;
      case 'cooking': return <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase flex items-center gap-1"><ChefHat className="w-3 h-3" /> Готовится</span>;
      case 'ready': 
      case 'archived': return <span className="bg-bg-surface-light text-text-muted px-3 py-1 rounded-md text-xs font-bold uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Выполнен</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-8 px-4 sm:px-6">
      <Helmet>
        <title>{profileUser.name} | Личный кабинет</title>
      </Helmet>

      <div className="bg-bg-surface rounded-3xl p-6 sm:p-10 mb-8 border border-border-color shadow-sm relative overflow-hidden">
        {profileUser.role === 'vip' && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        )}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative shrink-0">
            {profileUser.avatar ? (
              <img src={profileUser.avatar} alt={profileUser.name} className="w-32 h-32 rounded-full object-cover border-4 border-bg-surface-light shadow-lg" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-bg-surface-light border-4 border-border-color flex items-center justify-center text-4xl font-black text-text-muted">
                {profileUser.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-black text-text-primary mb-3 leading-tight">{profileUser.name}</h1>
            <div className="flex justify-center sm:justify-start mb-6">
              {getRoleBadge(profileUser.role || 'user')}
            </div>

            <div className="flex items-center justify-center sm:justify-start bg-bg-surface-light/50 p-4 rounded-2xl border border-border-color/50 inline-flex px-8">
              <div className="text-center">
                <div className="text-2xl font-black text-text-primary">{userOrders.length}</div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Всего заказов</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-bg-surface-light p-1.5 rounded-2xl border border-border-color w-fit">
        <button
          onClick={() => setActiveTab('active_orders')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
            activeTab === 'active_orders' ? "bg-bg-surface text-text-primary shadow-sm border border-border-color" : "text-text-muted hover:text-text-primary hover:bg-bg-surface/50"
          )}
        >
          <ShoppingBag className="w-4 h-4" /> Текущие заказы
          {activeOrders.length > 0 && <span className="bg-primary text-black px-2 py-0.5 rounded-md text-xs">{activeOrders.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
            activeTab === 'history' ? "bg-bg-surface text-text-primary shadow-sm border border-border-color" : "text-text-muted hover:text-text-primary hover:bg-bg-surface/50"
          )}
        >
          <History className="w-4 h-4" /> История покупок
        </button>
      </div>

      <div className="min-h-[400px]">
        <div className="space-y-4">
          {(() => {
            const displayOrders = activeTab === 'active_orders' ? activeOrders : historyOrders;
            
            if (displayOrders.length === 0) {
              return (
                <div className="text-center py-20 bg-bg-surface rounded-3xl border border-border-color border-dashed">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-20" />
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {activeTab === 'active_orders' ? 'У вас нет активных заказов' : 'История пуста'}
                  </h3>
                  <p className="text-text-muted">Самое время выбрать что-нибудь вкусное из меню!</p>
                </div>
              );
            }

            return displayOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
              <div key={order.id} className={cn(
                "bg-bg-surface p-6 rounded-2xl border transition-all",
                activeTab === 'active_orders' ? "border-primary/30 shadow-md" : "border-border-color opacity-80"
              )}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border-color pb-4">
                  <div>
                    <div className="text-sm font-bold text-text-muted font-mono mb-1">Заказ #{order.id.split('-')[1].toUpperCase()}</div>
                    <div className="text-xs text-text-muted flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div>
                    {getClientOrderStatus(order.status)}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4 text-sm font-medium text-text-primary">
                      <div className="flex items-start gap-3">
                        <span className="text-text-muted font-black w-6">x{item.quantity}</span>
                        <span>{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border-color border-dashed">
                  <span className="font-bold text-text-muted">Итого:</span>
                  <span className="text-xl font-black text-text-primary">{order.totalPrice} ₽</span>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}