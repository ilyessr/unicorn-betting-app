import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { PrismaAnalyticsRepository } from './repositories/prisma-analytics.repository';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    {
      provide: AnalyticsRepository,
      useClass: PrismaAnalyticsRepository,
    },
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
