import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppData } from './useAppData';

const apiMocks = vi.hoisted(() => ({
  bettor: vi.fn(),
  demoUser: vi.fn(),
  product: vi.fn(),
  racesList: vi.fn(),
  track: vi.fn(),
}));

vi.mock('../api', () => ({
  analyticsApi: { track: apiMocks.track },
  dashboardApi: {
    demoUser: apiMocks.demoUser,
    bettor: apiMocks.bettor,
    product: apiMocks.product,
  },
  racesApi: { list: apiMocks.racesList },
}));

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

describe('useAppData', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    apiMocks.racesList.mockResolvedValue([{ id: 'race-1', entries: [] }]);
    apiMocks.demoUser.mockResolvedValue({
      id: 'user-1',
      name: 'Camille Martin',
      email: 'camille@example.com',
      balance: '120',
    });
    apiMocks.bettor.mockResolvedValue({ totals: { totalBets: 1 }, recentBets: [] });
    apiMocks.product.mockResolvedValue({ kpis: { betCount: 2 }, productEvents: [] });
    apiMocks.track.mockResolvedValue(undefined);
  });

  it('loads races, dashboards and the demo user', async () => {
    const { result } = renderHook(() => useAppData(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.demoUserId).toBe('user-1');
    expect(result.current.races).toHaveLength(1);
    expect(result.current.bettor).toEqual({ totals: { totalBets: 1 }, recentBets: [] });
    expect(result.current.product).toEqual({ kpis: { betCount: 2 }, productEvents: [] });
    expect(apiMocks.bettor).toHaveBeenCalledWith('user-1');
  });

  it('marks the state when no demo user exists', async () => {
    apiMocks.demoUser.mockResolvedValue(null);

    const { result } = renderHook(() => useAppData(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.hasNoDemoUser).toBe(true));

    expect(result.current.demoUserId).toBe('');
    expect(apiMocks.bettor).not.toHaveBeenCalled();
  });

  it('tracks product dashboard refreshes', async () => {
    const { result } = renderHook(() => useAppData(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.demoUserId).toBe('user-1'));

    result.current.refreshProductUsage();

    await waitFor(() =>
      expect(apiMocks.track).toHaveBeenCalledWith({
        userId: 'user-1',
        name: 'view',
        target: 'product-dashboard',
      }),
    );
  });
});
