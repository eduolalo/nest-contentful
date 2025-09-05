import { Test, TestingModule } from '@nestjs/testing';

import { ProductsReportsController } from './products-reports.controller';
import { DeletedProductsReportService } from '@modules/products/use-cases';
import { DeletedProductsPercentageDto } from '@modules/products/dto';

describe('ProductsReportsController', () => {
  let controller: ProductsReportsController;
  let deletedProductsReportService: DeletedProductsReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsReportsController],
      providers: [
        {
          provide: DeletedProductsReportService,
          useValue: {
            runReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsReportsController>(ProductsReportsController);
    deletedProductsReportService = module.get<DeletedProductsReportService>(
      DeletedProductsReportService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(deletedProductsReportService).toBeDefined();
  });

  describe('getDeletedProductsReport', () => {
    it('should call deletedProductsReportService.runReport and return DeletedProductsPercentageDto', async () => {
      const mockResult: DeletedProductsPercentageDto = {
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
      const mockResult: DeletedProductsPercentageDto = {
        percentageNumber: 0,
        percentageString: '0.00%',
      };
      jest.spyOn(deletedProductsReportService, 'runReport').mockResolvedValue(mockResult);

      const result = await controller.getDeletedProductsReport();

      expect(result).toEqual(mockResult);
      expect(deletedProductsReportService.runReport).toHaveBeenCalledTimes(1);
    });

    it('should return 100 percentage when all products are deleted', async () => {
      const mockResult: DeletedProductsPercentageDto = {
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
});
