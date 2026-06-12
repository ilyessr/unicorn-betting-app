import { BetStatus, BetType, Prisma } from '@prisma/client';

export type BetStatsByStatus = {
  status: BetStatus;
  _count: number;
  _sum: {
    amount: Prisma.Decimal | null;
    potentialWin: Prisma.Decimal | null;
  };
};

export type RecentBet = Prisma.BetGetPayload<{
  include: {
    race: true;
    selections: {
      include: { unicorn: true };
    };
  };
}>;

export type ProductEventStats = {
  name: string;
  target: string;
  _count: number;
};

export type BetStatsByType = {
  type: BetType;
  _count: number;
  _sum: {
    amount: Prisma.Decimal | null;
  };
};

export abstract class DashboardRepository {
  abstract countBets(): Promise<number>;
  abstract countLostBets(): Promise<number>;
  abstract countRaces(): Promise<number>;
  abstract countUsers(): Promise<number>;
  abstract findDemoUser(): Promise<Prisma.UserGetPayload<Record<string, never>> | null>;
  abstract findMostWinningUnicorn(): Promise<Prisma.UnicornGetPayload<Record<string, never>> | null>;
  abstract findRecentBets(userId: string): Promise<RecentBet[]>;
  abstract findUserById(userId: string): Promise<Prisma.UserGetPayload<Record<string, never>> | null>;
  abstract groupBetsByStatus(userId: string): Promise<BetStatsByStatus[]>;
  abstract groupBetsByType(): Promise<BetStatsByType[]>;
  abstract groupProductEvents(): Promise<ProductEventStats[]>;
  abstract sumTotalStake(): Promise<Prisma.Decimal | null>;
}
