import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { betCreatedExample, errorExamples } from '../docs/swagger-examples';

@ApiTags('bets')
@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @ApiOperation({
    summary: 'Créer un pari',
    description:
      'Crée un pari sur une course ouverte, valide le nombre de sélections selon le type de pari et autorise un paiement CB simulé.',
  })
  @ApiBody({ type: CreateBetDto })
  @ApiCreatedResponse({
    description: 'Pari créé et paiement CB autorisé.',
    schema: {
      example: betCreatedExample,
    },
  })
  @ApiBadRequestResponse({
    description: 'Payload invalide, nombre de sélections incorrect, licorne hors course ou fenêtre de pari fermée.',
    schema: {
      examples: {
        validation: { value: errorExamples.validation },
        bettingClosed: { value: errorExamples.bettingClosed },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Course introuvable.',
    schema: {
      example: errorExamples.raceNotFound,
    },
  })
  @Post()
  create(@Body() dto: CreateBetDto) {
    return this.betsService.create(dto);
  }
}
