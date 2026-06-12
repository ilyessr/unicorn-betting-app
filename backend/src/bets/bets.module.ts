import { Module } from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { BetsController } from './bets.controller';
import { BetsService } from './bets.service';
import { BetsRepository } from './repositories/bets.repository';
import { PrismaBetsRepository } from './repositories/prisma-bets.repository';

@Module({
  imports: [PaymentsModule],
  controllers: [BetsController],
  providers: [
    BetsService,
    {
      provide: BetsRepository,
      useClass: PrismaBetsRepository,
    },
  ],
  exports: [BetsService],
})
export class BetsModule {}
