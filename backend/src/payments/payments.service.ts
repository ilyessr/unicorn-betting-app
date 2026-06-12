import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaymentsRepository } from './repositories/payments.repository';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async authorizeCardPayment(
    tx: Prisma.TransactionClient,
    betId: string,
    amount: Prisma.Decimal,
    cardLast4: string,
  ) {
    return this.paymentsRepository.createAuthorizedPayment(tx, {
      betId,
      amount,
      cardLast4,
    });
  }
}
