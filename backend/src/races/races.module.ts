import { Module } from '@nestjs/common';
import { PrismaRacesRepository } from './repositories/prisma-races.repository';
import { RacesRepository } from './repositories/races.repository';
import { RacesController } from './races.controller';
import { RacesService } from './races.service';

@Module({
  controllers: [RacesController],
  providers: [
    RacesService,
    {
      provide: RacesRepository,
      useClass: PrismaRacesRepository,
    },
  ],
  exports: [RacesService],
})
export class RacesModule {}
