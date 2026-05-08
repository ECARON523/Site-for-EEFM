import { create } from 'zustand';
import { Order, OrderStatus, ItemStatus } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

interface OrderState {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  updateOrderItemStatus: (orderId: string, recipeId: string, newStatus: ItemStatus) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'items'> & { items: Omit<Order['items'][0], 'status'>[] }) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => {
  // МАГИЯ РЕАЛЬНОГО ВРЕМЕНИ: Слушаем коллекцию orders из Firebase
  const ordersRef = collection(db, 'orders');
  
  onSnapshot(ordersRef, (snapshot) => {
    const fetchedOrders = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Order[];
    
    // Как только в базе что-то меняется, мы обновляем экран всем пользователям!
    set({ orders: fetchedOrders });
  }, (error) => {
    console.error("Ошибка при получении заказов из Firebase:", error);
  });

  return {
    orders: [], 
    
    // Обновление статуса ВСЕГО заказа (улетает в Firebase)
    updateOrderStatus: async (orderId, newStatus) => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status: newStatus });
      } catch (error) {
        console.error("Ошибка обновления статуса:", error);
      }
    },

    // Обновление статуса КОНКРЕТНОГО БЛЮДА (улетает в Firebase)
    updateOrderItemStatus: async (orderId, recipeId, newStatus) => {
      try {
        const order = get().orders.find(o => o.id === orderId);
        if (!order) return;

        // Обновляем статус у нужного блюда
        const newItems = order.items.map(item => 
          item.recipeId === recipeId ? { ...item, status: newStatus } : item
        );

        // Умная логика статуса всего чека
        const allReady = newItems.every(i => i.status === 'ready');
        const anyCooking = newItems.some(i => i.status === 'cooking' || i.status === 'ready');

        let newOrderStatus = order.status;
        if (allReady) {
          newOrderStatus = 'ready';
        } else if (anyCooking) {
          newOrderStatus = 'cooking';
        } else {
          newOrderStatus = 'pending';
        }

        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { 
          items: newItems,
          status: newOrderStatus 
        });
      } catch (error) {
         console.error("Ошибка обновления статуса блюда:", error);
      }
    },

    // Создание нового заказа (улетает в Firebase)
    createOrder: async (newOrder) => {
      try {
        const orderRef = doc(collection(db, 'orders')); // Firebase сам генерирует уникальный ID
        const order: Order = {
          ...newOrder,
          id: orderRef.id,
          items: newOrder.items.map(item => ({ ...item, status: 'pending' })),
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        await setDoc(orderRef, order);
      } catch (error) {
        console.error("Ошибка создания заказа:", error);
      }
    }
  };
});