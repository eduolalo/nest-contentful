import { Cron } from '@nestjs/schedule';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Delete,
  Query,
  ValidationPipe,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';

import { FetchAndStoreService, SearchService, DeleteService } from '@modules/products/use-cases';

import {
  ProductDeletedSchema,
  ListProductsSchema,
  ListProductsDto,
} from '@modules/products/dto/list-products.dto';
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

  @ApiOkResponse(ListProductsSchema)
  @Get('search')
  search(
    @Query(new ValidationPipe({ transform: true })) query: ListProductsDto,
  ): Promise<ProductsPage> {
    return this.searchService.run(query);
  }

  @ApiOkResponse(ProductDeletedSchema)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<Product | object> {
    return this.deleteService.run(id);
  }
}
