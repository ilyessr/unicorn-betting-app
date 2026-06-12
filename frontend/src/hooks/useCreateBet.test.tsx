import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Race } from '../api';
import { useCreateBet } from './useCreateBet';

const apiMocks = vi.hoisted(() => ({
  createBet: vi.fn(),
  delay: vi.fn(),
  track: vi.fn(),
}));

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api');

  return {
    ...actual,
    analyticsApi: { track: apiMocks.track },
    betsApi: { create: apiMocks.createBet },
  };
});

vi.mock('../utils/format', async () => {
  const actual = await vi.importActual<typeof import('../utils/format')>('../utils/format');

  return {
    ...actual,
    delay: apiMocks.delay,
  };
});

function wrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

const race = {
  id: 'race-1',
  name: 'Grand Prix Licorne',
  startsAt: '2026-06-12T12:00:00.000Z',
  bettingOpen: '2026-06-12T10:00:00.000Z',
  status: 'OPEN',
  totalPool: '0',
  entries: [],
} satisfies Race;

describe('useCreateBet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiMocks.createBet.mockResolvedValue({ id: 'bet-1' });
    apiMocks.track.mockResolvedValue(undefined);
    apiMocks.delay.mockResolvedValue(undefined);
  });

  it('tracks and creates a bet', async () => {
    const { result } = renderHook(
      () =>
        useCreateBet({
          amount: 25,
          betType: 'TOP_3',
          demoUserId: 'user-1',
          selectedRace: race,
          selectedUnicornIds: ['unicorn-1', 'unicorn-2', 'unicorn-3'],
        }),
      { wrapper: wrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(apiMocks.track).toHaveBeenCalledWith({
      userId: 'user-1',
      name: 'click',
      target: 'bet-submit',
      metadata: { betType: 'TOP_3' },
    });
    expect(apiMocks.delay).toHaveBeenCalledWith(1200);
    expect(apiMocks.createBet).toHaveBeenCalledWith({
      userId: 'user-1',
      raceId: 'race-1',
      type: 'TOP_3',
      amount: 25,
      unicornIds: ['unicorn-1', 'unicorn-2', 'unicorn-3'],
      card: { token: 'tok_demo_card', last4: '4242' },
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('does nothing when no race is selected', async () => {
    const { result } = renderHook(
      () =>
        useCreateBet({
          amount: 25,
          betType: 'WINNER',
          demoUserId: 'user-1',
          selectedUnicornIds: ['unicorn-1'],
        }),
      { wrapper: wrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(apiMocks.track).not.toHaveBeenCalled();
    expect(apiMocks.createBet).not.toHaveBeenCalled();
  });
});
