import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsApi, dashboardApi, racesApi } from '../api';

export function useAppData() {
  const queryClient = useQueryClient();

  const racesQuery = useQuery({
    queryKey: ['races'],
    queryFn: racesApi.list,
  });

  const demoUserQuery = useQuery({
    queryKey: ['demo-user'],
    queryFn: dashboardApi.demoUser,
  });

  const demoUserId = demoUserQuery.data?.id ?? '';

  const bettorQuery = useQuery({
    queryKey: ['bettor-dashboard', demoUserId],
    queryFn: () => dashboardApi.bettor(demoUserId),
    enabled: Boolean(demoUserId),
  });

  const productQuery = useQuery({
    queryKey: ['product-dashboard'],
    queryFn: dashboardApi.product,
  });

  const refreshProductMutation = useMutation({
    mutationFn: () =>
      analyticsApi.track({
        userId: demoUserId || undefined,
        name: 'view',
        target: 'product-dashboard',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-dashboard'] });
    },
  });

  return {
    races: racesQuery.data ?? [],
    bettor: bettorQuery.data ?? null,
    product: productQuery.data ?? null,
    demoUser: demoUserQuery.data ?? null,
    demoUserId,
    loading:
      racesQuery.isLoading ||
      demoUserQuery.isLoading ||
      bettorQuery.isLoading ||
      productQuery.isLoading,
    productLoading: refreshProductMutation.isPending || productQuery.isFetching,
    error:
      racesQuery.error ||
      demoUserQuery.error ||
      bettorQuery.error ||
      productQuery.error ||
      refreshProductMutation.error,
    hasNoDemoUser: demoUserQuery.isSuccess && !demoUserQuery.data,
    refreshProductUsage: refreshProductMutation.mutate,
    refreshAll: () => queryClient.invalidateQueries(),
  };
}
