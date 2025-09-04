import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const port = config.get<number>('app.port') ?? 3000;

  await app
    .listen(port)
    .then(() => {
      console.log(`Application is running on: http://localhost:${port}`);
    })
    .catch((err) => {
      console.error('Error starting application:', err);
    });
}
bootstrap();
