import api from './api';
import type { Order, OrderStatus } from '../types';

export const orderService = {
  async createOrder(data: { shippingAddress: string; notes?: string }): Promise<Order> {
    const res = await api.post<Order>('/orders', data);
    return res.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await api.get<Order[]>('/orders');
    return res.data;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const res = await api.get<Order>(`/orders/${orderId}`);
    return res.data;
  },

  // Admin APIs
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const res = await api.put<Order>(`/orders/${orderId}/status`, { status });
    return res.data;
  },

  async updateTrackingNumber(orderId: string, trackingNumber: string): Promise<Order> {
    const res = await api.put<Order>(`/orders/${orderId}/tracking`, { trackingNumber });
    return res.data;
  },
};
