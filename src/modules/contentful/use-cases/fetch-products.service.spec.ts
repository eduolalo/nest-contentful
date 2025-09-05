import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

import { ContentfulClient } from '@modules/contentful/libs/contentful.client';
import { ContentfulProductsResponse } from '@modules/contentful/interfaces';
import { FetchProductsService } from './';

import { GetProductsMock } from '@mocks/contentful-api';

describe('FetchProductsService', () => {
  let service: FetchProductsService;
  let client: ContentfulClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchProductsService,
        Logger,
        {
          provide: ContentfulClient,
          useValue: {
            fetchProducts: jest.fn().mockResolvedValue(GetProductsMock),
          },
        },
      ],
    }).compile();

    service = module.get<FetchProductsService>(FetchProductsService);
    client = module.get<ContentfulClient>(ContentfulClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch products using ContentfulClient', async () => {
    const items = (GetProductsMock as ContentfulProductsResponse).items;
    const products = await service.fetchProducts();

    expect(products).toEqual(items);
    expect(client.fetchProducts).toHaveBeenCalled();
  });
});
