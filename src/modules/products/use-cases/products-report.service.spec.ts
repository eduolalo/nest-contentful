import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductsReportService } from '@modules/products/use-cases/products-report.service';
import { ProductsPercentageDto } from '@modules/products/dto/products-percentage.dto';
import { Product } from '@modules/products/entities/product.entity';

import { queryBuilderMock } from '@mocks/typeorm-query-builder';

describe('ProductsReportService', () => {
  let service: ProductsReportService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsReportService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsReportService>(ProductsReportService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runReport', () => {
    it('should generate report without filters', async () => {
      const mockResult = { percentage: 85.5 };
      const dto: ProductsPercentageDto = {};

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.andWhere).not.toHaveBeenCalled();
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
      expect(result).toEqual({
        percentageNumber: 85.5,
        percentageString: '85.50%',
      });
    });

    it('should generate report with price filter', async () => {
      const mockResult = { percentage: 75.25 };
      const dto: ProductsPercentageDto = { price: 100 };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('price = :price', {
        price: 100,
      });
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
      expect(result).toEqual({
        percentageNumber: 75.25,
        percentageString: '75.25%',
      });
    });

    it('should generate report with fromDate filter', async () => {
      const mockResult = { percentage: 90.0 };
      const dto: ProductsPercentageDto = { fromDate: '2023-01-01T00:00:00.000Z' };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('created_at >= :fromDate', {
        fromDate: '2023-01-01T00:00:00.000Z',
      });
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
      expect(result).toEqual({
        percentageNumber: 90.0,
        percentageString: '90.00%',
      });
    });

    it('should generate report with toDate filter', async () => {
      const mockResult = { percentage: 65.75 };
      const dto: ProductsPercentageDto = { toDate: '2023-12-31T23:59:59.999Z' };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('created_at <= :toDate', {
        toDate: '2023-12-31T23:59:59.999Z',
      });
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
      expect(result).toEqual({
        percentageNumber: 65.75,
        percentageString: '65.75%',
      });
    });

    it('should generate report with all filters', async () => {
      const mockResult = { percentage: 55.33 };
      const dto: ProductsPercentageDto = {
        price: 50,
        fromDate: '2023-01-01T00:00:00.000Z',
        toDate: '2023-12-31T23:59:59.999Z',
      };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(3);
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('price = :price', {
        price: 50,
      });
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('created_at >= :fromDate', {
        fromDate: '2023-01-01T00:00:00.000Z',
      });
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('created_at <= :toDate', {
        toDate: '2023-12-31T23:59:59.999Z',
      });
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
      expect(result).toEqual({
        percentageNumber: 55.33,
        percentageString: '55.33%',
      });
    });

    it('should handle null percentage result', async () => {
      const mockResult = { percentage: null };
      const dto: ProductsPercentageDto = {};

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
      expect(result).toEqual({
        percentageNumber: 0,
        percentageString: '0.00%',
      });
    });

    it('should handle undefined percentage result', async () => {
      const mockResult = { percentage: undefined };
      const dto: ProductsPercentageDto = {};

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
      expect(result).toEqual({
        percentageNumber: 0,
        percentageString: '0.00%',
      });
    });

    it('should handle database error', async () => {
      const dto: ProductsPercentageDto = {};
      const error = new Error('Database connection failed');

      jest.spyOn(queryBuilderMock, 'getRawOne').mockRejectedValue(error);

      await expect(service.runReport(dto)).rejects.toThrow('Database connection failed');
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
    });

    it('should format percentage with two decimal places', async () => {
      const mockResult = { percentage: 33.333333 };
      const dto: ProductsPercentageDto = {};

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(result).toEqual({
        percentageNumber: 33.333333,
        percentageString: '33.33%',
      });
    });

    it('should format whole number percentage correctly', async () => {
      const mockResult = { percentage: 100 };
      const dto: ProductsPercentageDto = {};

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport(dto);

      expect(result).toEqual({
        percentageNumber: 100,
        percentageString: '100.00%',
      });
    });
  });
});
