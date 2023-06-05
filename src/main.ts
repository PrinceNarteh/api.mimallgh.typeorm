import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ForbiddenException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { join } from 'path';

const whitelist = [
  'https://mimallgh.com',
  'https://admin.mimallgh.com',
  'https://shop.mimallgh.com',
];

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
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Not allowed by CORS'));
      }
    },
      
  });
  app.useStaticAssets(join(__dirname, '../uploads'));
  await app.listen(parseInt(process.env.PORT) || 4000);
}
bootstrap();
