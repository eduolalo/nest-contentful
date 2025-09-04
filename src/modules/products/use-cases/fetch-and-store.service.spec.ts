import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { FetchProductsService } from '@modules/contentful/use-cases';
import { FetchAndStoreService } from './fetch-and-store.service';
import { Product } from '@modules/products/entities';
import { IContentfulProductEntry } from '@modules/contentful/interfaces';

import { GetProductsMock } from '@mocks/contentful-api/get-products.mock';

describe('FetchAndStoreService', () => {
  const PRODUCT_REPOSITORY_TOKEN = getRepositoryToken(Product);
  let service: FetchAndStoreService;
  let fetchProductsService: FetchProductsService;
  let repository: Repository<Product>;
  let logger: Logger;

  const mockEntry: IContentfulProductEntry = GetProductsMock.items[0];

  const mockProduct: Product = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    externalId: mockEntry.sys.id,
    publishedVersion: 1,
    revision: 1,
    sku: mockEntry.fields.sku,
    name: mockEntry.fields.name,
    brand: mockEntry.fields.brand,
    model: mockEntry.fields.model,
    category: mockEntry.fields.category,
    color: mockEntry.fields.color,
    price: mockEntry.fields.price,
    currency: mockEntry.fields.currency,
    stock: mockEntry.fields.stock,
    createdAt: new Date(mockEntry.sys.createdAt),
    updatedAt: new Date(mockEntry.sys.updatedAt),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchAndStoreService,
        Logger,
        {
          provide: FetchProductsService,
          useValue: {
            fetchProducts: jest.fn(),
          },
        },
        {
          provide: PRODUCT_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FetchAndStoreService>(FetchAndStoreService);
    fetchProductsService = module.get<FetchProductsService>(FetchProductsService);
    repository = module.get<Repository<Product>>(PRODUCT_REPOSITORY_TOKEN);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(fetchProductsService).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('run', () => {
    it('should fetch, parse and save products successfully', async () => {
      const mockEntries = [mockEntry];
      jest.spyOn(fetchProductsService, 'fetchProducts').mockResolvedValue(mockEntries);
      jest.spyOn(repository, 'create').mockReturnValue(mockProduct);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProduct);

      await service.run();

      expect(fetchProductsService.fetchProducts).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({
        externalId: mockEntry.sys.id,
        publishedVersion: mockEntry.sys.publishedVersion,
        revision: mockEntry.sys.revision,
        sku: mockEntry.fields.sku,
        name: mockEntry.fields.name,
        price: mockEntry.fields.price,
        brand: mockEntry.fields.brand,
        model: mockEntry.fields.model,
        category: mockEntry.fields.category,
        color: mockEntry.fields.color,
        currency: mockEntry.fields.currency,
        stock: mockEntry.fields.stock,
        createdAt: new Date(mockEntry.sys.createdAt),
        updatedAt: new Date(mockEntry.sys.updatedAt),
      });
      expect(repository.findOne).toHaveBeenCalledWith({
        select: ['id'],
        where: { externalId: mockEntry.sys.id },
      });
      expect(repository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle empty entries array', async () => {
      jest.spyOn(fetchProductsService, 'fetchProducts').mockResolvedValue([]);

      await service.run();

      expect(fetchProductsService.fetchProducts).toHaveBeenCalledTimes(1);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save new product when it does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProduct);

      await service.save(mockProduct);

      expect(repository.findOne).toHaveBeenCalledWith({
        select: ['id'],
        where: { externalId: mockProduct.externalId },
      });
      expect(repository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('should update existing product when it exists', async () => {
      const existingProduct = { id: 'existing-id' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingProduct as Product);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      await service.save(mockProduct);

      expect(repository.findOne).toHaveBeenCalledWith({
        select: ['id'],
        where: { externalId: mockProduct.externalId },
      });
      expect(repository.update).toHaveBeenCalledWith(
        { id: 'existing-id' },
        expect.objectContaining({
          externalId: mockProduct.externalId,
          publishedVersion: mockProduct.publishedVersion,
          revision: mockProduct.revision,
          sku: mockProduct.sku,
          name: mockProduct.name,
          brand: mockProduct.brand,
          model: mockProduct.model,
          category: mockProduct.category,
          color: mockProduct.color,
          price: mockProduct.price,
          currency: mockProduct.currency,
          stock: mockProduct.stock,
          createdAt: mockProduct.createdAt,
          updatedAt: mockProduct.updatedAt,
          deletedAt: mockProduct.deletedAt,
          fetchedAt: expect.any(Date),
        }),
      );
    });

    it('should log error when save fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockRejectedValue(error);
      jest.spyOn(logger, 'error');

      await service.save(mockProduct);

      expect(logger.error).toHaveBeenCalledWith(
        `Error saving product: ${mockProduct.name}, SKU: ${mockProduct.sku}`,
        error,
      );
    });

    it('should log error when update fails', async () => {
      const existingProduct = { id: 'existing-id' };
      const error = new Error('Update error');
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingProduct as Product);
      jest.spyOn(repository, 'update').mockRejectedValue(error);
      jest.spyOn(logger, 'error');

      await service.save(mockProduct);

      expect(logger.error).toHaveBeenCalledWith(
        `Error updating product: ${mockProduct.name}, SKU: ${mockProduct.sku}`,
        error,
      );
    });
  });

  describe('saveMany', () => {
    it('should save multiple products', async () => {
      const products = [mockProduct, { ...mockProduct, id: 'another-id', sku: 'SKU-456' }];
      jest.spyOn(service, 'save').mockResolvedValue();

      await service.saveMany(products);

      expect(service.save).toHaveBeenCalledTimes(2);
      expect(service.save).toHaveBeenCalledWith(products[0]);
      expect(service.save).toHaveBeenCalledWith(products[1]);
    });

    it('should handle empty products array', async () => {
      jest.spyOn(service, 'save').mockResolvedValue();

      await service.saveMany([]);

      expect(service.save).not.toHaveBeenCalled();
    });

    it('should handle undefined products array', async () => {
      jest.spyOn(service, 'save').mockResolvedValue();

      await service.saveMany();

      expect(service.save).not.toHaveBeenCalled();
    });
  });
});
