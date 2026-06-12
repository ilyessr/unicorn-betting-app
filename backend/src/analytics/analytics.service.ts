import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TrackEventDto } from './dto/track-event.dto';
import { AnalyticsRepository } from './repositories/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  track(dto: TrackEventDto) {
    return this.analyticsRepository.createProductEvent({
      userId: dto.userId,
      name: dto.name,
      target: dto.target,
      metadata: dto.metadata as Prisma.InputJsonValue | undefined,
    });
  }
}
