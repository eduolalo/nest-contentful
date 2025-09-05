import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Logger } from '@nestjs/common';

import { FetchAndStoreService } from './use-cases';
import { ProductsController } from './controllers';
import { Product } from './entities';

import { ContentfulModule } from '@modules/contentful/contentful.module';
import { SearchService } from './use-cases/search.service';
import { DeleteService } from './use-cases/delete.service';
import { ProductsReportsController } from './controllers/products-reports.controller';
import { DeletedProductsReportService } from './use-cases/deleted-products-report.service';
import { ProductsReportService } from './use-cases/products-report.service';
import { ProductsCategoryReportService } from './use-cases/products-category-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ContentfulModule],
  providers: [FetchAndStoreService, Logger, SearchService, DeleteService, DeletedProductsReportService, ProductsReportService, ProductsCategoryReportService],
  controllers: [ProductsController, ProductsReportsController],
})
export class ProductsModule {}
