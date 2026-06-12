const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type BetType = 'WINNER' | 'TOP_3' | 'TOP_5';

export type Unicorn = {
  id: string;
  name: string;
  color: string;
  victories: number;
};

export type Race = {
  id: string;
  name: string;
  startsAt: string;
  bettingOpen: string;
  status: 'SCHEDULED' | 'OPEN' | 'CLOSED' | 'FINISHED';
  totalPool: string;
  entries: Array<{
    id: string;
    lane: number;
    finishRank: number | null;
    unicorn: Unicorn;
  }>;
  _count?: { bets: number };
};

export type BettorDashboard = {
  user: { id: string; name: string; email: string; balance: string } | null;
  totals: {
    totalBets: number;
    wonBets: number;
    lostBets: number;
    totalStaked: number;
    potentialWinnings: number;
  };
  mostWinningUnicorn: Unicorn | null;
  recentBets: Array<{
    id: string;
    type: BetType;
    amount: string;
    potentialWin: string;
    status: string;
    race: Race;
    selections: Array<{ position: number; unicorn: Unicorn }>;
  }>;
};

export type ProductDashboard = {
  kpis: {
    betCount: number;
    lostBetCount: number;
    lostBetRate: number;
    totalStake: number;
    totalUsers: number;
    totalRaces: number;
  };
  betsByType: Array<{ type: BetType; count: number; stake: number }>;
  productEvents: Array<{ name: string; target: string; count: number }>;
  mostWinningUnicorn: Unicorn | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? 'Request failed');
  }

  return response.json();
}

export const api = {
  races: () => request<Race[]>('/races'),
  demoUser: () => request<{ id: string; name: string; email: string; balance: string } | null>('/dashboard/demo-user'),
  bettorDashboard: (userId: string) => request<BettorDashboard>(`/dashboard/bettors/${userId}`),
  productDashboard: () => request<ProductDashboard>('/dashboard/product'),
  createBet: (payload: {
    userId: string;
    raceId: string;
    type: BetType;
    amount: number;
    unicornIds: string[];
    card: { token: string; last4: string };
  }) =>
    request('/bets', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  track: (payload: { userId?: string; name: string; target: string; metadata?: Record<string, unknown> }) =>
    request('/analytics/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).catch(() => undefined),
};
