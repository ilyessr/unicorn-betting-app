import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { errorExamples, productEventExample } from '../docs/swagger-examples';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({
    summary: 'Tracker un événement produit',
    description: 'Enregistre une vue, un clic ou une interaction produit. Le userId est optionnel pour les métriques anonymes.',
  })
  @ApiBody({ type: TrackEventDto })
  @ApiCreatedResponse({
    description: 'Événement produit enregistré.',
    schema: {
      example: productEventExample,
    },
  })
  @ApiBadRequestResponse({
    description: 'Payload invalide.',
    schema: {
      example: errorExamples.validation,
    },
  })
  @Post('events')
  track(@Body() dto: TrackEventDto) {
    return this.analyticsService.track(dto);
  }
}
