import { Test, TestingModule } from '@nestjs/testing';

import { FetchAndStoreService, SearchService, DeleteService } from '@modules/products/use-cases';
import { ProductsController } from './products.controller';

import { ListProductsDto } from '@modules/products/dto/list-products.dto';

import { Product } from '@modules/products/entities/product.entity';
import { ProductsPage } from '@modules/products/entities';

import { ProductFactory } from '@factories/product.factory';

const useValue = {
  run: jest.fn(),
};

describe('ProductsController', () => {
  let controller: ProductsController;

  let fetchAndStoreService: FetchAndStoreService;
  let searchService: SearchService;
  let deleteService: DeleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: FetchAndStoreService,
          useValue,
        },
        {
          provide: SearchService,
          useValue,
        },
        {
          provide: DeleteService,
          useValue,
        },
      ],
    }).compile();

    fetchAndStoreService = module.get<FetchAndStoreService>(FetchAndStoreService);
    searchService = module.get<SearchService>(SearchService);
    deleteService = module.get<DeleteService>(DeleteService);

    controller = module.get<ProductsController>(ProductsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();

    expect(fetchAndStoreService).toBeDefined();
    expect(searchService).toBeDefined();
  });

  describe('fetchAndStore', () => {
    it('should call fetchAndStoreService.run and return void', async () => {
      jest.spyOn(fetchAndStoreService, 'run').mockResolvedValue(undefined);

      const result = await controller.fetchAndStore();

      expect(result).toBeUndefined();
      expect(fetchAndStoreService.run).toHaveBeenCalledTimes(1);
      expect(fetchAndStoreService.run).toHaveBeenCalledWith();
    });

    it('should propagate errors from fetchAndStoreService.run', async () => {
      const error = new Error('Service error');
      jest.spyOn(fetchAndStoreService, 'run').mockRejectedValue(error);

      await expect(controller.fetchAndStore()).rejects.toThrow('Service error');
      expect(fetchAndStoreService.run).toHaveBeenCalledTimes(1);
    });
  });

  describe('search', () => {
    it('should call searchService.run with query and return ProductsPage', async () => {
      const query: ListProductsDto = {
        page: 1,
        itemsPerPage: 5,
        sku: 'TEST-SKU',
      };
      const mockResult = new ProductsPage({
        items: [],
        pagination: {
          page: 1,
          itemsPerPage: 5,
          totalItems: 0,
          totalPages: 0,
        },
      });
      jest.spyOn(searchService, 'run').mockResolvedValue(mockResult);

      const result = await controller.search(query);

      expect(result).toEqual(mockResult);
      expect(searchService.run).toHaveBeenCalledTimes(1);
      expect(searchService.run).toHaveBeenCalledWith(query);
    });

    it('should propagate errors from searchService.run', async () => {
      const query: ListProductsDto = { page: 1, itemsPerPage: 5 };
      const error = new Error('Search service error');
      jest.spyOn(searchService, 'run').mockRejectedValue(error);

      await expect(controller.search(query)).rejects.toThrow('Search service error');
      expect(searchService.run).toHaveBeenCalledTimes(1);
      expect(searchService.run).toHaveBeenCalledWith(query);
    });
  });

  describe('delete', () => {
    it('should call deleteService.run with id and return Product', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      const mockProduct: Product = await new ProductFactory().make({ id: productId });

      jest.spyOn(deleteService, 'run').mockResolvedValue(mockProduct);

      const result = await controller.delete(productId);

      expect(result).toEqual(mockProduct);
      expect(deleteService.run).toHaveBeenCalledTimes(1);
      expect(deleteService.run).toHaveBeenCalledWith(productId);
    });

    it('should return empty object when product does not exist', async () => {
      const productId = 'non-existent-id';
      const mockResult = {};
      jest.spyOn(deleteService, 'run').mockResolvedValue(mockResult);

      const result = await controller.delete(productId);

      expect(result).toEqual({});
      expect(deleteService.run).toHaveBeenCalledTimes(1);
      expect(deleteService.run).toHaveBeenCalledWith(productId);
    });

    it('should propagate errors from deleteService.run', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440000';
      const error = new Error('Delete service error');
      jest.spyOn(deleteService, 'run').mockRejectedValue(error);

      await expect(controller.delete(productId)).rejects.toThrow('Delete service error');
      expect(deleteService.run).toHaveBeenCalledTimes(1);
      expect(deleteService.run).toHaveBeenCalledWith(productId);
    });
  });
});
