import { Controller, Get } from '@nestjs/common';

import { DeletedProductsReportService } from '@modules/products/use-cases';

import { DeletedProductsPercentageDto } from '@modules/products/dto';

@Controller('products-reports')
export class ProductsReportsController {
  constructor(private readonly deletedProductsReportService: DeletedProductsReportService) {}

  @Get('deleted-percentage')
  async getDeletedProductsReport(): Promise<DeletedProductsPercentageDto> {
    return this.deletedProductsReportService.runReport();
  }
}
