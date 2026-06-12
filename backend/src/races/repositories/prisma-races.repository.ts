import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RaceDetail, RacesRepository, RaceWithEntries } from './races.repository';

@Injectable()
export class PrismaRacesRepository implements RacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBetween(start: Date, end: Date): Promise<RaceWithEntries[]> {
    return this.prisma.race.findMany({
      where: {
        startsAt: {
          gte: start,
          lt: end,
        },
      },
      include: {
        entries: {
          include: { unicorn: true },
          orderBy: { lane: 'asc' },
        },
        _count: { select: { bets: true } },
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  findById(id: string): Promise<RaceDetail | null> {
    return this.prisma.race.findUnique({
      where: { id },
      include: {
        entries: {
          include: { unicorn: true },
          orderBy: { lane: 'asc' },
        },
      },
    });
  }
}
