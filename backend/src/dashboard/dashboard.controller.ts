import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  bettorDashboardExample,
  productDashboardExample,
  userExample,
} from '../docs/swagger-examples';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Dashboard parieur',
    description: 'Retourne les totaux du parieur, ses derniers paris et la licorne qui a le plus gagné.',
  })
  @ApiParam({ name: 'userId', example: 'clx_user_001' })
  @ApiOkResponse({
    description: 'Statistiques du parieur.',
    schema: {
      example: bettorDashboardExample,
    },
  })
  @Get('bettors/:userId')
  bettor(@Param('userId') userId: string) {
    return this.dashboardService.bettorDashboard(userId);
  }

  @ApiOperation({
    summary: 'Dashboard produit',
    description: 'Retourne les KPI produit: paris, pertes, volume misé, événements de vue/clic et stats par type de pari.',
  })
  @ApiOkResponse({
    description: 'KPI produit et statistiques d’usage.',
    schema: {
      example: productDashboardExample,
    },
  })
  @Get('product')
  product() {
    return this.dashboardService.productDashboard();
  }

  @ApiOperation({
    summary: 'Parieur de démonstration',
    description: 'Retourne le premier utilisateur seedé afin de simplifier la démo front.',
  })
  @ApiOkResponse({
    description: 'Utilisateur de démonstration ou null si la base n’est pas seedée.',
    schema: {
      example: userExample,
      nullable: true,
    },
  })
  @Get('demo-user')
  demoUser() {
    return this.dashboardService.demoUser();
  }
}
