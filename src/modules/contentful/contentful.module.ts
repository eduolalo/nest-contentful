import { Module, Logger } from '@nestjs/common';

import { FetchProductsService } from './use-cases/fetch-products/fetch-products.service';
import { ContentfulClient } from '@modules/contentful/libs';

@Module({
  providers: [FetchProductsService, ContentfulClient, Logger],
})
export class ContentfulModule {}
