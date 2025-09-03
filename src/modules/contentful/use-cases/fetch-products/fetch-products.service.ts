import { Injectable } from '@nestjs/common';

import { ContentfulClient } from '@modules/contentful/libs/contentful.client';
import { IContentfulProductEntry } from '@modules/contentful/interfaces';

@Injectable()
export class FetchProductsService {
  constructor(private readonly contentfulClient: ContentfulClient) {}

  async fetchProducts(): Promise<IContentfulProductEntry[]> {
    const products = await this.contentfulClient.fetchProducts();
    return products.items;
  }
}
