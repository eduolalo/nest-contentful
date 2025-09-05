import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentfulModule } from './modules/contentful/contentful.module';
import { ProductsModule } from './modules/products/products.module';
import { CommonModule } from './modules/common/common.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule, ContentfulModule, ProductsModule, CommonModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
