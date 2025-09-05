import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

import { ListProductsDto } from '@modules/products/dto/list-products.dto';
import { Product, ProductsPage } from '@modules/products/entities';
import { SearchService } from './search.service';

import { ProductFactory } from '@factories/product.factory';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

jest.mock('@common/adapters', () => ({
  typeormPaginationAdapter: jest.fn((meta) => ({
    page: meta.currentPage,
    itemsPerPage: meta.itemsPerPage,
    totalItems: meta.totalItems,
    totalPages: meta.totalPages,
  })),
}));

describe('SearchService', () => {
  let service: SearchService;
  let repository: Repository<Product>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<Product>>;

  let mockProduct: Product;

  beforeEach(async () => {
    queryBuilder = {
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<SelectQueryBuilder<Product>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    service = module.get<SearchService>(SearchService);
    mockProduct = await new ProductFactory().make();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('run', () => {
    it('should return paginated products with default filters', async () => {
      const query: ListProductsDto = {
        page: 1,
        itemsPerPage: 5,
      };
      const mockPaginationResult = {
        items: [mockProduct],
        meta: {
          currentPage: 1,
          itemsPerPage: 5,
          totalItems: 1,
          totalPages: 1,
        },
      };
      const paginateMock = paginate as jest.MockedFunction<typeof paginate>;
      paginateMock.mockResolvedValue(mockPaginationResult);
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);
      jest.spyOn(queryBuilder, 'orderBy').mockReturnThis();
      jest.spyOn(queryBuilder, 'andWhere').mockReturnThis();

      const result = await service.run(query);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('product.name', 'ASC');
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(paginate).toHaveBeenCalledWith(queryBuilder, {
        page: 1,
        limit: 5,
      });
      expect(result).toBeInstanceOf(ProductsPage);
      expect(result.items).toEqual([mockProduct]);
    });

    it('should apply string filters with ILIKE operator', async () => {
      const query: ListProductsDto = {
        page: 1,
        itemsPerPage: 5,
        sku: 'TEST-SKU',
        name: 'Test Product',
      };
      const mockPaginationResult = {
        items: [mockProduct],
        meta: {
          currentPage: 1,
          itemsPerPage: 5,
          totalItems: 1,
          totalPages: 1,
        },
      };
      const paginateMock = paginate as jest.MockedFunction<typeof paginate>;
      paginateMock.mockResolvedValue(mockPaginationResult);
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);
      jest.spyOn(queryBuilder, 'orderBy').mockReturnThis();
      jest.spyOn(queryBuilder, 'andWhere').mockReturnThis();

      await service.run(query);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.sku ILIKE :sku', {
        sku: '%TEST-SKU%',
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.name ILIKE :name', {
        name: '%Test Product%',
      });
    });

    it('should apply number filters with equals operator', async () => {
      const query: ListProductsDto = {
        page: 1,
        itemsPerPage: 5,
        price: 99.99,
        stock: 10,
      };
      const mockPaginationResult = {
        items: [mockProduct],
        meta: {
          currentPage: 1,
          itemsPerPage: 5,
          totalItems: 1,
          totalPages: 1,
        },
      };
      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      await service.run(query);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.price = :price', {
        price: 99.99,
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.stock = :stock', {
        stock: 10,
      });
    });

    it('should skip empty/null/undefined filters', async () => {
      const query: ListProductsDto = {
        page: 1,
        itemsPerPage: 5,
        sku: '',
        name: undefined,
      };
      const mockPaginationResult = {
        items: [mockProduct],
        meta: {
          currentPage: 1,
          itemsPerPage: 5,
          totalItems: 1,
          totalPages: 1,
        },
      };
      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      await service.run(query);

      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should handle mixed string and number filters', async () => {
      const query: ListProductsDto = {
        page: 2,
        itemsPerPage: 10,
        sku: 'SKU-123',
        price: 99.99,
        brand: 'Test Brand',
        stock: 5,
      };
      const mockPaginationResult = {
        items: [mockProduct],
        meta: {
          currentPage: 2,
          itemsPerPage: 10,
          totalItems: 15,
          totalPages: 2,
        },
      };
      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      const result = await service.run(query);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('product.name', 'ASC');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.sku ILIKE :sku', {
        sku: '%SKU-123%',
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.price = :price', {
        price: 99.99,
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.brand ILIKE :brand', {
        brand: '%Test Brand%',
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.stock = :stock', {
        stock: 5,
      });
      expect(paginate).toHaveBeenCalledWith(queryBuilder, {
        page: 2,
        limit: 10,
      });
      expect(result).toBeInstanceOf(ProductsPage);
    });

    it('should handle pagination errors', async () => {
      const query: ListProductsDto = {
        page: 1,
        itemsPerPage: 5,
      };
      const error = new Error('Database error');
      (paginate as jest.Mock).mockRejectedValue(error);

      await expect(service.run(query)).rejects.toThrow('Database error');
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(paginate).toHaveBeenCalledWith(queryBuilder, {
        page: 1,
        limit: 5,
      });
    });

    it('should return empty results when no products found', async () => {
      const query: ListProductsDto = {
        page: 1,
        itemsPerPage: 5,
      };
      const mockPaginationResult = {
        items: [],
        meta: {
          currentPage: 1,
          itemsPerPage: 5,
          totalItems: 0,
          totalPages: 0,
        },
      };
      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      const result = await service.run(query);

      expect(result).toBeInstanceOf(ProductsPage);
      expect(result.items).toEqual([]);
      expect(result.pagination.totalItems).toBe(0);
    });
  });
});
