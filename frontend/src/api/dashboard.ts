import { http } from '../services/http';
import { BettorDashboard, ProductDashboard } from './types';

export const dashboardApi = {
  demoUser: async () => {
    const response = await http.get<{ id: string; name: string; email: string; balance: string } | null>(
      '/dashboard/demo-user',
    );
    return response.data;
  },
  bettor: async (userId: string) => {
    const response = await http.get<BettorDashboard>(`/dashboard/bettors/${userId}`);
    return response.data;
  },
  product: async () => {
    const response = await http.get<ProductDashboard>('/dashboard/product');
    return response.data;
  },
};
