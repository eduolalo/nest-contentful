import { registerAs } from '@nestjs/config';

export const AppConfig = registerAs('app', () => ({
  name: process.env.APP_NAME,
  port: Number(process.env.APP_PORT),
}));
