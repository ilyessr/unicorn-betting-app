import { IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackEventDto {
  @ApiPropertyOptional({
    example: 'clx_user_001',
    description: 'Optionnel pour permettre les métriques anonymes.',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    example: 'click',
    description: 'Type d’événement produit: view, click, submit, etc.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'bet-submit',
    description: 'Cible fonctionnelle de l’événement.',
  })
  @IsString()
  target: string;

  @ApiPropertyOptional({
    example: { betType: 'TOP_3' },
    description: 'Métadonnées libres associées à l’événement.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
