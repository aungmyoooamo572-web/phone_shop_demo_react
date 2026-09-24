import api from './api';
import type { Payment, PaymentProvider } from '../types';

export const paymentService = {
  async createPayment(data: {
    orderId: string;
    provider: PaymentProvider;
    transactionId?: string;
    paymentSlipUrl?: string;
  }): Promise<Payment> {
    const res = await api.post<Payment>('/payments', data);
    return res.data;
  },

  async getPaymentsByOrder(orderId: string): Promise<Payment[]> {
    const res = await api.get<Payment[]>(`/payments/order/${orderId}`);
    return res.data;
  },

  async getPaymentById(paymentId: string): Promise<Payment> {
    const res = await api.get<Payment>(`/payments/${paymentId}`);
    return res.data;
  },

  // Admin APIs
  async verifyPayment(paymentId: string): Promise<Payment> {
    const res = await api.post<Payment>(`/payments/${paymentId}/verify`);
    return res.data;
  },

  async rejectPayment(paymentId: string): Promise<Payment> {
    const res = await api.post<Payment>(`/payments/${paymentId}/reject`);
    return res.data;
  },
};
