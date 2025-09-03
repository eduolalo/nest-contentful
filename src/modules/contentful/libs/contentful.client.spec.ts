import { GetProductsMock } from '@mocks/contentful-api';
import { ContentfulProductsResponse } from '@modules/contentful/interfaces';

jest.mock('axios', () => ({
  get: jest
    .fn()
    .mockResolvedValue({ status: 200, data: GetProductsMock as ContentfulProductsResponse }),
}));

import { ContentfulClient } from './contentful.client';

describe('ContentfulClient', () => {
  let client: ContentfulClient;

  beforeEach(() => {
    client = new ContentfulClient();
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  it('should construct the correct API URL', () => {
    const baseURL = process.env.CONTENTFUL_BASE_URL!;
    const spaceId = process.env.CONTENTFUL_SPACE_ID!;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
    const environment = process.env.CONTENTFUL_ENVIRONMENT!;
    const contentType = process.env.CONTENTFUL_CONTENT_TYPE!;
    const url =
      `${baseURL}/spaces/${spaceId}/environments/${environment}` +
      `/entries?access_token=${accessToken}&content_type=${contentType}`;

    expect(client.getURL()).toBe(url);
  });

  it('should fetch products successfully', async () => {
    const products = await client.fetchProducts();

    expect(products).toBeDefined();
  });
});
