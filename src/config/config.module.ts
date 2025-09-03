import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { getDataSourceName, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { DatabaseConfig, DatabaseResolver as db } from '@config/database.config';

import EnvSchemaValidator from './env.schema.validator'

@Module({
  imports: [
    NestConfigModule.forRoot({
    isGlobal: true,
    load: [DatabaseConfig],
    validationSchema: EnvSchemaValidator,
  }),
  TypeOrmModule.forRootAsync({
    useFactory: (config: ConfigService) => db(config.get('database.default')),
    inject: [ConfigService],
  }),
],

})
export class ConfigModule {}
