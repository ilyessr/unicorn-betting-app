import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendOrigin = process.env.FRONTEND_ORIGIN;
  app.enableCors({
    origin: frontendOrigin
      ? frontendOrigin.split(',').map((origin) => origin.trim())
      : ['http://localhost:5173', 'http://localhost:5174'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Unicorn Betting API')
    .setDescription('API de courses de licornes, paris, paiements simulés et analytics produit.')
    .setVersion('0.1.0')
    .addTag('races', 'Courses du jour et détails des participantes')
    .addTag('bets', 'Création des paris et paiement CB simulé')
    .addTag('dashboard', 'Dashboards parieur et produit')
    .addTag('analytics', 'Tracking des vues et clics produit')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    customSiteTitle: 'Unicorn Betting API Docs',
  });

  const config = app.get(ConfigService);
  await app.listen(config.get<number>('PORT') ?? 3000);
}

bootstrap();
