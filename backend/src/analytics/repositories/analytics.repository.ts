import { Prisma } from '@prisma/client';

export type TrackProductEventInput = {
  metadata?: Prisma.InputJsonValue;
  name: string;
  target: string;
  userId?: string;
};

export abstract class AnalyticsRepository {
  abstract createProductEvent(input: TrackProductEventInput): Promise<Prisma.ProductEventGetPayload<Record<string, never>>>;
}
