import { Injectable, NotFoundException } from '@nestjs/common';
import { RaceStatus } from '@prisma/client';
import { RacesRepository } from './repositories/races.repository';

@Injectable()
export class RacesService {
  constructor(private readonly racesRepository: RacesRepository) {}

  async findToday() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const races = await this.racesRepository.findBetween(start, end);

    return races.map((race) => ({
      ...race,
      status: this.computeStatus(race.bettingOpen, race.startsAt, race.status),
    }));
  }

  async findOne(id: string) {
    const race = await this.racesRepository.findById(id);

    if (!race) {
      throw new NotFoundException('Race not found');
    }

    return {
      ...race,
      status: this.computeStatus(race.bettingOpen, race.startsAt, race.status),
    };
  }

  computeStatus(bettingOpen: Date, startsAt: Date, storedStatus: RaceStatus) {
    if (storedStatus === RaceStatus.FINISHED) {
      return storedStatus;
    }

    const now = new Date();
    if (now < bettingOpen) {
      return RaceStatus.SCHEDULED;
    }

    if (now >= bettingOpen && now < startsAt) {
      return RaceStatus.OPEN;
    }

    return RaceStatus.CLOSED;
  }
}
