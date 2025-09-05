import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeleteService } from './delete.service';
import { Product } from '@modules/products/entities';
import { ProductFactory } from '@factories/product.factory';

describe('DeleteService', () => {
  let service: DeleteService;
  let repository: Repository<Product>;

  let mockProduct: Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            existsBy: jest.fn(),
            softDelete: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteService>(DeleteService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    mockProduct = await new ProductFactory().make();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('run', () => {
    it('should delete existing product and return it', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
      jest.spyOn(repository, 'softDelete').mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProduct);

      const result = await service.run(productId);

      expect(result).toEqual(mockProduct);
      expect(repository.existsBy).toHaveBeenCalledTimes(1);
      expect(repository.existsBy).toHaveBeenCalledWith({ id: productId });
      expect(repository.softDelete).toHaveBeenCalledTimes(1);
      expect(repository.softDelete).toHaveBeenCalledWith({ id: productId });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        withDeleted: true,
      });
    });

    it('should return empty object when product does not exist', async () => {
      const productId = 'non-existent-id';
      jest.spyOn(repository, 'existsBy').mockResolvedValue(false);
      jest.spyOn(repository, 'softDelete');
      jest.spyOn(repository, 'findOne');

      const result = await service.run(productId);

      expect(result).toEqual({});
      expect(repository.existsBy).toHaveBeenCalledTimes(1);
      expect(repository.existsBy).toHaveBeenCalledWith({ id: productId });
      expect(repository.softDelete).not.toHaveBeenCalled();
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('should return empty object when product not found after deletion', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
      jest.spyOn(repository, 'softDelete').mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.run(productId);

      expect(result).toEqual({});
      expect(repository.existsBy).toHaveBeenCalledTimes(1);
      expect(repository.existsBy).toHaveBeenCalledWith({ id: productId });
      expect(repository.softDelete).toHaveBeenCalledTimes(1);
      expect(repository.softDelete).toHaveBeenCalledWith({ id: productId });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        withDeleted: true,
      });
    });

    it('should handle existsBy errors', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      const error = new Error('Database connection error');
      jest.spyOn(repository, 'existsBy').mockRejectedValue(error);
      jest.spyOn(repository, 'softDelete');
      jest.spyOn(repository, 'findOne');

      await expect(service.run(productId)).rejects.toThrow('Database connection error');
      expect(repository.existsBy).toHaveBeenCalledTimes(1);
      expect(repository.existsBy).toHaveBeenCalledWith({ id: productId });
      expect(repository.softDelete).not.toHaveBeenCalled();
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('should handle softDelete errors', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      const error = new Error('Soft delete failed');
      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
      jest.spyOn(repository, 'softDelete').mockRejectedValue(error);
      jest.spyOn(repository, 'findOne');

      await expect(service.run(productId)).rejects.toThrow('Soft delete failed');
      expect(repository.existsBy).toHaveBeenCalledTimes(1);
      expect(repository.existsBy).toHaveBeenCalledWith({ id: productId });
      expect(repository.softDelete).toHaveBeenCalledTimes(1);
      expect(repository.softDelete).toHaveBeenCalledWith({ id: productId });
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('should handle findOne errors', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      const error = new Error('Find operation failed');
      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
      jest.spyOn(repository, 'softDelete').mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });
      jest.spyOn(repository, 'findOne').mockRejectedValue(error);

      await expect(service.run(productId)).rejects.toThrow('Find operation failed');
      expect(repository.existsBy).toHaveBeenCalledTimes(1);
      expect(repository.existsBy).toHaveBeenCalledWith({ id: productId });
      expect(repository.softDelete).toHaveBeenCalledTimes(1);
      expect(repository.softDelete).toHaveBeenCalledWith({ id: productId });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        withDeleted: true,
      });
    });
  });
});
