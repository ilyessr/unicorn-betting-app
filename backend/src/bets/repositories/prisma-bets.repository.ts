import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../payments/repositories/payments.repository';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BetsRepository,
  CreateBetWithPaymentInput,
  CreatedBetWithPayment,
  RaceForBet,
} from './bets.repository';

@Injectable()
export class PrismaBetsRepository implements BetsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  findRaceForBet(raceId: string): Promise<RaceForBet | null> {
    return this.prisma.race.findUnique({
      where: { id: raceId },
      include: { entries: true },
    });
  }

  createBetWithPayment(input: CreateBetWithPaymentInput): Promise<CreatedBetWithPayment> {
    return this.prisma.$transaction(async (tx) => {
      const bet = await tx.bet.create({
        data: {
          userId: input.userId,
          raceId: input.raceId,
          type: input.type,
          amount: input.amount,
          potentialWin: input.potentialWin,
          selections: {
            create: input.unicornIds.map((unicornId, index) => ({
              unicornId,
              position: index + 1,
            })),
          },
        },
        include: {
          selections: { include: { unicorn: true } },
        },
      });

      const payment = await this.paymentsRepository.createAuthorizedPayment(tx, {
        betId: bet.id,
        amount: input.amount,
        cardLast4: input.cardLast4,
      });

      await tx.race.update({
        where: { id: input.raceId },
        data: { totalPool: { increment: input.amount } },
      });

      return { bet, payment };
    });
  }
}
