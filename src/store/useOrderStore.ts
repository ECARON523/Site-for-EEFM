import { create } from 'zustand';
import { Order, OrderStatus } from '../types';

interface OrderState {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [], // НАЧИНАЕМ С ПУСТОЙ ДОСКИ
  
  updateOrderStatus: async (orderId, newStatus) => {
    set((state) => ({
      orders: state.orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    }));
  },

  createOrder: async (newOrder) => {
    const order: Order = {
      ...newOrder,
      id: `ord-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      orders: [...state.orders, order]
    }));
  }
}));