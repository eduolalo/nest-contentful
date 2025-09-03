import { Module } from '@nestjs/common';
import { FetchProductsService } from './use-cases/fetch-products/fetch-products.service';
import { ContentfulClient } from './contentful.client';

@Module({
  providers: [FetchProductsService, ContentfulClient]
})
export class ContentfulModule {}
