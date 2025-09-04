import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Logger } from '@nestjs/common';

import { FetchAndStoreService } from './use-cases';
import { ProductsController } from './controllers';
import { Product } from './entities';

import { ContentfulModule } from '@modules/contentful/contentful.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ContentfulModule],
  providers: [FetchAndStoreService, Logger],
  controllers: [ProductsController],
})
export class ProductsModule {}
