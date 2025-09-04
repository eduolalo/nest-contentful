import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

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
