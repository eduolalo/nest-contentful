import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { FetchAndStoreService } from '@modules/products/use-cases';

@Controller('products')
export class ProductsController {
  constructor(private readonly fetchAndStoreService: FetchAndStoreService) {}

  @Cron(process.env.CRON_FETCH_PRODUCTS!)
  async fetchAndStore(): Promise<void> {
    return this.fetchAndStoreService.run();
  }
}
