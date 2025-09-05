import { Controller, Get, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import {
  ProductsCategoryReportService,
  DeletedProductsReportService,
  ProductsReportService,
} from '@modules/products/use-cases';

import { JwtAuthGuard } from '@modules/auth/guards';

import {
  ProductsCategoryReportResponseDto,
  ProductsPercentageResponseDto,
  ProductsPercentageDto,
} from '@modules/products/dto';

import {
  ProductsCategoryReportResponseSchema,
  ProductsPercentageResponseSchema,
} from '@modules/products/dto';

@ApiBearerAuth('access-token')
@Controller('products-reports')
export class ProductsReportsController {
  constructor(
    private readonly productsCategoryReportService: ProductsCategoryReportService,
    private readonly deletedProductsReportService: DeletedProductsReportService,
    private readonly productsReportService: ProductsReportService,
  ) {}

  @ApiOkResponse(ProductsPercentageResponseSchema)
  @UseGuards(JwtAuthGuard)
  @Get('deleted-percentage')
  async getDeletedProductsReport(): Promise<ProductsPercentageResponseDto> {
    return this.deletedProductsReportService.runReport();
  }

  @ApiOkResponse(ProductsPercentageResponseSchema)
  @UseGuards(JwtAuthGuard)
  @Get('percentage')
  async getProductsReport(
    @Query(new ValidationPipe({ transform: true })) query: ProductsPercentageDto,
  ): Promise<ProductsPercentageResponseDto> {
    return this.productsReportService.runReport(query);
  }

  @ApiOkResponse(ProductsCategoryReportResponseSchema)
  @UseGuards(JwtAuthGuard)
  @Get('categories')
  async getProductsCategoryReport(): Promise<ProductsCategoryReportResponseDto> {
    return this.productsCategoryReportService.runReport();
  }
}
