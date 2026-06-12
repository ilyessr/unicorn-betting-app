import { Injectable } from '@nestjs/common';
import { PaymentStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AuthorizePaymentInput, PaymentsRepository } from './payments.repository';

@Injectable()
export class PrismaPaymentsRepository implements PaymentsRepository {
  createAuthorizedPayment(
    tx: Prisma.TransactionClient,
    input: AuthorizePaymentInput,
  ): Promise<Prisma.PaymentGetPayload<Record<string, never>>> {
    return tx.payment.create({
      data: {
        betId: input.betId,
        amount: input.amount,
        cardLast4: input.cardLast4,
        providerRef: `cb_${randomUUID()}`,
        status: PaymentStatus.AUTHORIZED,
        authorizedAt: new Date(),
      },
    });
  }
}
