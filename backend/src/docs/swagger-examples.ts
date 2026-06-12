export const errorExamples = {
  validation: {
    statusCode: 400,
    message: ['amount must not be less than 1'],
    error: 'Bad Request',
  },
  raceNotFound: {
    statusCode: 404,
    message: 'Race not found',
    error: 'Not Found',
  },
  bettingClosed: {
    statusCode: 400,
    message: 'Bets open exactly 2 hours before the race and close at race start',
    error: 'Bad Request',
  },
};

export const userExample = {
  id: 'clx_user_001',
  email: 'camille@example.com',
  name: 'Camille Martin',
  balance: '120',
  createdAt: '2026-06-12T08:00:00.000Z',
};

export const raceExample = {
  id: 'clx_race_001',
  name: 'Grand Prix Licorne 1',
  startsAt: '2026-06-12T13:30:00.000Z',
  bettingOpen: '2026-06-12T11:30:00.000Z',
  status: 'OPEN',
  totalPool: '250',
  createdAt: '2026-06-12T08:00:00.000Z',
  entries: [
    {
      id: 'clx_entry_001',
      raceId: 'clx_race_001',
      unicornId: 'clx_unicorn_001',
      lane: 1,
      finishRank: null,
      unicorn: {
        id: 'clx_unicorn_001',
        name: 'Rainbow Dash',
        color: '#60a5fa',
        victories: 42,
        createdAt: '2026-06-12T08:00:00.000Z',
      },
    },
  ],
  _count: { bets: 12 },
};

export const betCreatedExample = {
  bet: {
    id: 'clx_bet_001',
    userId: 'clx_user_001',
    raceId: 'clx_race_001',
    type: 'TOP_3',
    amount: '15',
    potentialWin: '36',
    status: 'PENDING',
    createdAt: '2026-06-12T11:35:00.000Z',
    selections: [
      {
        id: 'clx_selection_001',
        betId: 'clx_bet_001',
        unicornId: 'clx_unicorn_001',
        position: 1,
        unicorn: {
          id: 'clx_unicorn_001',
          name: 'Rainbow Dash',
          color: '#60a5fa',
          victories: 42,
          createdAt: '2026-06-12T08:00:00.000Z',
        },
      },
    ],
  },
  payment: {
    id: 'clx_payment_001',
    betId: 'clx_bet_001',
    provider: 'stripe',
    providerRef: 'cb_123e4567-e89b-12d3-a456-426614174000',
    cardLast4: '4242',
    amount: '15',
    status: 'AUTHORIZED',
    authorizedAt: '2026-06-12T11:35:01.000Z',
    capturedAt: null,
    createdAt: '2026-06-12T11:35:01.000Z',
  },
};

export const productDashboardExample = {
  kpis: {
    betCount: 1240,
    lostBetCount: 812,
    lostBetRate: 0.65,
    totalStake: 18650,
    totalUsers: 3,
    totalRaces: 10,
  },
  betsByType: [
    { type: 'WINNER', count: 500, stake: 7500 },
    { type: 'TOP_3', count: 420, stake: 6300 },
    { type: 'TOP_5', count: 320, stake: 4850 },
  ],
  productEvents: [
    { name: 'view', target: 'race-list', count: 1580 },
    { name: 'click', target: 'bet-submit', count: 940 },
  ],
  mostWinningUnicorn: {
    id: 'clx_unicorn_001',
    name: 'Rainbow Dash',
    color: '#60a5fa',
    victories: 42,
    createdAt: '2026-06-12T08:00:00.000Z',
  },
};

export const bettorDashboardExample = {
  user: userExample,
  totals: {
    totalBets: 8,
    wonBets: 3,
    lostBets: 4,
    totalStaked: 120,
    potentialWinnings: 260,
  },
  mostWinningUnicorn: productDashboardExample.mostWinningUnicorn,
  recentBets: [betCreatedExample.bet],
};

export const productEventExample = {
  id: 'clx_event_001',
  userId: 'clx_user_001',
  name: 'click',
  target: 'bet-submit',
  metadata: { betType: 'TOP_3' },
  createdAt: '2026-06-12T11:35:00.000Z',
};
