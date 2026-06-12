import { BetType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CardDto {
  @ApiProperty({
    example: 'tok_demo_card',
    description: 'Token CB renvoyé par le prestataire de paiement côté front.',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: '4242',
    description: 'Quatre derniers chiffres de la carte. Ne jamais envoyer le numéro complet.',
  })
  @IsString()
  last4: string;
}

export class CreateBetDto {
  @ApiProperty({ example: 'clx_user_001' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'clx_race_001' })
  @IsString()
  raceId: string;

  @ApiProperty({
    enum: BetType,
    example: BetType.TOP_3,
    description: 'WINNER attend 1 licorne, TOP_3 en attend 3, TOP_5 en attend 5.',
  })
  @IsEnum(BetType)
  type: BetType;

  @ApiProperty({ example: 15, minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    example: ['clx_unicorn_001', 'clx_unicorn_002', 'clx_unicorn_003'],
    minItems: 1,
    maxItems: 5,
    type: [String],
    description: 'Licornes sélectionnées dans l’ordre du pronostic.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsString({ each: true })
  unicornIds: string[];

  @ApiProperty({ type: CardDto })
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
}
