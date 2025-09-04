import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductRepository } from './product.repository';
import { Product } from '@modules/products/entities';

import { ProductFactory } from '@factories/product.factory';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let mockRepository: jest.Mocked<Repository<Product>>;

  let mockProduct: Product;

  beforeEach(async () => {
    const mockRepositoryMethods = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepositoryMethods,
        },
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    mockRepository = module.get(getRepositoryToken(Product));
    mockProduct = await new ProductFactory().make();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findId', () => {
    it('should return product id when product exists', async () => {
      const externalId = 'ext-123';
      const expectedId = '550e8400-e29b-41d4-a716-446655440000';
      const partialProduct = { ...mockProduct, id: expectedId };
      mockRepository.findOne.mockResolvedValue(partialProduct);

      const result = await productRepository.findId(externalId);

      expect(result).toBe(expectedId);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        select: ['id'],
        where: { externalId },
      });
    });

    it('should return null when product does not exist', async () => {
      const externalId = 'non-existent';
      mockRepository.findOne.mockResolvedValue(null);

      const result = await productRepository.findId(externalId);

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        select: ['id'],
        where: { externalId },
      });
    });
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const productToCreate = { ...mockProduct };
      const savedProduct = { ...mockProduct };
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await productRepository.create(productToCreate);

      expect(result).toEqual(savedProduct);
      expect(mockRepository.save).toHaveBeenCalledWith(productToCreate);
    });

    it('should handle repository save errors', async () => {
      const productToCreate = { ...mockProduct };
      const error = new Error('Database error');
      mockRepository.save.mockRejectedValue(error);

      await expect(productRepository.create(productToCreate)).rejects.toThrow('Database error');
      expect(mockRepository.save).toHaveBeenCalledWith(productToCreate);
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      const productToUpdate = { ...mockProduct, name: 'Updated Product' };
      const updatedProduct = { ...mockProduct, name: 'Updated Product' };

      mockRepository.update.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });
      mockRepository.findOne.mockResolvedValue(updatedProduct);

      const result = await productRepository.update(productId, productToUpdate);

      expect(result).toEqual(updatedProduct);
      expect(mockRepository.update).toHaveBeenCalledWith(productId, productToUpdate);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
    });

    it('should return null when product is not found after update', async () => {
      const productId = 'non-existent-id';
      const productToUpdate = { ...mockProduct };

      mockRepository.update.mockResolvedValue({ affected: 0, raw: {}, generatedMaps: [] });
      mockRepository.findOne.mockResolvedValue(null);

      const result = await productRepository.update(productId, productToUpdate);

      expect(result).toBeNull();
      expect(mockRepository.update).toHaveBeenCalledWith(productId, productToUpdate);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
    });

    it('should handle repository update errors', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      const productToUpdate = { ...mockProduct };
      const error = new Error('Database update error');

      mockRepository.update.mockRejectedValue(error);

      await expect(productRepository.update(productId, productToUpdate)).rejects.toThrow(
        'Database update error',
      );
      expect(mockRepository.update).toHaveBeenCalledWith(productId, productToUpdate);
    });

    it('should handle repository findOne errors after update', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      const productToUpdate = { ...mockProduct };
      const error = new Error('Database findOne error');

      mockRepository.update.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });
      mockRepository.findOne.mockRejectedValue(error);

      await expect(productRepository.update(productId, productToUpdate)).rejects.toThrow(
        'Database findOne error',
      );
      expect(mockRepository.update).toHaveBeenCalledWith(productId, productToUpdate);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
    });
  });

  it('should be defined', () => {
    expect(productRepository).toBeDefined();
  });
});
