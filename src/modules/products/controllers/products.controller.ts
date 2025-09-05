import {
  Controller,
  Get,
  Delete,
  Query,
  ValidationPipe,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { FetchAndStoreService, SearchService, DeleteService } from '@modules/products/use-cases';

import { ListProductsDto } from '@modules/products/dto/list-products.dto';
import { Product } from '@modules/products/entities/product.entity';
import { ProductsPage } from '@modules/products/entities';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly fetchAndStoreService: FetchAndStoreService,
    private readonly searchService: SearchService,
    private readonly deleteService: DeleteService,
  ) {}

  @Cron(process.env.CRON_FETCH_PRODUCTS!)
  async fetchAndStore(): Promise<void> {
    return this.fetchAndStoreService.run();
  }

  @Get('search')
  search(
    @Query(new ValidationPipe({ transform: true })) query: ListProductsDto,
  ): Promise<ProductsPage> {
    return this.searchService.run(query);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<Product | object> {
    return this.deleteService.run(id);
  }
}
