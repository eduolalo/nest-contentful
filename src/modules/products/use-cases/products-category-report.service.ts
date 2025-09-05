import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProductsCategoryReportResponseDto, ProductsCategoryCountDto } from '@modules/products/dto';

import { Product } from '@modules/products/entities';

@Injectable()
export class ProductsCategoryReportService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async runReport(): Promise<ProductsCategoryReportResponseDto> {
    const countQuery = `
      category,
      count(*) AS products,
      (COUNT(*) * 100.0) / SUM(COUNT(*)) OVER() AS percentage
    `;

    const result = await this.repository
      .createQueryBuilder('product')
      .select(countQuery)
      .groupBy('category')
      .orderBy('category', 'ASC')
      .getRawMany<ProductsCategoryCountDto>();

    const categories = result.map((item) => ({
      category: item.category,
      products: Number(item.products) || 0,
      percentage: Number(Number(item.percentage).toFixed(2)) || 0,
    }));

    return { categories };
  }
}
