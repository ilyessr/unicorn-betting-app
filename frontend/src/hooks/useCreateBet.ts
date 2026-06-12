import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi, betsApi, BetType, Race } from '../api';
import { delay } from '../utils/format';

type CreateBetInput = {
  amount: number;
  betType: BetType;
  demoUserId: string;
  selectedRace?: Race;
  selectedUnicornIds: string[];
};

export function useCreateBet({
  amount,
  betType,
  demoUserId,
  selectedRace,
  selectedUnicornIds,
}: CreateBetInput) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!selectedRace) return;

      await analyticsApi.track({
        userId: demoUserId,
        name: 'click',
        target: 'bet-submit',
        metadata: { betType },
      });
      await delay(1200);
      await betsApi.create({
        userId: demoUserId,
        raceId: selectedRace.id,
        type: betType,
        amount,
        unicornIds: selectedUnicornIds,
        card: { token: 'tok_demo_card', last4: '4242' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] });
      queryClient.invalidateQueries({ queryKey: ['bettor-dashboard', demoUserId] });
      queryClient.invalidateQueries({ queryKey: ['product-dashboard'] });
    },
  });
}
