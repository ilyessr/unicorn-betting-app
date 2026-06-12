import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsRepository, TrackProductEventInput } from './analytics.repository';

@Injectable()
export class PrismaAnalyticsRepository implements AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createProductEvent(input: TrackProductEventInput): Promise<Prisma.ProductEventGetPayload<Record<string, never>>> {
    return this.prisma.productEvent.create({
      data: {
        userId: input.userId,
        name: input.name,
        target: input.target,
        metadata: input.metadata,
      },
    });
  }
}
