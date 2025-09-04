import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ListProductsDto } from '@modules/products/dto/list-products.dto';
import { FetchAndStoreService, SearchService } from '@modules/products/use-cases';
import { ProductsPage } from '@modules/products/entities';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly fetchAndStoreService: FetchAndStoreService,
    private readonly searchService: SearchService,
  ) {}

  @Cron(process.env.CRON_FETCH_PRODUCTS!)
  async fetchAndStore(): Promise<void> {
    return this.fetchAndStoreService.run();
  }

  @Get('search')
  search(
    @Query(new ValidationPipe({ transform: true })) query: ListProductsDto,
  ): Promise<ProductsPage> {
    return this.searchService.exec(query);
  }
}
