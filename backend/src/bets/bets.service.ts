import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BetType, Prisma } from '@prisma/client';
import { CreateBetDto } from './dto/create-bet.dto';
import { BetsRepository } from './repositories/bets.repository';

const REQUIRED_SELECTIONS: Record<BetType, number> = {
  WINNER: 1,
  TOP_3: 3,
  TOP_5: 5,
};

const ODDS: Record<BetType, number> = {
  WINNER: 4.5,
  TOP_3: 2.4,
  TOP_5: 1.6,
};

@Injectable()
export class BetsService {
  constructor(private readonly betsRepository: BetsRepository) {}

  async create(dto: CreateBetDto) {
    const expectedCount = REQUIRED_SELECTIONS[dto.type];
    if (dto.unicornIds.length !== expectedCount) {
      throw new BadRequestException(`${dto.type} requires ${expectedCount} selection(s)`);
    }

    if (new Set(dto.unicornIds).size !== dto.unicornIds.length) {
      throw new BadRequestException('Selections must be unique');
    }

    const race = await this.betsRepository.findRaceForBet(dto.raceId);

    if (!race) {
      throw new NotFoundException('Race not found');
    }

    const now = new Date();
    if (now < race.bettingOpen || now >= race.startsAt) {
      throw new BadRequestException('Bets open exactly 2 hours before the race and close at race start');
    }

    const allowedUnicornIds = new Set(race.entries.map((entry) => entry.unicornId));
    const invalidSelection = dto.unicornIds.find((id) => !allowedUnicornIds.has(id));
    if (invalidSelection) {
      throw new BadRequestException('All selected unicorns must run in this race');
    }

    const amount = new Prisma.Decimal(dto.amount);
    const potentialWin = new Prisma.Decimal(dto.amount * ODDS[dto.type]);

    return this.betsRepository.createBetWithPayment({
      userId: dto.userId,
      raceId: dto.raceId,
      type: dto.type,
      amount,
      potentialWin,
      unicornIds: dto.unicornIds,
      cardLast4: dto.card.last4,
    });
  }
}
