import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentfulModule } from './modules/contentful/contentful.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule, ContentfulModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
