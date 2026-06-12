import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { errorExamples, raceExample } from '../docs/swagger-examples';
import { RacesService } from './races.service';

@ApiTags('races')
@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @ApiOperation({
    summary: 'Lister les courses du jour',
    description: 'Retourne les courses dont le départ est prévu aujourd’hui, avec les participantes et le statut recalculé.',
  })
  @ApiOkResponse({
    description: 'Liste des courses du jour.',
    schema: {
      example: [raceExample],
    },
  })
  @Get()
  findToday() {
    return this.racesService.findToday();
  }

  @ApiOperation({
    summary: 'Détail d’une course',
    description: 'Retourne une course avec ses licornes inscrites, leurs couloirs et résultats éventuels.',
  })
  @ApiParam({ name: 'id', example: 'clx_race_001' })
  @ApiOkResponse({
    description: 'Course trouvée.',
    schema: {
      example: raceExample,
    },
  })
  @ApiNotFoundResponse({
    description: 'Course introuvable.',
    schema: {
      example: errorExamples.raceNotFound,
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.racesService.findOne(id);
  }
}
