import { http } from '../services/http';
import { CreateBetPayload } from './types';

export const betsApi = {
  create: async (payload: CreateBetPayload) => {
    const response = await http.post('/bets', payload);
    return response.data;
  },
};
