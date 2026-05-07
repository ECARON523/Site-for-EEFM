import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { cn } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { addNotification } = useNotificationStore();
  const { currentUser } = useAuthStore();
  const { createOrder } = useOrderStore(); // Подключили хранилище заказов

  const handleCheckout = () => {
    if (!currentUser) {
      addNotification('Пожалуйста, войдите в аккаунт для оформления заказа', 'error');
      return;
    }

    // Создаем реальный заказ!
    createOrder({
      userId: currentUser.id,
      userName: currentUser.name || 'Гость',
      isVip: currentUser.role === 'vip',
      totalPrice: getTotalPrice(),
      items: items.map(item => ({
        recipeId: item.id, // НАСТОЯЩИЙ ID БЛЮДА
        title: item.title,
        quantity: item.quantity,
        department: item.department
      }))
    });

    addNotification('Заказ успешно отправлен на кухню!', 'success');
    clearCart();
    onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-[60] transition-opacity" onClick={onClose} />}
      <div className={cn("fixed top-0 right-0 h-full w-full sm:w-[400px] bg-bg-surface z-[70] shadow-2xl transition-transform duration-300 flex flex-col border-l border-border-color", isOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between p-6 border-b border-border-color shrink-0">
          <h2 className="text-xl font-black text-text-primary flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" />Ваш заказ</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary bg-bg-surface-light rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-lg font-medium">Корзина пока пуста</p>
              <button onClick={onClose} className="px-6 py-2 bg-bg-surface-light text-text-primary rounded-full font-bold hover:bg-border-color transition-colors">Вернуться к меню</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-text-primary text-sm line-clamp-2 leading-tight">{item.title}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-black text-text-primary">{item.price * item.quantity} ₽</div>
                    <div className="flex items-center bg-bg-surface-light rounded-full border border-border-color h-8">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-6 text-center font-bold text-text-primary text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border-color bg-bg-surface shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-text-muted font-medium">Итого к оплате</span>
              <span className="text-2xl font-black text-text-primary">{getTotalPrice()} ₽</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary-hover text-black font-black py-4 rounded-xl transition-transform active:scale-[0.98] text-lg shadow-lg shadow-primary/20">
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </>
  );
}