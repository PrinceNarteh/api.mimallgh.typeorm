import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    index: false,
    prefix: '/uploads/',
  });
  await app.listen(parseInt(process.env.PORT) || 4000);
}
bootstrap();
