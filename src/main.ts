import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { join } from 'path';
import { AppModule } from './app.module';

export let app: NestExpressApplication;

async function bootstrap() {
  app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      stopAtFirstError: true,
      transform: true,
    }),
  );
  // app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: '*',
  });
  app.useStaticAssets(join(__dirname, '../uploads'));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT');
  await app.listen(port);
}
bootstrap();
