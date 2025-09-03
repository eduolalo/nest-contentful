import { get } from 'axios';

import { ContentfulProductsResponse } from '@modules/contentful/interfaces';

export class ContentfulClient {
  private url: string;

  constructor() {
    const baseURL = process.env.CONTENTFUL_BASE_URL!;
    const spaceId = process.env.CONTENTFUL_SPACE_ID!;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
    const environment = process.env.CONTENTFUL_ENVIRONMENT!;
    const contentType = process.env.CONTENTFUL_CONTENT_TYPE!;

    this.url = `${baseURL}/spaces/${spaceId}/environments/${environment}`;
    this.url += `/entries?access_token=${accessToken}&content_type=${contentType}`;
  }

  getURL(): string {
    return this.url;
  }

  async fetchProducts(): Promise<ContentfulProductsResponse> {
    const response = await get<ContentfulProductsResponse>(this.url);
    return response.data;
  }
}
