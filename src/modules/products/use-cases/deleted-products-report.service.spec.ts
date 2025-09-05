import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeletedProductsReportService } from '@modules/products/use-cases';
import { Product } from '@modules/products/entities';

import { queryBuilderMock } from '@mocks/typeorm-query-builder';

describe('DeletedProductsReportService', () => {
  let service: DeletedProductsReportService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletedProductsReportService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
          },
        },
      ],
    }).compile();

    service = module.get<DeletedProductsReportService>(DeletedProductsReportService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runReport', () => {
    it('should return correct percentage when products exist', async () => {
      const mockResult = { percentage: '25.50' };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport();

      expect(result).toEqual({
        percentageNumber: 25.5,
        percentageString: '25.50%',
      });
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryBuilderMock.select).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        'percentage',
      );
      expect(queryBuilderMock.withDeleted).toHaveBeenCalled();
      expect(queryBuilderMock.getRawOne).toHaveBeenCalled();
    });

    it('should return zero percentage when no products exist', async () => {
      const mockResult = { percentage: '0' };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport();

      expect(result).toEqual({
        percentageNumber: 0,
        percentageString: '0.00%',
      });
    });

    it('should return zero percentage when result is null', async () => {
      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(null);

      const result = await service.runReport();

      expect(result).toEqual({
        percentageNumber: 0,
        percentageString: '0.00%',
      });
    });

    it('should return zero percentage when percentage is null', async () => {
      const mockResult = { percentage: null };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport();

      expect(result).toEqual({
        percentageNumber: 0,
        percentageString: '0.00%',
      });
    });

    it('should handle floating point percentages correctly', async () => {
      const mockResult = { percentage: '33.333333' };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport();

      expect(result).toEqual({
        percentageNumber: 33.333333,
        percentageString: '33.33%',
      });
    });

    it('should handle 100 percentage correctly', async () => {
      const mockResult = { percentage: '100' };

      jest.spyOn(queryBuilderMock, 'getRawOne').mockResolvedValue(mockResult);

      const result = await service.runReport();

      expect(result).toEqual({
        percentageNumber: 100,
        percentageString: '100.00%',
      });
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');

      jest.spyOn(queryBuilderMock, 'getRawOne').mockRejectedValue(error);

      await expect(service.runReport()).rejects.toThrow('Database error');
    });
  });
});
