import { BetType } from './api';

export const betTypeLabels: Record<BetType, string> = {
  WINNER: 'Gagnante',
  TOP_3: '3 premières',
  TOP_5: '5 premières',
};

export const selectionCount: Record<BetType, number> = {
  WINNER: 1,
  TOP_3: 3,
  TOP_5: 5,
};

export type Page = 'races' | 'bettor' | 'product';
