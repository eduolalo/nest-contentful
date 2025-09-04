import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from './products.controller';
import { FetchAndStoreService } from '@modules/products/use-cases';

describe('ProductsController', () => {
  let controller: ProductsController;
  let fetchAndStoreService: FetchAndStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: FetchAndStoreService,
          useValue: {
            run: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    fetchAndStoreService = module.get<FetchAndStoreService>(FetchAndStoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(fetchAndStoreService).toBeDefined();
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
});
