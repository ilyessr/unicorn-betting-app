import { Prisma } from '@prisma/client';

export type AuthorizePaymentInput = {
  amount: Prisma.Decimal;
  betId: string;
  cardLast4: string;
};

export abstract class PaymentsRepository {
  abstract createAuthorizedPayment(
    tx: Prisma.TransactionClient,
    input: AuthorizePaymentInput,
  ): Promise<Prisma.PaymentGetPayload<Record<string, never>>>;
}
