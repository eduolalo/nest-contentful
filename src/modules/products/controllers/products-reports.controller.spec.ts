import { Test, TestingModule } from '@nestjs/testing';

import { ProductsReportsController } from './products-reports.controller';
import {
  DeletedProductsReportService,
  ProductsReportService,
  ProductsCategoryReportService,
} from '@modules/products/use-cases';
import {
  ProductsPercentageResponseDto,
  ProductsPercentageDto,
  ProductsCategoryReportResponseDto,
} from '@modules/products/dto';

describe('ProductsReportsController', () => {
  let controller: ProductsReportsController;

  let productsCategoryReportService: ProductsCategoryReportService;
  let deletedProductsReportService: DeletedProductsReportService;
  let productsReportService: ProductsReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsReportsController],
      providers: [
        {
          provide: ProductsCategoryReportService,
          useValue: {
            runReport: jest.fn(),
          },
        },
        {
          provide: DeletedProductsReportService,
          useValue: {
            runReport: jest.fn(),
          },
        },
        {
          provide: ProductsReportService,
          useValue: {
            runReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsReportsController>(ProductsReportsController);
    productsCategoryReportService = module.get<ProductsCategoryReportService>(
      ProductsCategoryReportService,
    );
    deletedProductsReportService = module.get<DeletedProductsReportService>(
      DeletedProductsReportService,
    );
    productsReportService = module.get<ProductsReportService>(ProductsReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();

    expect(productsCategoryReportService).toBeDefined();
    expect(deletedProductsReportService).toBeDefined();
    expect(productsReportService).toBeDefined();
  });

  describe('getDeletedProductsReport', () => {
    it('should call deletedProductsReportService.runReport and return ProductsPercentageResponseDto', async () => {
      const mockResult: ProductsPercentageResponseDto = {
        percentageNumber: 25.5,
        percentageString: '25.50%',
      };
      jest.spyOn(deletedProductsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getDeletedProductsReport();

      expect(result).toEqual(mockResult);
      expect(deletedProductsReportService.runReport).toHaveBeenCalledTimes(1);
      expect(deletedProductsReportService.runReport).toHaveBeenCalledWith();
    });

    it('should return zero percentage when no deleted products', async () => {
      const mockResult: ProductsPercentageResponseDto = {
        percentageNumber: 0,
        percentageString: '0.00%',
      };
      jest.spyOn(deletedProductsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getDeletedProductsReport();

      expect(result).toEqual(mockResult);
      expect(deletedProductsReportService.runReport).toHaveBeenCalledTimes(1);
    });

    it('should return 100 percentage when all products are deleted', async () => {
      const mockResult: ProductsPercentageResponseDto = {
        percentageNumber: 100,
        percentageString: '100.00%',
      };
      jest.spyOn(deletedProductsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getDeletedProductsReport();

      expect(result).toEqual(mockResult);
      expect(deletedProductsReportService.runReport).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from deletedProductsReportService.runReport', async () => {
      const error = new Error('Database error');
      jest.spyOn(deletedProductsReportService, 'runReport').mockRejectedValue(error);

      await expect(controller.getDeletedProductsReport()).rejects.toThrow('Database error');
      expect(deletedProductsReportService.runReport).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductsReport', () => {
    it('should call productsReportService.runReport with query and return ProductsPercentageResponseDto', async () => {
      const mockQuery: ProductsPercentageDto = {
        price: 100,
        fromDate: '2024-01-01T00:00:00.000Z',
        toDate: '2024-12-31T23:59:59.999Z',
      };
      const mockResult: ProductsPercentageResponseDto = {
        percentageNumber: 45.5,
        percentageString: '45.50%',
      };
      jest.spyOn(productsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsReport(mockQuery);

      expect(result).toEqual(mockResult);
      expect(productsReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsReportService.runReport).toHaveBeenCalledWith(mockQuery);
    });

    it('should handle query with only price filter', async () => {
      const mockQuery: ProductsPercentageDto = {
        price: 50,
      };
      const mockResult: ProductsPercentageResponseDto = {
        percentageNumber: 30.2,
        percentageString: '30.20%',
      };
      jest.spyOn(productsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsReport(mockQuery);

      expect(result).toEqual(mockResult);
      expect(productsReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsReportService.runReport).toHaveBeenCalledWith(mockQuery);
    });

    it('should handle query with only date range filters', async () => {
      const mockQuery: ProductsPercentageDto = {
        fromDate: '2024-06-01T00:00:00.000Z',
        toDate: '2024-06-30T23:59:59.999Z',
      };
      const mockResult: ProductsPercentageResponseDto = {
        percentageNumber: 75.8,
        percentageString: '75.80%',
      };
      jest.spyOn(productsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsReport(mockQuery);

      expect(result).toEqual(mockResult);
      expect(productsReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsReportService.runReport).toHaveBeenCalledWith(mockQuery);
    });

    it('should handle empty query object', async () => {
      const mockQuery: ProductsPercentageDto = {};
      const mockResult: ProductsPercentageResponseDto = {
        percentageNumber: 100,
        percentageString: '100.00%',
      };
      jest.spyOn(productsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsReport(mockQuery);

      expect(result).toEqual(mockResult);
      expect(productsReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsReportService.runReport).toHaveBeenCalledWith(mockQuery);
    });

    it('should return zero percentage when no products match criteria', async () => {
      const mockQuery: ProductsPercentageDto = {
        price: 9999,
        fromDate: '2024-01-01T00:00:00.000Z',
        toDate: '2024-01-02T00:00:00.000Z',
      };
      const mockResult: ProductsPercentageResponseDto = {
        percentageNumber: 0,
        percentageString: '0.00%',
      };
      jest.spyOn(productsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsReport(mockQuery);

      expect(result).toEqual(mockResult);
      expect(productsReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsReportService.runReport).toHaveBeenCalledWith(mockQuery);
    });

    it('should propagate errors from productsReportService.runReport', async () => {
      const mockQuery: ProductsPercentageDto = {
        price: 100,
      };
      const error = new Error('Service error');
      jest.spyOn(productsReportService, 'runReport').mockRejectedValue(error);

      await expect(controller.getProductsReport(mockQuery)).rejects.toThrow('Service error');
      expect(productsReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsReportService.runReport).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe('getProductsCategoryReport', () => {
    it('should call productsCategoryReportService.runReport and return ProductsCategoryReportResponseDto', async () => {
      const mockResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Electronics', products: 10, percentage: 50.0 },
          { category: 'Clothing', products: 6, percentage: 30.0 },
          { category: 'Books', products: 4, percentage: 20.0 },
        ],
      };
      jest.spyOn(productsCategoryReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsCategoryReport();

      expect(result).toEqual(mockResult);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledWith();
    });

    it('should return empty categories when no products exist', async () => {
      const mockResult: ProductsCategoryReportResponseDto = {
        categories: [],
      };
      jest.spyOn(productsCategoryReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsCategoryReport();

      expect(result).toEqual(mockResult);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledWith();
    });

    it('should return single category with 100% when only one category exists', async () => {
      const mockResult: ProductsCategoryReportResponseDto = {
        categories: [{ category: 'Electronics', products: 15, percentage: 100.0 }],
      };
      jest.spyOn(productsCategoryReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsCategoryReport();

      expect(result).toEqual(mockResult);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledWith();
    });

    it('should handle multiple categories with decimal percentages', async () => {
      const mockResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Electronics', products: 7, percentage: 33.33 },
          { category: 'Clothing', products: 8, percentage: 38.1 },
          { category: 'Books', products: 6, percentage: 28.57 },
        ],
      };
      jest.spyOn(productsCategoryReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsCategoryReport();

      expect(result).toEqual(mockResult);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledWith();
    });

    it('should handle categories with zero products', async () => {
      const mockResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Electronics', products: 0, percentage: 0.0 },
          { category: 'Clothing', products: 5, percentage: 100.0 },
        ],
      };
      jest.spyOn(productsCategoryReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsCategoryReport();

      expect(result).toEqual(mockResult);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledWith();
    });

    it('should maintain alphabetical order of categories', async () => {
      const mockResult: ProductsCategoryReportResponseDto = {
        categories: [
          { category: 'Books', products: 3, percentage: 15.0 },
          { category: 'Clothing', products: 7, percentage: 35.0 },
          { category: 'Electronics', products: 10, percentage: 50.0 },
        ],
      };
      jest.spyOn(productsCategoryReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getProductsCategoryReport();

      expect(result).toEqual(mockResult);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledWith();
    });

    it('should propagate errors from productsCategoryReportService.runReport', async () => {
      const error = new Error('Database error');
      jest.spyOn(productsCategoryReportService, 'runReport').mockRejectedValue(error);

      await expect(controller.getProductsCategoryReport()).rejects.toThrow('Database error');
      expect(productsCategoryReportService.runReport).toHaveBeenCalledTimes(1);
      expect(productsCategoryReportService.runReport).toHaveBeenCalledWith();
    });
  });
});
