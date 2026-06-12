import { http } from '../services/http';
import { Race } from './types';

export const racesApi = {
  list: async () => {
    const response = await http.get<Race[]>('/races');
    return response.data;
  },
};
