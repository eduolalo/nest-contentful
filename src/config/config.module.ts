import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import EnvSchemaValidator from './env.schema.validator'

@Module({
  imports: [NestConfigModule.forRoot({
    isGlobal: true,
    validationSchema: EnvSchemaValidator,
  })],

})
export class ConfigModule {}
