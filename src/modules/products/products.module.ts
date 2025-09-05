import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Logger } from '@nestjs/common';

import { FetchAndStoreService } from './use-cases';
import { ProductsController } from './controllers';
import { Product } from './entities';

import { ContentfulModule } from '@modules/contentful/contentful.module';
import { SearchService } from './use-cases/search.service';
import { DeleteService } from './use-cases/delete.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ContentfulModule],
  providers: [FetchAndStoreService, Logger, SearchService, DeleteService],
  controllers: [ProductsController],
})
export class ProductsModule {}
