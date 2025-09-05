import { Controller, Get, Query, ValidationPipe, UseGuards } from '@nestjs/common';

import { DeletedProductsReportService, ProductsReportService } from '@modules/products/use-cases';

import { JwtAuthGuard } from '@modules/auth/guards';

import { ProductsPercentageResponseDto, ProductsPercentageDto } from '@modules/products/dto';

@Controller('products-reports')
export class ProductsReportsController {
  constructor(
    private readonly deletedProductsReportService: DeletedProductsReportService,
    private readonly productsReportService: ProductsReportService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('deleted-percentage')
  async getDeletedProductsReport(): Promise<ProductsPercentageResponseDto> {
    return this.deletedProductsReportService.runReport();
  }

  @UseGuards(JwtAuthGuard)
  @Get('percentage')
  async getProductsReport(
    @Query(new ValidationPipe({ transform: true })) query: ProductsPercentageDto,
  ): Promise<ProductsPercentageResponseDto> {
    return this.productsReportService.runReport(query);
  }
}
