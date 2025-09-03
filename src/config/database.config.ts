import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { registerAs } from '@nestjs/config';
import { join } from 'path';

interface IDatabaseConnections {
  default: string;
  connections: Record<string, TypeOrmModuleOptions>;
}

export const Connections = (): IDatabaseConnections => ({
  default: process.env.DB_CONNECTION || 'postgres',
  connections: {
    postgres: {
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      synchronize: false,
      migrationsRun: false,
      namingStrategy: new SnakeNamingStrategy(),
      logger: 'advanced-console',
      logging: process.env.DB_LOGGING === 'true',
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '../database/migrations/**/*{.ts,.js}')],

      // TypeORM module configs
      autoLoadEntities: true,
    },
    test: {
      type: 'postgres',
      host: process.env.DB_TEST_HOST || 'localhost',
      port: Number(process.env.DB_TEST_PORT) || 5432,
      username: process.env.DB_TEST_USERNAME || 'test',
      password: process.env.DB_TEST_PASSWORD || 'test',
      database: process.env.DB_TEST_DATABASE || 'test',
      schema: process.env.DB_TEST_SCHEMA || 'public',
      synchronize: false,
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy(),
      dropSchema: true,
      logging: false,
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '../database/migrations/**/*{.ts,.js}')],

      // TypeORM module configs
      autoLoadEntities: true,
    },
  },
});

export const DatabaseConfig = registerAs('database', Connections);

export const DatabaseResolver = (name?: string): TypeOrmModuleOptions => {
  const { connections, default: defaultConnection } = Connections();

  if (process.env.NODE_ENV === 'test') {
    return connections.test;
  }

  const connection = name ?? defaultConnection;
  return connections[connection];
};
