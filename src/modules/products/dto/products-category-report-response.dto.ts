import { ApiResponseNoStatusOptions } from '@nestjs/swagger';
export class ProductsCategoryReportResponseDto {
  categories: ProductsCategoryCountDto[];
}

export class ProductsCategoryCountDto {
  percentage: number;
  category: string;
  products: number;
}

export const ProductsCategoryReportResponseSchema: ApiResponseNoStatusOptions = {
  description: 'Response schema for product category reports',
  type: ProductsCategoryReportResponseDto,
  example: {
    categories: [
      { category: 'Camera', products: 10, percentage: 50.0 },
      { category: 'Laptop', products: 5, percentage: 25.0 },
      { category: 'Smartphone', products: 5, percentage: 25.0 },
    ],
  },
};
