import { Module } from '@nestjs/common';
import { FetchProductsService } from './use-cases/fetch-products/fetch-products.service';

@Module({
  providers: [FetchProductsService]
})
export class ContentfulModule {}
