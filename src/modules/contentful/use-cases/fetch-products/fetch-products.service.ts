import { Injectable, Logger } from '@nestjs/common';

import { ContentfulClient } from '@modules/contentful/libs/contentful.client';
import { IContentfulProductEntry } from '@modules/contentful/interfaces';

@Injectable()
export class FetchProductsService {
  constructor(
    private readonly contentfulClient: ContentfulClient,
    private readonly logger: Logger,
  ) {}

  async fetchProducts(): Promise<IContentfulProductEntry[]> {
    try {
      const products = await this.contentfulClient.fetchProducts();

      return products.items;
    } catch (error) {
      this.logger.error(error);

      return [];
    }
  }
}
