import { BetType, Prisma } from '@prisma/client';

export type RaceForBet = Prisma.RaceGetPayload<{
  include: { entries: true };
}>;

export type CreatedBetWithPayment = {
  bet: Prisma.BetGetPayload<{
    include: {
      selections: {
        include: { unicorn: true };
      };
    };
  }>;
  payment: Prisma.PaymentGetPayload<Record<string, never>>;
};

export type CreateBetWithPaymentInput = {
  amount: Prisma.Decimal;
  cardLast4: string;
  potentialWin: Prisma.Decimal;
  raceId: string;
  type: BetType;
  unicornIds: string[];
  userId: string;
};

export abstract class BetsRepository {
  abstract findRaceForBet(raceId: string): Promise<RaceForBet | null>;
  abstract createBetWithPayment(input: CreateBetWithPaymentInput): Promise<CreatedBetWithPayment>;
}
