import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsCategoryReportService } from './products-category-report.service';
import { Product } from '@modules/products/entities';
import { ProductsCategoryReportResponseDto } from '@modules/products/dto';

import { queryBuilderMock } from '@mocks/typeorm-query-builder';

type MockRawResult = {
  category: string;
  products: string;
  percentage: string;
};

type MockRawResultWithNulls = {
  category: string;
  products: string | null;
  percentage: string | null;
};

describe('ProductsCategoryReportService', () => {
  let service: ProductsCategoryReportService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCategoryReportService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsCategoryReportService>(ProductsCategoryReportService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('runReport', () => {
    it('should return categorized products with correct percentages', async () => {
      const mockRawResult: MockRawResult[] = [
        { category: 'Electronics', products: '10', percentage: '50.00' },
        { category: 'Clothing', products: '6', percentage: '30.00' },
        { category: 'Books', products: '4', percentage: '20.00' },
      ];

      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue(mockRawResult);

      const result = await service.runReport();

      const expectedResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Electronics', products: 10, percentage: 50.0 },
          { category: 'Clothing', products: 6, percentage: 30.0 },
          { category: 'Books', products: 4, percentage: 20.0 },
        ],
      };

      expect(result).toEqual(expectedResult);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.select).toHaveBeenCalledWith(expect.stringContaining('category'));
      expect(queryBuilderMock.groupBy).toHaveBeenCalledWith('category');
      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('category', 'ASC');
      expect(queryBuilderMock.getRawMany).toHaveBeenCalled();
    });

    it('should return empty categories when no products exist', async () => {
      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue([]);

      const result = await service.runReport();

      expect(result).toEqual({ categories: [] });
      expect(queryBuilderMock.getRawMany).toHaveBeenCalled();
    });

    it('should handle single category correctly', async () => {
      const mockRawResult: MockRawResult[] = [
        { category: 'Electronics', products: '5', percentage: '100.00' },
      ];

      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue(mockRawResult);

      const result = await service.runReport();

      const expectedResult: ProductsCategoryReportResponseDto = {
        categories: [{ category: 'Electronics', products: 5, percentage: 100.0 }],
      };

      expect(result).toEqual(expectedResult);
    });

    it('should handle floating point percentages correctly', async () => {
      const mockRawResult: MockRawResult[] = [
        { category: 'Electronics', products: '7', percentage: '33.333333' },
        { category: 'Clothing', products: '8', percentage: '38.095238' },
        { category: 'Books', products: '6', percentage: '28.571429' },
      ];

      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue(mockRawResult);

      const result = await service.runReport();

      const expectedResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Electronics', products: 7, percentage: 33.33 },
          { category: 'Clothing', products: 8, percentage: 38.1 },
          { category: 'Books', products: 6, percentage: 28.57 },
        ],
      };

      expect(result).toEqual(expectedResult);
    });

    it('should handle null values gracefully', async () => {
      const mockRawResult: MockRawResultWithNulls[] = [
        { category: 'Electronics', products: null, percentage: null },
        { category: 'Books', products: '5', percentage: '100.00' },
      ];

      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue(mockRawResult);

      const result = await service.runReport();

      const expectedResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Electronics', products: 0, percentage: 0 },
          { category: 'Books', products: 5, percentage: 100.0 },
        ],
      };

      expect(result).toEqual(expectedResult);
    });

    it('should handle string numbers correctly', async () => {
      const mockRawResult: MockRawResult[] = [
        { category: 'Electronics', products: '15', percentage: '75.00' },
        { category: 'Clothing', products: '5', percentage: '25.00' },
      ];

      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue(mockRawResult);

      const result = await service.runReport();

      const expectedResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Electronics', products: 15, percentage: 75.0 },
          { category: 'Clothing', products: 5, percentage: 25.0 },
        ],
      };

      expect(result).toEqual(expectedResult);
    });

    it('should maintain alphabetical order of categories', async () => {
      const mockRawResult: MockRawResult[] = [
        { category: 'Books', products: '3', percentage: '15.00' },
        { category: 'Electronics', products: '10', percentage: '50.00' },
        { category: 'Clothing', products: '7', percentage: '35.00' },
      ];

      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue(mockRawResult);

      const result = await service.runReport();

      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('category', 'ASC');

      const expectedResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Books', products: 3, percentage: 15.0 },
          { category: 'Electronics', products: 10, percentage: 50.0 },
          { category: 'Clothing', products: 7, percentage: 35.0 },
        ],
      };

      expect(result).toEqual(expectedResult);
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database connection error');

      jest.spyOn(queryBuilderMock, 'getRawMany').mockRejectedValue(error);

      await expect(service.runReport()).rejects.toThrow('Database connection error');
      expect(queryBuilderMock.getRawMany).toHaveBeenCalled();
    });

    it('should handle zero products count correctly', async () => {
      const mockRawResult: MockRawResult[] = [
        { category: 'Electronics', products: '0', percentage: '0.00' },
      ];

      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue(mockRawResult);

      const result = await service.runReport();

      const expectedResult: ProductsCategoryReportResponseDto = {
        categories: [{ category: 'Electronics', products: 0, percentage: 0.0 }],
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
