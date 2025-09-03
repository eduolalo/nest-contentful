import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentfulModule } from './modules/contentful/contentful.module';

@Module({
  imports: [ConfigModule, ContentfulModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
