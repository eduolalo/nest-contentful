export class ProductsCategoryReportResponseDto {
  categories: ProductsCategoryCountDto[];
}

export class ProductsCategoryCountDto {
  percentage: number;
  category: string;
  products: number;
}
