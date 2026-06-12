import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AnalyticsModule } from './analytics/analytics.module';
import { BetsModule } from './bets/bets.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { RacesModule } from './races/races.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), 'backend/.env'),
        join(process.cwd(), '.env'),
        '.env',
      ],
    }),
    PrismaModule,
    RacesModule,
    BetsModule,
    PaymentsModule,
    DashboardModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
