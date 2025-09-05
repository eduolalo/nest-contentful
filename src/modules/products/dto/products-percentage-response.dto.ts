import { ApiResponseNoStatusOptions } from '@nestjs/swagger';

export class ProductsPercentageResponseDto {
  percentageNumber: number;
  percentageString: string;
}

export const ProductsPercentageResponseSchema: ApiResponseNoStatusOptions = {
  description: 'Response schema for product percentage reports',
  type: ProductsPercentageResponseDto,
  example: { percentageNumber: 12.34, percentageString: '12.34%' },
};
