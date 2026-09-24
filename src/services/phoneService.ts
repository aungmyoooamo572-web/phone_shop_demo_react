import api from './api';
import type { Brand, Category, Phone } from '../types';

export const phoneService = {
  async getAllPhones(): Promise<Phone[]> {
    const res = await api.get<Phone[]>('/phones');
    return res.data;
  },

  async getPhoneById(id: string): Promise<Phone> {
    const res = await api.get<Phone>(`/phones/${id}`);
    return res.data;
  },

  async getPhonesByBrand(brandId: string): Promise<Phone[]> {
    const res = await api.get<Phone[]>(`/phones/brand/${brandId}`);
    return res.data;
  },

  async getPhonesByCategory(categoryId: string): Promise<Phone[]> {
    const res = await api.get<Phone[]>(`/phones/category/${categoryId}`);
    return res.data;
  },

  async searchPhones(name: string): Promise<Phone[]> {
    const res = await api.get<Phone[]>(`/phones/search`, { params: { name } });
    return res.data;
  },

  async getBrands(): Promise<Brand[]> {
    const res = await api.get<Brand[]>('/brands');
    return res.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get<Category[]>('/categories');
    return res.data;
  },
};
