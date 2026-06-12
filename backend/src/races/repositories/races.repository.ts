import { RaceStatus, Prisma } from '@prisma/client';

export type RaceWithEntries = Prisma.RaceGetPayload<{
  include: {
    entries: {
      include: { unicorn: true };
    };
    _count: { select: { bets: true } };
  };
}>;

export type RaceDetail = Prisma.RaceGetPayload<{
  include: {
    entries: {
      include: { unicorn: true };
    };
  };
}>;

export type RaceWithComputedStatus<T> = Omit<T, 'status'> & {
  status: RaceStatus;
};

export abstract class RacesRepository {
  abstract findBetween(start: Date, end: Date): Promise<RaceWithEntries[]>;
  abstract findById(id: string): Promise<RaceDetail | null>;
}
