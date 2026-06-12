import { http } from '../services/http';
import { TrackEventPayload } from './types';

export const analyticsApi = {
  track: async (payload: TrackEventPayload) => {
    await http.post('/analytics/events', payload).catch(() => undefined);
  },
};
