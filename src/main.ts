import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     stopAtFirstError: true,
  //   }),
  // );
  app.useStaticAssets(join(__dirname, '../uploads'));
  await app.listen(parseInt(process.env.PORT) || 4000);
}
bootstrap();
