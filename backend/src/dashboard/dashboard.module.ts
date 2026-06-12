import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './repositories/dashboard.repository';
import { PrismaDashboardRepository } from './repositories/prisma-dashboard.repository';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    {
      provide: DashboardRepository,
      useClass: PrismaDashboardRepository,
    },
  ],
})
export class DashboardModule {}
