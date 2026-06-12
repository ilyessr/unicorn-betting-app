import { Injectable } from '@nestjs/common';
import { BetStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BetStatsByStatus,
  BetStatsByType,
  DashboardRepository,
  ProductEventStats,
  RecentBet,
} from './dashboard.repository';

@Injectable()
export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  countBets(): Promise<number> {
    return this.prisma.bet.count();
  }

  countLostBets(): Promise<number> {
    return this.prisma.bet.count({ where: { status: BetStatus.LOST } });
  }

  countRaces(): Promise<number> {
    return this.prisma.race.count();
  }

  countUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  findDemoUser(): Promise<Prisma.UserGetPayload<Record<string, never>> | null> {
    return this.prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
    });
  }

  findMostWinningUnicorn(): Promise<Prisma.UnicornGetPayload<Record<string, never>> | null> {
    return this.prisma.unicorn.findFirst({
      orderBy: [{ victories: 'desc' }, { name: 'asc' }],
    });
  }

  findRecentBets(userId: string): Promise<RecentBet[]> {
    return this.prisma.bet.findMany({
      where: { userId },
      include: {
        race: true,
        selections: { include: { unicorn: true }, orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });
  }

  findUserById(userId: string): Promise<Prisma.UserGetPayload<Record<string, never>> | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async groupBetsByStatus(userId: string): Promise<BetStatsByStatus[]> {
    const stats = await this.prisma.bet.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
      _sum: { amount: true, potentialWin: true },
    });
    return stats as BetStatsByStatus[];
  }

  async groupBetsByType(): Promise<BetStatsByType[]> {
    const stats = await this.prisma.bet.groupBy({
      by: ['type'],
      _count: true,
      _sum: { amount: true },
    });
    return stats as BetStatsByType[];
  }

  async groupProductEvents(): Promise<ProductEventStats[]> {
    const stats = await this.prisma.productEvent.groupBy({
      by: ['name', 'target'],
      _count: true,
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });
    return stats as ProductEventStats[];
  }

  async sumTotalStake(): Promise<Prisma.Decimal | null> {
    const result = await this.prisma.bet.aggregate({ _sum: { amount: true } });
    return result._sum.amount;
  }
}
