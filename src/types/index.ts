export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
}

export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  token: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface PhoneVariant {
  id: string;
  ram: string;
  storage: string;
  color: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl?: string;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface PhoneImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Phone {
  id: string;
  name: string;
  model: string;
  description?: string;
  processor?: string;
  screenSize?: number;
  battery?: number;
  camera?: string;
  operatingSystem?: string;
  releaseDate?: string;
  brand?: Brand;
  category?: Category;
  variants: PhoneVariant[];
  images: PhoneImage[];
}

export interface CartItem {
  id: string;
  phoneVariantId: string;
  phoneName: string;
  ram: string;
  storage: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  phoneVariantId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export type PaymentProvider = 'KPAY' | 'WAVEPAY' | 'BANK_TRANSFER' | 'COD';
export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  provider: PaymentProvider;
  transactionId?: string;
  paymentSlipUrl?: string;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}
