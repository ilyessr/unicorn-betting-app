import { Injectable } from '@nestjs/common';
import { BetStatus } from '@prisma/client';
import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  demoUser() {
    return this.dashboardRepository.findDemoUser();
  }

  async bettorDashboard(userId: string) {
    const [user, betStats, recentBets, mostWinningUnicorn] = await Promise.all([
      this.dashboardRepository.findUserById(userId),
      this.dashboardRepository.groupBetsByStatus(userId),
      this.dashboardRepository.findRecentBets(userId),
      this.dashboardRepository.findMostWinningUnicorn(),
    ]);

    const totals = betStats.reduce(
      (acc, item) => {
        acc.totalBets += item._count;
        acc.totalStaked += Number(item._sum.amount ?? 0);
        if (item.status === BetStatus.WON) {
          acc.wonBets += item._count;
          acc.potentialWinnings += Number(item._sum.potentialWin ?? 0);
        }
        if (item.status === BetStatus.LOST) {
          acc.lostBets += item._count;
        }
        return acc;
      },
      { totalBets: 0, wonBets: 0, lostBets: 0, totalStaked: 0, potentialWinnings: 0 },
    );

    return {
      user,
      totals,
      mostWinningUnicorn,
      recentBets,
    };
  }

  async productDashboard() {
    const [
      betCount,
      lostBetCount,
      totalStake,
      totalUsers,
      totalRaces,
      eventStats,
      betsByType,
      mostWinningUnicorn,
    ] = await Promise.all([
      this.dashboardRepository.countBets(),
      this.dashboardRepository.countLostBets(),
      this.dashboardRepository.sumTotalStake(),
      this.dashboardRepository.countUsers(),
      this.dashboardRepository.countRaces(),
      this.dashboardRepository.groupProductEvents(),
      this.dashboardRepository.groupBetsByType(),
      this.dashboardRepository.findMostWinningUnicorn(),
    ]);

    return {
      kpis: {
        betCount,
        lostBetCount,
        lostBetRate: betCount === 0 ? 0 : lostBetCount / betCount,
        totalStake: Number(totalStake ?? 0),
        totalUsers,
        totalRaces,
      },
      betsByType: betsByType.map((item) => ({
        type: item.type,
        count: item._count,
        stake: Number(item._sum.amount ?? 0),
      })),
      productEvents: eventStats.map((item) => ({
        name: item.name,
        target: item.target,
        count: item._count,
      })),
      mostWinningUnicorn,
    };
  }
}
