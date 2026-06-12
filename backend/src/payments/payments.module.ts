import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { PrismaPaymentsRepository } from './repositories/prisma-payments.repository';

@Module({
  providers: [
    PaymentsService,
    {
      provide: PaymentsRepository,
      useClass: PrismaPaymentsRepository,
    },
  ],
  exports: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
